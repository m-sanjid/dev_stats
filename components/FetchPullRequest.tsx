"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  calculateBackoff,
  GitHubAPIError,
  RETRY_CONFIG,
} from "@/lib/github-utils";

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
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  throw new Error(
    `Failed after ${RETRY_CONFIG.maxRetries} attempts. Last error: ${lastError?.message}`,
  );
}

interface PullRequest {
  id: string;
  number: number;
  title: string;
  body: string;
  url: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  author: {
    login: string;
  };
  commits: {
    nodes: {
      commit: {
        message: string;
        additions: number;
        deletions: number;
        changedFiles: number;
      };
    }[];
  };
}

async function fetchPullRequests(
  owner: string,
  repo: string,
  token: string,
): Promise<PullRequest[]> {
  const query = `
    query ($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        pullRequests(first: 10, states: [OPEN], orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id
            number
            title
            body
            url
            additions
            deletions
            changedFiles
            author {
              login
            }
            commits(first: 100) {
              nodes {
                commit {
                  message
                  additions
                  deletions
                  changedFiles
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await executeGraphQLQuery(query, token, { owner, repo });
  return data.repository.pullRequests.nodes;
}

async function generateAISummary(pr: PullRequest): Promise<string> {
  try {
    const response = await fetch("/api/analyze-pr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: pr.title,
        description: pr.body,
        changes: {
          additions: pr.additions,
          deletions: pr.deletions,
          changedFiles: pr.changedFiles,
        },
        commits: pr.commits.nodes.map((node) => ({
          message: node.commit.message,
          changes: {
            additions: node.commit.additions,
            deletions: node.commit.deletions,
            changedFiles: node.commit.changedFiles,
          },
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate AI summary");
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw error;
  }
}

export default function CodeReviewDashboard() {
  const { data: session } = useSession();
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<number | null>(null);
  const [aiAnalysis, setAIAnalysis] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchPRs = async () => {
      if (session?.user?.githubAccessToken) {
        try {
          const prs = await fetchPullRequests(
            process.env.NEXT_PUBLIC_GITHUB_OWNER || "",
            process.env.NEXT_PUBLIC_GITHUB_REPO || "",
            session.user.githubAccessToken,
          );
          setPullRequests(prs);
        } catch (error) {
          console.error("Error fetching PRs:", error);
        }
      }
    };

    fetchPRs();
  }, [session]);

  const handleAIReview = async (pr: PullRequest) => {
    setSelectedPR(pr.number);
    setLoading((prev) => ({ ...prev, [pr.number]: true }));

    try {
      const summary = await generateAISummary(pr);
      setAIAnalysis((prev) => ({ ...prev, [pr.number]: summary }));
    } catch (error) {
      console.error("Error generating AI review:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [pr.number]: false }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Code Review Dashboard</h1>
      </div>

      {pullRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No open pull requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pullRequests.map((pr) => (
            <div key={pr.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">{pr.title}</h2>
                  <p className="text-sm text-gray-500">
                    By {pr.author.login} • {pr.changedFiles} files changed (
                    {pr.additions} additions, {pr.deletions} deletions)
                  </p>
                </div>
                <Button
                  onClick={() => handleAIReview(pr)}
                  disabled={loading[pr.number]}
                >
                  {loading[pr.number] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Generate AI Review"
                  )}
                </Button>
              </div>

              {aiAnalysis[pr.number] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">AI Analysis:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {aiAnalysis[pr.number]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
