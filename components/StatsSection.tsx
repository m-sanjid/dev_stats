"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Icon } from "@tabler/icons-react";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon | Icon;
}

interface StatsSectionProps {
  stats: Stat[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  title?: string;
  description?: string;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export const StatsSection = ({
  stats,
  className = "",
  containerClassName = "",
  cardClassName = "",
  title,
  description,
  columns = { default: 2, sm: 4 },
}: StatsSectionProps) => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  const getGridCols = () => {
    let classes = `grid-cols-${columns.default}`;
    if (columns.sm) classes += ` sm:grid-cols-${columns.sm}`;
    if (columns.md) classes += ` md:grid-cols-${columns.md}`;
    if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
    return classes;
  };

  return (
    <motion.div
      ref={statsRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`w-full ${className}`}
    >
      {/* Optional Title and Description */}
      {(title || description) && (
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {title && (
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
              {description}
            </p>
          )}
        </motion.div>
      )}

      {/* Stats Grid */}
      <div
        className={`mx-auto grid max-w-4xl gap-6 ${getGridCols()} ${containerClassName}`}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/80 ${cardClassName}`}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 50 }}
            animate={
              isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{
              duration: 0.6,
              delay: 0.8 + index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
          >
            <motion.div
              className="mb-3 flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={
                isStatsInView
                  ? { scale: 1, rotate: 0 }
                  : { scale: 0, rotate: -180 }
              }
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
            >
              <stat.icon className="h-6 w-6 text-neutral-600 transition-colors group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200" />
            </motion.div>
            <AnimatedCounter value={stat.value} duration={2 + index * 0.2} />
            <motion.div
              className="mt-1 text-sm text-neutral-600 dark:text-neutral-400"
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
            >
              {stat.label}
            </motion.div>

            {/* Hover gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:from-neutral-800 dark:to-neutral-700"
              whileHover={{ opacity: 0.1 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
