"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  suffix?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  suffix = "",
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState("0");
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let numericValue: number;
    let finalSuffix = suffix;

    if (value.includes("K")) {
      numericValue =
        parseFloat(value.replace("K+", "").replace("K", "")) * 1000;
      finalSuffix = "K+";
    } else if (value.includes("/5")) {
      numericValue = parseFloat(value.replace("/5", ""));
      finalSuffix = "/5";
    } else {
      numericValue = parseInt(value.replace("+", ""));
      if (value.includes("+")) finalSuffix = "+";
    }

    const controls = animate(0, numericValue, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (finalSuffix === "K+") {
          const displayNum = latest / 1000;
          setDisplayValue(displayNum.toFixed(displayNum < 10 ? 1 : 0) + "K+");
        } else if (finalSuffix === "/5") {
          setDisplayValue(latest.toFixed(1) + "/5");
        } else {
          setDisplayValue(Math.floor(latest).toString() + finalSuffix);
        }
      },
    });

    return controls.stop;
  }, [isInView, value, duration, suffix]);

  return (
    <motion.div
      ref={nodeRef}
      className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
    >
      {displayValue}
    </motion.div>
  );
};
