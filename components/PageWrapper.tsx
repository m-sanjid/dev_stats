"use client";

import { motion } from "motion/react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-3.5rem)] bg-neutral-50 dark:bg-neutral-900"
    >
      {children}
    </motion.div>
  );
}
