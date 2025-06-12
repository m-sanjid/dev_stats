"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  GitPullRequest,
  FileDiff,
  Plus,
  Minus,
} from "lucide-react";
import { fetchGitHubMetrics } from "@/lib/github";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import ProOnlyComponent from "@/components/ProOnlyComponent";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function CodeReviewDashboard() {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiAnalysis, setAIAnalysis] = useState<{ [key: number]: string }>({});
  const [loadingAI, setLoadingAI] = useState<{ [key: number]: boolean }>({});
  const isPro = session?.user?.subscription === "pro";

  useEffect(() => {
    const fetchRepos = async () => {
      if (!session?.user?.id) return;
      try {
        const metrics = await fetchGitHubMetrics(session.user.id);
        const formattedRepositories = metrics.repositories.map((repo) => ({
          name: repo.name,
          full_name: repo.name,
          owner: { login: "unknown" },
        }));
        setRepositories(formattedRepositories);
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
        setPullRequests(
          (repo && "pullRequests" in repo
            ? repo.pullRequests || []
            : []) as PullRequest[],
        );
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
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto max-w-7xl px-4 py-8"
      >
        <motion.div
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <Button variant="ghost" asChild className="group">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>
            </Button>
            <PageHeader
              title="AI Code Review Dashboard"
              description="Review your pull requests with AI-powered analysis"
            />
          </motion.div>

          {isPro ? (
            <motion.div variants={item} className="space-y-8">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Repository Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedRepo || ""}
                    onValueChange={setSelectedRepo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {repositories.map((repo) => (
                        <SelectItem key={repo.name} value={repo.name}>
                          <span className="flex items-center gap-2">
                            <GitPullRequest className="h-4 w-4" />
                            {repo.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {loading ? (
                <motion.div
                  className="flex min-h-[400px] items-center justify-center"
                  variants={item}
                >
                  <div className="space-y-4 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Loading pull requests...
                    </p>
                  </div>
                </motion.div>
              ) : pullRequests.length === 0 ? (
                <motion.div
                  className="flex min-h-[400px] items-center justify-center"
                  variants={item}
                >
                  <div className="space-y-4 text-center">
                    <GitPullRequest className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground">
                      No open pull requests found
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div className="space-y-4" variants={container}>
                  {pullRequests.map((pr) => (
                    <motion.div
                      key={pr.id}
                      variants={item}
                      className="space-y-4 rounded-lg bg-card/50 p-6 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h2 className="text-lg font-medium">{pr.title}</h2>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {pr.author.login}</span>
                            <span className="flex items-center gap-1">
                              <FileDiff className="h-4 w-4" />
                              {pr.changedFiles} files changed
                            </span>
                            <span className="flex items-center gap-1 text-green-500">
                              <Plus className="h-4 w-4" />
                              {pr.additions}
                            </span>
                            <span className="flex items-center gap-1 text-red-500">
                              <Minus className="h-4 w-4" />
                              {pr.deletions}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAIReview(pr)}
                          disabled={loadingAI[pr.number]}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 rounded-lg bg-background/50 p-4"
                        >
                          <h3 className="mb-2 font-medium">AI Analysis</h3>
                          <p className="whitespace-pre-wrap text-muted-foreground">
                            {aiAnalysis[pr.number]}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div variants={item}>
              <ProOnlyComponent />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
