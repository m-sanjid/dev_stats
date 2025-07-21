"use client";

import React, { useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import DeveloperDashboard from "./Dashboard";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

function AnimateDashboard() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="relative flex w-full flex-col justify-center">
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            key="dashboard"
          >
            <DeveloperDashboard />
          </motion.div>
        ) : (
          <motion.div
            className="flex h-[400px] w-full items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="placeholder"
          >
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Dashboard is hidden
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="sm"
          className="group flex items-center gap-2 rounded-full border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4 transition-colors group-hover:text-neutral-900 dark:group-hover:text-white" />
              Hide Dashboard
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 transition-colors group-hover:text-neutral-900 dark:group-hover:text-white" />
              Show Dashboard
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

export default AnimateDashboard;
