"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  weeklyCommits: Record<string, number>;
  totalCommits: number;
  totalLines: number;
  totalCodingHours: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/github/metrics");
        if (!response.ok) throw new Error("Failed to fetch data");
        const metricsData = await response.json();
        setData(metricsData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = data?.weeklyCommits
    ? Object.entries(data.weeklyCommits).map(([date, count]) => ({
      date,
      commits: count,
    }))
    : [];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Detailed analysis of your coding activity"
      />

      <div className="grid gap-6 mx-auto max-w-7xl p-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Commits"
            value={data?.totalCommits || 0}
            description="All-time commits"
          />
          <MetricCard
            title="Lines of Code"
            value={data?.totalLines || 0}
            description="Total lines changed"
          />
          <MetricCard
            title="Coding Hours"
            value={data?.totalCodingHours || 0}
            description="Total time spent coding"
          />
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Weekly Commit Activity
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="commits" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {value.toLocaleString()}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
