import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="transition-all duration-200 hover:shadow-lg dark:hover:shadow-purple-500/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {value}
            </div>
            {description && (
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
            {trend !== undefined && (
              <div
                className={`mt-2 text-xs ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
