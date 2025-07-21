"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  GitCommit,
  Code,
  Clock,
  Github,
  Boxes,
  ArrowRight,
} from "lucide-react";
import CommitChart from "./Github/CommitsChart";
import { StatCard } from "./ui/stat-card";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { fetchGitHubMetrics } from "@/lib/github";
import { useSession, signIn } from "next-auth/react";
import { Link } from "next-view-transitions";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

interface GitHubMetrics {
  totalCommits: number;
  totalCodingHours: number;
  filesChanged: number;
  totalLines: number;
  repositories: { name: string; commits: number; linesChanged: number }[];
  dailyActivity: Record<string, number>;
  language: Record<string, number>;
  githubProfile: {
    username: string;
    avatarUrl: string;
  } | null;
  weeklyCommits: { [date: string]: number };
}

export const GithubDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || session?.user?.email;
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchGitHubMetrics(userId);

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No data received from GitHub.");
      }

      setMetrics({
        totalCommits: data.totalCommits ?? 0,
        totalLines: data.totalLines ?? 0,
        totalCodingHours: data.totalCodingHours ?? 0,
        filesChanged: data.filesChanged ?? 0,
        githubProfile: data.githubProfile ?? null,
        weeklyCommits: data.weeklyCommits ?? {},
        dailyActivity: data.dailyActivity ?? {},
        language: data.language ?? {},
        repositories: data.repositories ?? [],
      });
    } catch (err) {
      console.error("Error fetching GitHub metrics:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (status === "authenticated") {
      loadMetrics();
    } else if (status === "unauthenticated") {
      setError("User not authenticated.");
      setLoading(false);
    }
  }, [status, userId, loadMetrics]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <Button
          onClick={() =>
            status === "unauthenticated" ? signIn() : loadMetrics()
          }
          className="mt-4"
        >
          {status === "unauthenticated" ? "Sign In" : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mx-auto max-w-4xl space-y-12"
    >
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-4"
      >
        {metrics?.githubProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="group rounded-3xl border bg-primary/5 p-2 backdrop-blur-md md:mr-4 lg:col-span-1"
          >
            <Card className="rounded-2xl border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <Image
                    width={64}
                    height={64}
                    src={metrics.githubProfile.avatarUrl}
                    alt="GitHub Avatar"
                    className="h-16 w-16 rounded-full ring-2 ring-indigo-400/30"
                  />
                  <Github className="absolute -bottom-2 -right-2 h-6 w-6 transition-all duration-300 group-hover:translate-x-2" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {metrics.githubProfile.username}
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    GitHub Profile
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
          <StatCard
            title="Total Commits"
            value={metrics?.totalCommits ?? 0}
            icon={GitCommit}
            delay={0.1}
          />
          <StatCard
            title="Lines Changed"
            value={metrics?.totalLines ?? 0}
            icon={Code}
            delay={0.2}
          />
          <StatCard
            title="Coding Hours"
            value={`${metrics?.totalCodingHours ?? 0} hrs`}
            icon={Clock}
            delay={0.3}
          />
        </div>
      </motion.div>
      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        {metrics?.weeklyCommits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="rounded-3xl border bg-primary/5 p-2 backdrop-blur-md lg:col-span-2"
          >
            <Card className="h-full rounded-2xl border">
              <CardHeader>
                <CardTitle>Commit Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <CommitChart weeklyCommits={metrics.weeklyCommits} />
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Languanges used*/}
        {metrics?.language && Object.keys(metrics.language).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="rounded-3xl border bg-primary/5 p-2 backdrop-blur-md"
          >
            <Card className="h-full rounded-2xl border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Languages</CardTitle>
                <Boxes className="h-5 w-5 border bg-primary/10 p-1" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.language).map(
                    ([lang, percentage]) => (
                      <div key={lang} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium dark:text-white">
                            {lang}
                          </span>
                          <span className="text-neutral-500 dark:text-neutral-400">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-700">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
      {/* Repository Preview Section */}
      <AnimatePresence>
        {metrics?.repositories && metrics.repositories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="rounded-3xl border bg-primary/5 p-2 backdrop-blur-md"
          >
            <Card className="rounded-2xl border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Repositories</CardTitle>
                <Link
                  href="/dashboard/repos"
                  className="group flex items-center gap-1 text-sm text-primary hover:text-primary/80 dark:text-primary/80 dark:hover:text-primary"
                >
                  View All
                  <span className="ml-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.repositories
                    .sort((a, b) => b.commits - a.commits)
                    .slice(0, 3)
                    .map((repo, index) => (
                      <motion.div
                        key={index}
                        className="group flex items-center justify-between rounded-3xl border bg-card p-2 transition-colors hover:bg-primary/5"
                      >
                        <div className="flex w-full flex-col rounded-2xl border p-2">
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {repo.name}
                          </span>
                          <div className="mt-1 flex w-full items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-300">
                            <span className="flex items-center gap-1">
                              <GitCommit className="h-4 w-4" />
                              {repo.commits} commits
                            </span>
                            <span className="flex items-center gap-1">
                              <Code className="h-4 w-4" />
                              {repo.linesChanged} lines changed
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LoadingSkeleton = () => (
  <div className="mx-auto mt-8 grid w-full max-w-6xl gap-6 p-4">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="rounded-2xl border border-white/30 bg-white/70 shadow-xl backdrop-blur-lg dark:border-zinc-700/40 dark:bg-zinc-900/70"
        >
          <CardContent className="p-6 overflow-hidden">
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="mb-2 h-8 w-32" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="rounded-2xl border border-white/30 bg-white/70 shadow-xl backdrop-blur-lg dark:border-zinc-700/40 dark:bg-zinc-900/70">
      <CardContent className="flex gap-6 p-6">
        <Skeleton className="h-[300px] w-[70%]" />
        <Skeleton className="h-[300px] w-[30%]" />
      </CardContent>
    </Card>
    <Card className="rounded-2xl border border-white/30 bg-white/70 shadow-xl backdrop-blur-lg dark:border-zinc-700/40 dark:bg-zinc-900/70">
      <CardContent className="p-6">
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  </div>
);
