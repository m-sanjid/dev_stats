"use client";

import React, { useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import DeveloperDashboard from "./Dashboard";

function AnimateDashboard() {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="w-full flex flex-col relative justify-center">
      <AnimatePresence initial={false}>
        {isVisible ? (
          <motion.div
            className="bg-cyan-500 h-full w-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            key="box"
          >
            <DeveloperDashboard />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.button
        style={button}
        onClick={() => setIsVisible(!isVisible)}
        whileTap={{ y: 1 }}
      >
        {isVisible ? "Hide" : "Show"}
      </motion.button>
    </div>
  );
}

export default AnimateDashboard;

const button: React.CSSProperties = {
  backgroundColor: "#0cdcf7",
  borderRadius: "10px",
  padding: "10px 20px",
  color: "#0f1115",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
};
