"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
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
import { Button } from "@/components/ui/button";
import { subDays, format, addDays } from "date-fns";

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

interface CommitChartProps {
  weeklyCommits: { [date: string]: number }; // Example: { "2024-02-01": 5, "2024-02-02": 8 }
}

const CommitChart: React.FC<CommitChartProps> = ({ weeklyCommits }) => {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = last week, etc.

  // Get the start of the selected week
  const startOfSelectedWeek = subDays(new Date(), weekOffset * 7);

  // Generate labels and data for the selected week
  const getWeeklyData = () => {
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = format(addDays(startOfSelectedWeek, i), "yyyy-MM-dd");
      labels.push(format(addDays(startOfSelectedWeek, i), "EEE dd")); // Format as "Mon 01"
      data.push(weeklyCommits[currentDate] || 0); // Default to 0 if no data
    }

    return { labels, data };
  };

  const { labels, data } = getWeeklyData();

  const chartData = {
    labels,
    datasets: [
      {
        label: "Commits Per Day",
        data,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { font: { size: 12 } }, beginAtZero: true },
    },
    plugins: {
      legend: { display: true, position: "top" as const },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset >= 4} // Limit to 4 weeks
        >
          ← Previous Week
        </Button>
        <h2 className="text-lg font-semibold">
          {weekOffset === 0
            ? "This Week"
            : `${weekOffset} Week${weekOffset > 1 ? "s" : ""} Ago`}
        </h2>
        <Button
          variant="outline"
          className="bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
          onClick={() => setWeekOffset(Math.max(weekOffset - 1, 0))}
          disabled={weekOffset === 0}
        >
          Next Week →
        </Button>
      </div>
      <div className="h-[300px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CommitChart;
