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
import ProOnlyComponent from "@/components/ProOnlyComponent";
import { motion, AnimatePresence } from "motion/react";

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
  <div className="mx-auto mt-8 grid max-w-7xl gap-6 p-4">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="mb-2 h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="overflow-hidden">
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
  delay = 0,
}: {
  title: string;
  value: number;
  description: string;
  format?: "number" | "hours";
  delay?: number;
}) => {
  const formattedValue =
    format === "hours" ? formatHours(value) : formatNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="transform overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="relative p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
            className="mt-2 flex items-baseline"
          >
            <p className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-3xl font-semibold text-transparent">
              {formattedValue}
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.4 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {description}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-sm font-semibold text-transparent">
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
  const isPro = session?.user?.subscription === "pro";

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

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-screen flex-col items-center justify-center"
      >
        <h1 className="p-6 text-xl">Please sign in to view access this page</h1>
        <Button className="px-8 transition-transform hover:scale-105">
          <Link href="/signup">Sign In</Link>
        </Button>
      </motion.div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-8 max-w-7xl p-4"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </motion.div>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <PageHeader
          title="Analytics"
          description="Detailed analysis of your coding activity"
        />
      </motion.div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mx-auto mt-8 grid max-w-7xl gap-6 p-4"
        >
          {isPro ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <MetricCard
                  title="Total Commits"
                  value={data?.totalCommits || 0}
                  description="All-time commits"
                  delay={0.1}
                />
                <MetricCard
                  title="Lines of Code"
                  value={data?.totalLines || 0}
                  description="Total lines changed"
                  delay={0.2}
                />
                <MetricCard
                  title="Coding Hours"
                  value={data?.totalCodingHours || 0}
                  description="Total time spent coding"
                  format="hours"
                  delay={0.3}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-lg font-semibold text-transparent">
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
                          <Bar
                            dataKey="commits"
                            fill="url(#colorGradient)"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient
                              id="colorGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <ProOnlyComponent />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
