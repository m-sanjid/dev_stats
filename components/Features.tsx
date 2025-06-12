"use client";

import React, { useState } from "react";
import { BarChart, GithubIcon, Share2, Code2, Zap, Trophy } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";

const features = [
  {
    title: "AI-Powered GitHub Insights",
    description:
      "Analyze your repositories with AI to generate intelligent summaries, contributor analysis, and auto-generated READMEs.",
    icon: <GithubIcon className="h-8 w-8" />,
    color: "bg-gradient-to-br from-indigo-400 to-sky-400",
    span: "md:col-span-2",
  },
  {
    title: "Metrics Dashboard",
    description:
      "Visualize your contribution trends, language usage, repo activity and commit health with elegant interactive charts.",
    icon: <BarChart className="h-8 w-8" />,
    color: "bg-gradient-to-br from-purple-400 to-fuchsia-400",
  },
  {
    title: "Milestone Achievements",
    description:
      "Celebrate coding milestones with badge unlocks, commit streaks, and language mastery levels.",
    icon: <Trophy className="h-8 w-8" />,
    color: "bg-gradient-to-br from-amber-400 to-lime-400",
    span: "md:row-span-2",
  },
  {
    title: "AI Developer Portfolio",
    description:
      "Automatically generate and update a personal portfolio with AI-curated project highlights and role summaries.",
    icon: <Code2 className="h-8 w-8" />,
    color: "bg-gradient-to-br from-pink-400 to-rose-400",
    span: "md:col-span-2",
  },

  {
    title: "Live Repo Updates",
    description:
      "Keep your portfolio always fresh with real-time updates from GitHub activity like commits, issues, and stars.",
    icon: <Zap className="h-8 w-8" />,
    color: "bg-gradient-to-br from-yellow-400 to-orange-400",
  },
  {
    title: "Easy Sharing",
    description:
      "Instantly share your GitHub story, AI-generated insights, and charts on social media with branded visuals.",
    icon: <Share2 className="h-8 w-8" />,
    color: "bg-gradient-to-br from-violet-400 to-blue-400",
  },
];

function Features() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return (
    <section id="features" className="container mx-auto max-w-5xl px-4 py-24">
      <SectionHeader
        tag="Features"
        title="AI GitHub Analyzer"
        subtitle="Smartly analyze, visualize, and showcase your GitHub developer journey."
      />
      <LayoutGroup>
        <motion.div
          onMouseLeave={() => setHoveredIdx(null)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid auto-rows-[minmax(180px,_1fr)] grid-cols-1 gap-6 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              onMouseEnter={() => setHoveredIdx(index)}
              key={feature.title}
              initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${feature.span ?? ""}`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group relative h-full w-full rounded-3xl border border-white/[0.08] bg-white/5 p-2 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-black/10"
              >
                {hoveredIdx === index && (
                  <motion.div
                    layoutId="hovered"
                    className={`absolute inset-0 z-0 rounded-2xl border-2 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-80 ${feature.color}`}
                    aria-hidden="true"
                  >
                    <motion.div
                      className={`absolute inset-1 z-10 rounded-2xl border-2 bg-white dark:bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
                <div className="h-full w-full rounded-2xl border p-4">
                  <CardHeader className="relative z-10">
                    <div
                      className={`w-fit rounded-lg border-2 p-2 transition-colors duration-300 ${feature.color}`}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 text-sm text-zinc-600 dark:text-zinc-300">
                    {feature.description}
                  </CardContent>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </LayoutGroup>
    </section>
  );
}

export default Features;
