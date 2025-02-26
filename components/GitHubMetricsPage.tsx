"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  GitCommit,
  FileCode,
  Clock,
  GitFork,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchGitHubMetrics } from "@/lib/github";
import Image from "next/image";

interface GitHubMetrics {
  totalCommits: number;
  totalLines: number;
  repositories: Array<{
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
    branches: number;
    lastUpdated: string;
    commits: number;
    linesChanged: number;
    language: string;
  }>;
  githubProfile: {
    username: string;
    avatarUrl: string;
  } | null;
  weeklyCommits: Record<string, number>;
  totalCodingHours: number;
  filesChanged: number;
  dailyActivity: Record<string, number>;
  language: Record<string, number>;
}

export default function GitHubMetricsPage() {
  const { data: session, status } = useSession();
  const [metrics] = useState<GitHubMetrics | null>(null);
  const [loading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchGitHubMetrics(session.user.id);
    }
  }, [session, status]);

  const commitChartData = metrics
    ? Object.entries(metrics.weeklyCommits)
      .map(([date, count]) => ({ date, commits: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>No GitHub metrics available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-8">
        {metrics.githubProfile && (
          <>
            <Image
            width={64} height={64}
              src={metrics.githubProfile.avatarUrl}
              alt={metrics.githubProfile.username}
              className="w-16 h-16 rounded-full"
            />
            <h1 className="text-2xl font-bold">
              {metrics.githubProfile.username}&apos s GitHub Activity
            </h1>
          </>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Commits"
          value={metrics.totalCommits}
          Icon={GitCommit}
        />
        <MetricCard
          title="Lines Changed"
          value={metrics.totalLines}
          Icon={FileCode}
        />
        <MetricCard
          title="Coding Hours"
          value={metrics.totalCodingHours}
          Icon={Clock}
        />
        <MetricCard
          title="Files Changed"
          value={metrics.filesChanged}
          Icon={FileCode}
        />
      </div>

      {/* Commit Activity Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Commit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commitChartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [value, "Commits"]}
                />
                <Line
                  type="monotone"
                  dataKey="commits"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Repositories */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.repositories.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: number;
  Icon: React.ComponentType<{ className: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

function RepoCard({ repo }: { repo: GitHubMetrics["repositories"][0] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            {repo.name}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {repo.description || "No description"}
        </p>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {repo.stars}
          </div>
          <div className="flex items-center">
            <GitFork className="w-4 h-4 mr-1" />
            {repo.forks}
          </div>
          <div>{repo.language}</div>
        </div>
      </CardContent>
    </Card>
  );
}
