"use client";

import { PageHeader } from "@/components/PageHeader";
import { ActivityAnalytics } from "@/components/ActivityAnalytics";
import { auth } from "@/auth";
import { fetchGitHubMetrics } from "@/lib/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommitChart from "@/components/Github/CommitsChart";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ActivityPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="p-6 text-xl">Please sign in to view access this page</h1>

        <Button className="px-8">
          <Link href="/signup">Sign In</Link>
        </Button>
      </div>
    );
  }

  const metrics = await fetchGitHubMetrics(session.user.id);

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
        </div>
      </div>
    </div>
  );
}
