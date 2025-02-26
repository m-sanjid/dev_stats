"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitCommit, Code, Clock, Github, Boxes } from "lucide-react";
import CommitChart from "./Github/CommitsChart";
import { StatCard } from "./ui/stat-card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchGitHubMetrics } from "@/lib/github";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {metrics?.githubProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 md:mr-4"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <Image
                    width={16}
                    height={16}
                    src={metrics.githubProfile.avatarUrl}
                    alt="GitHub Avatar"
                    className="w-16 h-16 rounded-full ring-2 ring-purple-500/20"
                  />
                  <Github className="absolute -bottom-2 -right-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metrics.githubProfile.username}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    GitHub Profile
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Statistics */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {metrics?.weeklyCommits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
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
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Languages</CardTitle>
                <Boxes className="h-5 w-5 text-purple-500 dark:text-purple-400" />
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
                          <span className="text-gray-500 dark:text-gray-400">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-purple-500 dark:bg-purple-400 rounded-full"
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
      </div>
      {/* Repository Preview Section */}
      {metrics?.repositories && metrics.repositories.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Repositories</CardTitle>
            <Link
              href="/dashboard/repos"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.repositories.sort((a, b) => b.commits - a.commits).slice(0, 3).map((repo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{repo.name}</span>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid gap-6 mx-auto max-w-4xl p-4 mt-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-6 flex gap-6">
        <Skeleton className="h-[300px] w-[70%]" />
        <Skeleton className="h-[300px] w-[30%]" />
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  </div>
);
