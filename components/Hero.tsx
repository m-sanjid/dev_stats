"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Github, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PreviewCard from "./Github/PreviewCard";

function Hero() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" />
        <div className="absolute inset-y-0 right-1/2 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Track your developer journey like never before
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent"
          >
            Your Coding Journey{" "}
            <span className="block">Beautifully Quantified</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
          >
            Transform your GitHub activity into compelling proof of work.
            Showcase your skills with beautiful analytics and insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 px-8"
              asChild
            >
              <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group dark:border-gray-700 dark:text-gray-300 px-8"
              asChild
            >
              <Link href="https://github.com/your-repo" target="_blank">
                <Github className="mr-2 h-5 w-5 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                Star on GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 w-full max-w-4xl mx-auto"
          >
            <div className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
              {/* Browser-like top bar */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-700 flex items-center gap-2 px-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Replace with your actual preview image */}
              <div className="pt-6">
                <div className="aspect-[16/9] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                  <PreviewCard />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
