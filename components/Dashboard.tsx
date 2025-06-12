"use client";
import Macbook from "./Macbook";
import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const macbookAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.5,
    },
  },
};

function Dashboard() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto max-w-7xl px-4 py-20"
    >
      <motion.div variants={item} className="mb-16 text-center">
        <motion.h2
          className="mb-4 text-4xl font-bold"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Live Dashboard Preview
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Get real-time insights into your development activity
        </motion.p>
      </motion.div>

      <motion.div
        variants={macbookAnimation}
        className="mt-5"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Macbook />
      </motion.div>
    </motion.section>
  );
}

export default Dashboard;
