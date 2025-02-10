"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitCommit, Code } from "lucide-react";
import CommitChart from "./Github/CommitsChart";

interface DashboardProps {
  metrics?: {
    totalCommits?: number;
    totalCodingHours?: number;
    filesChanged?: number;
    totalLines?: number;
    repositories?: { name: string; commits: number; linesChanged: number }[];
    dailyActivity?: Record<string, number>;
    language?: Record<string, number>;
    githubProfile?: {
      username: string;
      avatarUrl: string;
    } | null;
    weeklyCommits?: { [date: string]: number };
  };
}

export const GitHubDashboard: React.FC<DashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* GitHub Profile Section */}
      {metrics?.githubProfile && (
        <Card className="flex items-center gap-4 p-4">
          <img
            src={metrics.githubProfile.avatarUrl}
            alt="GitHub Avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {metrics.githubProfile.username}
            </h2>
            <p className="text-sm text-gray-500">GitHub Profile</p>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalCommits ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lines Changed
            </CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalLines ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Repository Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics?.repositories?.map((repo) => (
            <div
              key={repo.name}
              className="flex justify-between items-center border-b py-2"
            >
              <span className="font-medium">{repo.name}</span>
              <div className="text-right">
                <p className="text-sm text-gray-600">{repo.commits} commits</p>
                <p className="text-sm text-gray-600">
                  {repo.linesChanged} lines changed
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {metrics?.weeklyCommits && (
        <CommitChart weeklyCommits={metrics.weeklyCommits} />
      )}
    </div>
  );
};
