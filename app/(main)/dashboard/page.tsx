"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GithubDashboard } from "@/components/GithubDashboard";
import { GithubConnect } from "@/components/GithubConnect";
import { motion, Variants } from "motion/react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const container: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signup");
    },
  });

  const [githubToken, setGithubToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGithubToken() {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            `/api/github-token?userId=${session.user.id}`,
          );
          const data = await response.json();
          setGithubToken(data.token || null);
        } catch (error) {
          console.error("Failed to fetch GitHub token:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      fetchGithubToken();
    }
  }, [session]);

  // Show loading state while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <PageHeader
          title="GitHub Dashboard"
          description="View your GitHub repositories and activity"
        />
      </motion.div>

      <motion.div
        className="container mx-auto max-w-7xl px-4 py-12"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={fadeInUp}>
          <GithubConnect hasGithubToken={!!githubToken} />
        </motion.div>

        {githubToken && (
          <motion.div
            variants={fadeInUp}
            className="rounded-lg border-2 border-transparent bg-card p-6 shadow-lg transition-all duration-300 hover:border-purple-500/20 hover:shadow-xl dark:hover:border-purple-500/10"
          >
            <GithubDashboard />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
