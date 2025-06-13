"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Calendar, Clock, GitCommit, GitPullRequest } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { ActivityHeatmap } from "@/components/Github/ActivityHeatmap";
import { DailyActivityChart } from "@/components/Github/DailyActivityChart";
import { GitHubMetrics } from "@/app/(main)/dashboard/activity/page";
import BorderDiv from "./BorderDiv";

interface ActivityAnalyticsProps {
  metrics: GitHubMetrics | null;
}

export function ActivityAnalytics({ metrics }: ActivityAnalyticsProps) {
  if (!metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Commits"
          value={metrics.totalCommits}
          icon={GitCommit}
          delay={0.1}
        />
        <StatCard
          title="Active Days"
          value={Object.keys(metrics.weeklyCommits).length}
          icon={Calendar}
          delay={0.2}
        />
        <StatCard
          title="Coding Hours"
          value={`${metrics.totalCodingHours}h`}
          icon={Clock}
          delay={0.3}
        />
        <StatCard
          title="Files Changed"
          value={metrics.filesChanged}
          icon={GitPullRequest}
          delay={0.4}
        />
      </div>

      {/* Activity Heatmap */}
      <BorderDiv>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={metrics.weeklyCommits} />
        </CardContent>
      </Card>
      </BorderDiv>

      {/* Daily Activity Pattern */}
      <BorderDiv>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Daily Activity Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyActivityChart data={metrics.dailyActivity} />
        </CardContent>
      </Card>
      </BorderDiv>
    </motion.div>
  );
}
