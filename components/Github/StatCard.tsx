import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "motion/react";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="group relative overflow-hidden border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-100 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-purple-900/20" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-purple-500 transition-colors group-hover:text-purple-600 dark:text-purple-400 dark:group-hover:text-purple-300" />
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
          className="text-2xl font-bold text-neutral-900 dark:text-white"
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);
