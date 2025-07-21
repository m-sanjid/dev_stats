"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "motion/react";

interface DailyActivityChartProps {
  data: Record<string, number>;
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    commits: data[i] || 0,
  }));

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
        <div className="rounded-lg bg-neutral-900 p-3 text-sm text-white shadow-lg dark:bg-white dark:text-neutral-900">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-neutral-400 dark:text-neutral-600">
            {`${payload[0].value} commits`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Daily Activity
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Commits by hour
        </p>
      </div>

      <div className="h-[300px] w-full rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={hours}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(107, 114, 128, 0.1)"
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="commits"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
