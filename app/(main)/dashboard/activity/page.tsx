"use client";

import { PageHeader } from "@/components/PageHeader";
import { ActivityAnalytics } from "@/components/ActivityAnalytics";
import { fetchGitHubMetrics } from "@/lib/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommitChart from "@/components/Github/CommitsChart";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginCTA from "@/components/LoginCTA";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubMetrics } from "@/components/GitHubMetricsPage";

export default function ActivityPage() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const data = await fetchGitHubMetrics(session.user.id);
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, [session]);

  if (!session) {
    return <LoginCTA />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Activity"
        description="Your coding activity over time"
      />
      <div className="container mx-auto my-4 px-4 py-4">
        <ActivityAnalytics metrics={metrics} />
        <div className="my-4">
          {metrics?.weeklyCommits && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border bg-primary/5 p-2 backdrop-blur-md lg:col-span-2"
            >
              <Card className="h-full rounded-2xl">
                <CardHeader>
                  <CardTitle>Commit Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommitChart weeklyCommits={metrics.weeklyCommits} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="m-4 flex h-full flex-col items-center justify-center gap-3">
    <div className="flex w-full items-center gap-2 rounded-3xl border bg-primary/5 p-2 backdrop-blur-md">
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
    <div className="flex w-full items-center gap-2 rounded-3xl border bg-primary/5 p-2 backdrop-blur-md">
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
    <div className="flex w-full items-center gap-2 rounded-3xl border bg-primary/5 p-2 backdrop-blur-md">
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
  </div>
);
