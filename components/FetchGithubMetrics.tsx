import { prisma } from "@/lib/prisma";
import { format, subDays } from "date-fns";

// Configuration for retry mechanism
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // Start with 1 second delay
  maxDelay: 5000, // Maximum delay of 5 seconds
  timeout: 15000, // 15 second timeout
};

// Custom error class for better error handling
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

// Exponential backoff calculation
function calculateBackoff(attempt: number): number {
  const delay = Math.min(
    RETRY_CONFIG.maxDelay,
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
  );
  // Add some jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

// Enhanced fetch with timeout

function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timeout after ${timeout}ms for URL: ${url}`));
    }, timeout);

    fetch(url, {
      ...options,
      signal: controller.signal,
    })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

// Enhanced fetch with retry logic
async function fetchWithRetry(url: string, token: string): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            // Add user agent to comply with GitHub API requirements
            "User-Agent": "GitHub-Metrics-Dashboard",
          },
        },
        RETRY_CONFIG.timeout,
      );

      // Handle rate limiting
      if (
        response.status === 403 &&
        response.headers.get("X-RateLimit-Remaining") === "0"
      ) {
        const resetTime = response.headers.get("X-RateLimit-Reset");
        if (resetTime) {
          const waitTime = parseInt(resetTime) * 1000 - Date.now();
          if (waitTime > 0 && waitTime < RETRY_CONFIG.maxDelay) {
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }
      }

      if (!response.ok) {
        throw new GitHubAPIError(
          `GitHub API error: ${response.status}`,
          response.status,
          url,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof GitHubAPIError && error.status === 404) {
        throw error;
      }

      // Log the error with attempt information
      console.error(`Attempt ${attempt + 1} failed for ${url}:`, error);

      // If we have more retries, wait before trying again
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const backoffTime = calculateBackoff(attempt);
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  // If we get here, all retries failed
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
  };

  try {
    const token = await prisma.githubToken.findUnique({
      where: { userId },
    });

    if (!token) {
      console.log("No GitHub token found for user:", userId);
      return DEFAULT_METRICS;
    }

    // Initialize weekly commits
    const weeklyCommits: { [date: string]: number } = {};
    for (let i = 0; i < 28; i++) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      weeklyCommits[date] = 0;
    }

    // Fetch GitHub profile with retry logic
    const profileData = await fetchWithRetry(
      "https://api.github.com/user",
      token.accessToken,
    );

    const username = profileData.login;

    // Fetch repositories with pagination and retry logic
    const repos: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const pageRepos = await fetchWithRetry(
          `https://api.github.com/users/${username}/repos?page=${page}&per_page=100`,
          token.accessToken,
        );

        if (pageRepos.length === 0) {
          hasMore = false;
        } else {
          repos.push(...pageRepos);
          page++;
        }
      } catch (error) {
        console.error(`Error fetching page ${page} of repositories:`, error);
        hasMore = false;
      }
    }

    // Process repositories with improved error handling
    const repoStats = [];
    let totalCommits = 0;
    let totalLines = 0;

    for (const repo of repos) {
      try {
        const commits = await fetchWithRetry(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100`,
          token.accessToken,
        );

        let repoLines = 0;
        for (const commit of commits) {
          try {
            const commitDate = format(
              new Date(commit.commit.author.date),
              "yyyy-MM-dd",
            );

            if (commitDate in weeklyCommits) {
              weeklyCommits[commitDate]++;
            }

            const commitDetails = await fetchWithRetry(
              `https://api.github.com/repos/${username}/${repo.name}/commits/${commit.sha}`,
              token.accessToken,
            );

            if (commitDetails.stats) {
              repoLines += commitDetails.stats.total;
            }
          } catch (error) {
            console.error(`Error processing commit in ${repo.name}:`, error);
            continue;
          }
        }

        totalCommits += commits.length;
        totalLines += repoLines;

        repoStats.push({
          name: repo.name,
          commits: commits.length,
          linesChanged: repoLines,
        });
      } catch (error) {
        console.error(`Error processing repository ${repo.name}:`, error);
        continue;
      }
    }

    return {
      totalCommits,
      totalLines,
      repositories: repoStats,
      githubProfile: {
        username,
        avatarUrl: profileData.avatar_url,
      },
      weeklyCommits,
    };
  } catch (error) {
    console.error("Error fetching GitHub metrics:", error);
    return DEFAULT_METRICS;
  }
}

export default fetchGitHubMetrics;
