"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchGitHubMetrics } from "@/lib/github";

interface Repository {
  name: string;
  full_name: string;
  owner: { login: string };
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
  author: { login: string };
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

export default function CodeReviewDashboard() {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiAnalysis, setAIAnalysis] = useState<{ [key: number]: string }>({});
  const [loadingAI, setLoadingAI] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchRepos = async () => {
      if (!session?.user?.id) return;
      try {
        const metrics = await fetchGitHubMetrics(session.user.id);
        setRepositories(metrics.repositories);
        setSelectedRepo(
          metrics.repositories.length > 0 ? metrics.repositories[0].name : null,
        );
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchRepos();
  }, [session]);

  useEffect(() => {
    const fetchPRs = async () => {
      if (!selectedRepo || !session?.user?.id) return;
      setLoading(true);
      try {
        const metrics = await fetchGitHubMetrics(session.user.id);
        const repo = metrics.repositories.find((r) => r.name === selectedRepo);
        setPullRequests(repo ? repo.pullRequests || [] : []);
      } catch (error) {
        console.error("Error fetching PRs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, [selectedRepo, session]);

  const handleAIReview = async (pr: PullRequest) => {
    setLoadingAI((prev) => ({ ...prev, [pr.number]: true }));
    try {
      const response = await fetch("/api/analyze-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (!response.ok) throw new Error("Failed to generate AI summary");
      const data = await response.json();
      setAIAnalysis((prev) => ({ ...prev, [pr.number]: data.summary }));
    } catch (error) {
      console.error("Error generating AI review:", error);
    } finally {
      setLoadingAI((prev) => ({ ...prev, [pr.number]: false }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">AI Code Review Dashboard</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select a Repository
        </label>
        <select
          value={selectedRepo || ""}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        >
          {repositories.map((repo) => (
            <option key={repo.name} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading pull requests...</p>
      ) : pullRequests.length === 0 ? (
        <p className="text-gray-600">No open pull requests found.</p>
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
                  disabled={loadingAI[pr.number]}
                >
                  {loadingAI[pr.number] ? (
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
