"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "next-auth/react";
import { fetchGitHubMetrics } from "@/lib/github";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnalyticsData {
  weeklyCommits: Record<string, number>;
  totalCommits: number;
  totalLines: number;
  totalCodingHours: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

const formatHours = (hours: number): string => {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${hours}h`;
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="grid gap-6 mx-auto max-w-7xl p-4 mt-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  </div>
);

const MetricCard = ({
  title,
  value,
  description,
  format = "number",
}: {
  title: string;
  value: number;
  description: string;
  format?: "number" | "hours";
}) => {
  const formattedValue =
    format === "hours" ? formatHours(value) : formatNumber(value);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {formattedValue}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded shadow">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {`${payload[0].value} commits`}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl p-6">Please sign in to view access this page</h1>

        <Button className="px-8">
          <Link href="/signup">Sign In</Link>
        </Button>
      </div>
    );
  }

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) {
        setError("Please sign in to view your analytics");
        setLoading(false);
        return;
      }

      try {
        const result = await fetchGitHubMetrics(session.user.id);

        setData(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load analytics data";
        setError(errorMessage);
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const chartData = data?.weeklyCommits
    ? Object.entries(data.weeklyCommits)
        .map(([date, count]) => ({
          date,
          commits: count,
        }))
        .slice(-12) // Show only last 12 weeks
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
            format="hours"
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
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.split("-")[1]} // Show only month
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="commits" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
