"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface LanguageAnalyticsProps {
  metrics: {
    language?: Record<string, number>;
  };
}

export function LanguageAnalytics({ metrics }: LanguageAnalyticsProps) {
  const rawData = Object.entries(metrics.language || {});
  const total = rawData.reduce((sum, [, value]) => sum + value, 0);

  const processedData: { name: string; value: number }[] = [];
  let otherTotal = 0;

  rawData.forEach(([name, value]) => {
    const percentage = (value / total) * 100;
    if (percentage < 5) {
      otherTotal += value;
    } else {
      processedData.push({ name, value });
    }
  });

  if (otherTotal > 0) {
    processedData.push({ name: "Other", value: otherTotal });
  }

  return (
    <Card>
      <CardContent className="sm:p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {processedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
