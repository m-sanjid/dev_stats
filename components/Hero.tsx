"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Github, Sparkles, Star, Zap, Code2 } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PreviewCard from "./Github/PreviewCard";
import PulsingGrid from "./PulsingGrid";

function Hero() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="relative flex min-h-[95vh] items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[800px] w-[800px] animate-blob rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 opacity-20 blur-3xl dark:from-neutral-800 dark:to-neutral-700" />
        <div className="absolute -bottom-40 -right-40 h-[800px] w-[800px] animate-blob animation-delay-2000 rounded-full bg-gradient-to-r from-neutral-300 to-neutral-400 opacity-20 blur-3xl dark:from-neutral-700 dark:to-neutral-600" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000 rounded-full bg-gradient-to-r from-neutral-400 to-neutral-500 opacity-20 blur-3xl dark:from-neutral-600 dark:to-neutral-500" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 py-24 text-center md:py-36">
        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200">
            <Sparkles className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            AI-Powered Insights
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200">
            <Code2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            Smart README Generator
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200">
            <Zap className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            Real-time Analytics
          </div>
        </motion.div>
        <PulsingGrid>


        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          className="mb-6 text-6xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-7xl"
        >
          Transform Your
          <span className="block bg-gradient-to-r from-neutral-600 to-neutral-400 bg-clip-text text-transparent dark:from-neutral-300 dark:to-neutral-500">
            GitHub Journey
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          className="mx-auto mb-12 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 md:text-xl"
        >
          Elevate your developer portfolio with AI-powered insights. Generate stunning READMEs, track contribution trends, and showcase your coding journey with style.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
          className="mb-16 flex w-full flex-col justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="group rounded-full bg-neutral-900 px-10 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              asChild
            >
              <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="group rounded-full border-2 border-neutral-200 bg-white/80 px-10 py-6 text-lg font-semibold text-neutral-800 shadow backdrop-blur-sm transition-all hover:border-neutral-900 hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-white dark:hover:border-white"
              asChild
            >
              <Link href="https://github.com/your-repo" target="_blank">
                <Github className="mr-2 h-5 w-5 transition-colors group-hover:text-neutral-900 dark:group-hover:text-white" />
                Star on GitHub
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
          className="mb-16 grid grid-cols-2 gap-8 sm:grid-cols-3"
        >
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">10K+</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">50K+</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Repositories Analyzed</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">4.9/5</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">User Rating</div>
          </div>
        </motion.div>
        </PulsingGrid>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-neutral-200 bg-white/90 shadow-2xl backdrop-blur-md transition-all hover:scale-[1.01] dark:border-neutral-700 dark:bg-neutral-900/90"
        >
          <div className="relative">
            <div className="absolute left-0 right-0 top-0 z-10 flex h-8 items-center gap-2 rounded-t-[32px] border-b border-neutral-200 bg-neutral-100/90 px-4 dark:border-neutral-700 dark:bg-neutral-800/90">
              <div className="flex gap-1.5">
                <motion.div className="h-3 w-3 rounded-full bg-red-400" whileHover={{ scale: 1.2 }} />
                <motion.div className="h-3 w-3 rounded-full bg-yellow-400" whileHover={{ scale: 1.2 }} />
                <motion.div className="h-3 w-3 rounded-full bg-green-400" whileHover={{ scale: 1.2 }} />
              </div>
            </div>
            <div className="pt-8">
              <div className="flex aspect-[16/9] items-center justify-center bg-neutral-100/80 dark:bg-neutral-800/80">
                <PreviewCard />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;