import { prisma } from "@/lib/prisma";
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

async function executeGraphQLQuery(
  query: string,
  token: string,
  variables = {},
) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "GitHub-Metrics-Dashboard",
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new GitHubAPIError(
          `GitHub API error: ${response.status}`,
          response.status,
          "GraphQL API",
        );
      }

      const result = await response.json();

      if (result.errors) {
        throw new GitHubAPIError(
          `GraphQL Error: ${result.errors[0].message}`,
          400,
          "GraphQL API",
        );
      }

      return result.data;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const backoffTime = calculateBackoff(attempt);
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  throw new Error(
    `Failed after ${RETRY_CONFIG.maxRetries} attempts. Last error: ${lastError?.message}`,
  );
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
    const token = await prisma.githubToken.findUnique({
      where: { userId },
    });

    if (!token) {
      console.log("No GitHub token found for user:", userId);
      return DEFAULT_METRICS;
    }

    // Initialize date-based metrics
    const weeklyCommits: { [date: string]: number } = {};
    const dailyActivity: { [date: string]: number } = {};
    for (let i = 0; i < 28; i++) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      weeklyCommits[date] = 0;
      dailyActivity[date] = 0;
    }

    // GraphQL query to fetch user data and repositories
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

    // Store user profile data
    let userProfile = null;

    while (hasNextPage) {
      const data = await executeGraphQLQuery(query, token.accessToken, {
        after: endCursor,
      });

      // Store user profile data on first iteration
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

        // Process languages
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
          branches: repo.refs.totalCount, // New field for branch count
          lastUpdated: repo.pushedAt, // New field for last update timestamp
          commits: repoCommits,
          linesChanged: repoLines,
          language:
            repo.languages.edges.length > 0
              ? repo.languages.edges[0].node.name
              : "Unknown",
        });
      }
    }

    // Calculate language percentages
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

export default fetchGitHubMetrics;
