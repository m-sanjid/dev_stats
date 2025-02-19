export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
  timeout: 15000,
};

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public url?: string,
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

export function calculateBackoff(attempt: number): number {
  const delay = Math.min(
    RETRY_CONFIG.maxDelay,
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
  );
  return delay + Math.random() * 1000;
}

export interface GitHubCommit {
  message: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface PullRequestCommit {
  commit: GitHubCommit;
}

export interface GitHubAuthor {
  login: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  body: string;
  url: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  author: GitHubAuthor;
  commits: {
    nodes: PullRequestCommit[];
  };
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export async function executeGraphQLQuery<T>(
  query: string,
  token: string,
  variables = {},
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "GitHub-PR-Review",
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

      const result = (await response.json()) as GraphQLResponse<T>;

      if (result.errors) {
        throw new GitHubAPIError(
          `GraphQL Error: ${result.errors[0].message}`,
          400,
          "GraphQL API",
        );
      }

      return result.data as T;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const backoffTime = calculateBackoff(attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  throw new Error(
    `Failed after ${RETRY_CONFIG.maxRetries} attempts. Last error: ${lastError?.message}`,
  );
}
