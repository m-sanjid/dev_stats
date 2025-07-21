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
  return (
    Math.min(RETRY_CONFIG.maxDelay, RETRY_CONFIG.baseDelay * 2 ** attempt) +
    Math.random() * 1000
  );
}

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
};

export async function executeGraphQLQuery(
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
      await new Promise((resolve) =>
        setTimeout(resolve, calculateBackoff(attempt)),
      );
    }
  }

  throw new Error(`Failed after ${RETRY_CONFIG.maxRetries} attempts.`);
}

// 🔹 Main function to fetch GitHub metrics
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/github-stats?userId=${userId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub metrics");
    }

    return await response.json();
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
  const sha = json.sha; // If README already exists, get its SHA

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
