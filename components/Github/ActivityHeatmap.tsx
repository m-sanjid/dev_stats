"use client";

import { format, parseISO, subDays } from "date-fns";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
    if (count < 3) return "bg-green-200 dark:bg-green-900";
    if (count < 5) return "bg-green-300 dark:bg-green-800";
    if (count < 8) return "bg-green-400 dark:bg-green-700";
    return "bg-green-500 dark:bg-green-600";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Activity Heatmap
        </h3>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600" />
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(({ date, count }) => (
          <Tooltip key={date}>
            <TooltipTrigger asChild>
              <motion.div
                className={`aspect-square w-full cursor-pointer rounded-md transition-all duration-200 ${getIntensityClass(
                  count,
                )}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-neutral-900 p-2 text-sm text-white dark:bg-white dark:text-neutral-900">
              <div className="font-medium">
                {format(parseISO(date), "MMM d, yyyy")}
              </div>
              <div className="text-neutral-400 dark:text-neutral-600">
                {count} contribution{count !== 1 ? "s" : ""}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
