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
  Filler,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { subDays, format, addDays } from "date-fns";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
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
        label: "Commits",
        data,
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#8B5CF6",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter",
          },
          color: "#6B7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter",
          },
          color: "#6B7280",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleFont: {
          size: 14,
          family: "Inter",
        },
        bodyFont: {
          size: 13,
          family: "Inter",
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="group flex items-center gap-2 rounded-full border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 4} // Limit to 4 weeks
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Previous Week
          </Button>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold text-neutral-900 dark:text-white"
        >
          {weekOffset === 0
            ? "This Week"
            : `${weekOffset} Week${weekOffset > 1 ? "s" : ""} Ago`}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="group flex items-center gap-2 rounded-full border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
            onClick={() => setWeekOffset(Math.max(weekOffset - 1, 0))}
            disabled={weekOffset === 0}
          >
            Next Week
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="h-[300px] w-full rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
      >
        <Line data={chartData} options={chartOptions} />
      </motion.div>
    </motion.div>
  );
};

export default CommitChart;
