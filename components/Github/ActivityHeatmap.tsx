"use client";

import { format, parseISO, subDays } from "date-fns";

interface ActivityHeatmapProps {
  data: Record<string, number>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    return {
      date,
      count: data[date] || 0,
    };
  }).reverse();

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count < 3) return "bg-green-200 dark:bg-green-900";
    if (count < 5) return "bg-green-300 dark:bg-green-800";
    if (count < 8) return "bg-green-400 dark:bg-green-700";
    return "bg-green-500 dark:bg-green-600";
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(({ date, count }) => (
        <div
          key={date}
          className={`w-full aspect-square rounded-sm ${getIntensityClass(count)}`}
          title={`${format(parseISO(date), "MMM d")}: ${count} contributions`}
        />
      ))}
    </div>
  );
}
