"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Calendar, Clock, GitCommit, GitPullRequest } from "lucide-react";
import { StatCard } from "./ui/stat-card";
import { ActivityHeatmap } from "@/components/Github/ActivityHeatmap";
import { DailyActivityChart } from "@/components/Github/DailyActivityChart";

interface ActivityAnalyticsProps {
  metrics: {
    totalCommits?: number;
    dailyActivity?: Record<string, number>;
    totalCodingHours?: number;
    pullRequests?: number;
  };
}

export function ActivityAnalytics({ metrics }: ActivityAnalyticsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Commits"
          value={metrics?.totalCommits || 0}
          icon={GitCommit}
          delay={0.1}
        />
        <StatCard
          title="Active Days"
          value={Object.keys(metrics?.dailyActivity || {}).length}
          icon={Calendar}
          delay={0.2}
        />
        <StatCard
          title="Coding Hours"
          value={`${metrics?.totalCodingHours || 0}h`}
          icon={Clock}
          delay={0.3}
        />
        <StatCard
          title="Pull Requests"
          value={metrics?.pullRequests || 0}
          icon={GitPullRequest}
          delay={0.4}
        />
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={metrics?.dailyActivity || {}} />
        </CardContent>
      </Card>

      {/* Daily Activity Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyActivityChart data={metrics?.dailyActivity || {}} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
