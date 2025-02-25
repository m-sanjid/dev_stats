"use client";
import React from "react";
import {
  BarChart,
  GithubIcon,
  Gitlab,
  Share2,
  Code2,
  Zap,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { CardContainer } from "./ui/card-container";

const features = [
  {
    title: "Multi-Platform Integration",
    description:
      "Seamlessly connect GitHub, GitLab, Stack Overflow, and dev.to to showcase your complete developer story in one place.",
    icon: (
      <GithubIcon className="h-8 w-8 text-purple-500 dark:text-purple-400" />
    ),
    delay: 0.1,
  },
  {
    title: "Smart Analytics",
    description:
      "Get deep insights into your coding patterns, contributions, and growth with our advanced analytics dashboard.",
    icon: <BarChart className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
    delay: 0.2,
  },
  {
    title: "Real-time Updates",
    description:
      "Watch your stats update in real-time as you code, commit, and contribute to projects across platforms.",
    icon: <Zap className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
    delay: 0.3,
  },
  {
    title: "Custom Portfolio",
    description:
      "Create a stunning developer portfolio that automatically updates with your latest achievements and projects.",
    icon: <Code2 className="h-8 w-8 text-green-500 dark:text-green-400" />,
    delay: 0.4,
  },
  {
    title: "Achievement System",
    description:
      "Unlock badges and achievements as you reach new milestones in your development journey.",
    icon: <Trophy className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
    delay: 0.5,
  },
  {
    title: "Team Collaboration",
    description:
      "Compare stats with team members and track collective progress on shared projects.",
    icon: <Users className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
    delay: 0.6,
  },
  {
    title: "Cross-Platform Sharing",
    description:
      "Share your developer profile and achievements across social media with one click.",
    icon: <Share2 className="h-8 w-8 text-pink-500 dark:text-pink-400" />,
    delay: 0.7,
  },
  {
    title: "GitLab Integration",
    description:
      "Track your contributions and activity across GitLab repositories alongside your other platforms.",
    icon: <Gitlab className="h-8 w-8 text-red-500 dark:text-red-400" />,
    delay: 0.8,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Features() {
  return (
    <section id="features" className="container max-w-7xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2 block">
          FEATURES
        </span>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Everything You Need
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track, analyze, and showcase your development journey with our
          comprehensive suite of tools
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={item}
            transition={{ delay: feature.delay }}
          >
            <CardContainer className="h-full hover:border-purple-500/50 dark:hover:border-purple-400/50">
              <div className="flex flex-col gap-4 h-full">
                <div
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 w-fit 
                  ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
export default Features;
