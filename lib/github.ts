import { format, subDays } from "date-fns";

// Configuration for retry mechanism
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
  timeout: 15000,
};

class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public url?: string,
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

function calculateBackoff(attempt: number): number {
  const delay = Math.min(
    RETRY_CONFIG.maxDelay,
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
  );
  return delay + Math.random() * 1000;
}

// Function to validate GitHub access token

const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Invalid GitHub token:", response.status);
      return false;
    }

    console.log("GitHub token is valid.");
    return true;
  } catch {
    return false;
  }
};

// Function to check rate limits
// const checkRateLimit = async (token: string): Promise<boolean> => {
//   try {
//     const response = await fetch("https://api.github.com/rate_limit", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//
//     const data = await response.json();
//     const remaining = data.rate?.remaining;
//
//     console.log(`GitHub API Rate Limit Remaining: ${remaining}`);
//
//     return remaining > 0;
//   } catch {
//     return false;
//   }
// };
//
// Function to execute GraphQL queries
async function executeGraphQLQuery(
  query: string,
  token: string,
  variables = {},
) {
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "GitHub-Metrics-Dashboard",
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.status === 401) {
        throw new GitHubAPIError("GitHub API error: 401 (Unauthorized)", 401);
      }

      if (!response.ok) {
        throw new GitHubAPIError(
          `GitHub API error: ${response.status}`,
          response.status,
        );
      }

      const result = await response.json();
      if (result.errors) {
        throw new GitHubAPIError(
          `GraphQL Error: ${result.errors[0].message}`,
          400,
        );
      }

      return result.data;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const backoffTime = calculateBackoff(attempt);
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  throw new Error(`Failed after ${RETRY_CONFIG.maxRetries} attempts.`);
}

export async function fetchGitHubMetrics(userId: string) {
  const DEFAULT_METRICS = {
    totalCommits: 0,
    totalLines: 0,
    repositories: [],
    githubProfile: null,
    weeklyCommits: {},
    totalCodingHours: 0,
    filesChanged: 0,
    dailyActivity: {},
    language: {},
  };

  try {
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/token?userId=${userId}`,
    );

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token, status: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData || !tokenData.accessToken) {
      throw new Error(" No GitHub token found for user");
    }

    const token = tokenData.accessToken;

    const isValid = await validateToken(token);
    if (!isValid) {
      throw new Error("GitHub token is invalid or expired.");
    }

    // Initialize date-based metrics
    const weeklyCommits: { [date: string]: number } = {};
    const dailyActivity: { [date: string]: number } = {};
    for (let i = 0; i < 28; i++) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      weeklyCommits[date] = 0;
      dailyActivity[date] = 0;
    }

    // **GraphQL query**
    const query = `
      query ($after: String) {
        viewer {
          login
          avatarUrl
          repositories(first: 100, after: $after, ownerAffiliations: [OWNER]) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              description
              url
              stargazerCount
              forkCount
              pushedAt
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 100) {
                      totalCount
                      nodes {
                        committedDate
                        additions
                        deletions
                        changedFiles
                      }
                    }
                  }
                }
              }
              languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
              refs(refPrefix: "refs/heads/", first: 100) {
                totalCount
              }
            }
          }
        }
      }
    `;

    let hasNextPage = true;
    let endCursor = null;
    let totalCommits = 0;
    let totalLines = 0;
    let filesChanged = 0;
    const repoStats = [];
    const languageBytes: Record<string, number> = {};
    let userProfile = null;

    while (hasNextPage) {
      const data = await executeGraphQLQuery(query, token, {
        after: endCursor,
      });

      if (!userProfile) {
        userProfile = {
          username: data.viewer.login,
          avatarUrl: data.viewer.avatarUrl,
        };
      }

      const { repositories } = data.viewer;
      hasNextPage = repositories.pageInfo.hasNextPage;
      endCursor = repositories.pageInfo.endCursor;

      for (const repo of repositories.nodes) {
        if (!repo.defaultBranchRef) continue;

        const commits = repo.defaultBranchRef.target.history;
        const repoCommits = commits.totalCount;
        let repoLines = 0;
        let repoFilesChanged = 0;

        for (const commit of commits.nodes) {
          const commitDate = format(
            new Date(commit.committedDate),
            "yyyy-MM-dd",
          );
          if (commitDate in weeklyCommits) {
            weeklyCommits[commitDate]++;
            dailyActivity[commitDate]++;
          }

          repoLines += commit.additions + commit.deletions;
          repoFilesChanged += commit.changedFiles;
        }

        for (const {
          node: { name },
          size,
        } of repo.languages.edges) {
          languageBytes[name] = (languageBytes[name] || 0) + size;
        }

        totalCommits += repoCommits;
        totalLines += repoLines;
        filesChanged += repoFilesChanged;

        repoStats.push({
          name: repo.name,
          description: repo.description,
          url: repo.url,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          branches: repo.refs.totalCount,
          lastUpdated: repo.pushedAt,
          commits: repoCommits,
          linesChanged: repoLines,
          language:
            repo.languages.edges.length > 0
              ? repo.languages.edges[0].node.name
              : "Unknown",
        });
      }
    }

    const totalBytes = Object.values(languageBytes).reduce(
      (sum, val) => sum + val,
      0,
    );
    const languagePercentages: Record<string, number> = {};
    for (const lang in languageBytes) {
      languagePercentages[lang] = Math.round(
        (languageBytes[lang] / totalBytes) * 100,
      );
    }

    const totalCodingHours = Math.round(totalLines / 50);

    return {
      totalCommits,
      totalLines,
      totalCodingHours,
      filesChanged,
      repositories: repoStats,
      githubProfile: userProfile,
      weeklyCommits,
      dailyActivity,
      language: languagePercentages,
    };
  } catch (error) {
    console.error("Error fetching GitHub metrics:", error);
    return DEFAULT_METRICS;
  }
}
export async function commitReadmeToGitHub(
  owner: string,
  repo: string,
  content: string,
  token: string,
) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/README.md`;

  // Encode README content in Base64
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  // Get the current file SHA (needed for updates)
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  const sha = json.sha;

  const commitData = {
    message: "Update README via AI",
    content: encodedContent,
    sha, // Include SHA if updating existing file
  };

  const commitResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commitData),
  });

  if (!commitResponse.ok) {
    throw new Error("Failed to commit README to GitHub.");
  }

  return await commitResponse.json();
}
