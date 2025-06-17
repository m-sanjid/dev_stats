"use client";

import { motion } from "motion/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface LanguageAnalyticsProps {
  language: Record<string, number>;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
  "#546E7A",
  "#26a69a",
  "#D10CE8",
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; payload: { percentage: number } }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-muted-foreground">
            {payload[0].name}
          </span>
          <span className="font-bold">{`${payload[0].payload.percentage.toFixed(
            2,
          )}%`}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const LanguageAnalytics = ({ language }: LanguageAnalyticsProps) => {
  const rawData = Object.entries(language);
  const total = rawData.reduce((sum, [, value]) => sum + value, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No language data available.</p>
        </CardContent>
      </Card>
    );
  }

  const processedData: { name: string; value: number; percentage: number }[] =
    [];
  let otherTotal = 0;

  rawData.forEach(([name, value]) => {
    const percentage = (value / total) * 100;
    if (percentage < 3) {
      otherTotal += value;
    } else {
      processedData.push({ name, value, percentage });
    }
  });

  if (otherTotal > 0) {
    processedData.push({
      name: "Other",
      value: otherTotal,
      percentage: (otherTotal / total) * 100,
    });
  }

  processedData.sort((a, b) => b.percentage - a.percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            Language Distribution
          </CardTitle>
          <Code2 className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {processedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              {processedData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <span>{`${entry.percentage.toFixed(2)}%`}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
