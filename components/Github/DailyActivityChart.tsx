"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyActivityChartProps {
  data: Record<string, number>;
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`, // Improve readability
    commits: data[i] || 0,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hours}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip formatter={(value) => [`Commits: ${value}`, "Hour"]} />
          <Bar dataKey="commits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
