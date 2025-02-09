"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitCommit, Clock, FileCode, BarChart3 } from "lucide-react";

interface DashboardProps {
  metrics: {
    totalCommits?: number;
    totalCodingHours?: number;
    filesChanged?: number;
    repositories?: Record<string, number>;
    dailyActivity?: Record<string, number>;
    languages?: Record<string, number>;
    githubProfile?: {
      username: string;
      avatarUrl: string;
    } | null;
  };
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const GitHubDashboard: React.FC<DashboardProps> = ({ metrics }) => {
  // Transform daily activity data for Chart.js
  const dailyActivity = metrics?.dailyActivity ?? {};
  const activityLabels = Object.keys(dailyActivity);
  const activityValues = Object.values(dailyActivity);

  // Chart.js data format
  const activityData = {
    labels: activityLabels.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: "Commits",
        data: activityValues,
        borderColor: "#8884d8",
        backgroundColor: "rgba(136, 132, 216, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Coding Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalCodingHours?.toFixed(1) ?? "0.0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Changed</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.filesChanged ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(metrics?.repositories ?? {}).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Commit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <Line data={activityData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
