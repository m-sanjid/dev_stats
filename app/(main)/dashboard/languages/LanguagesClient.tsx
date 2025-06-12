"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { LanguageAnalytics } from "@/components/LanguageAnalytics";
import { fetchGitHubMetrics } from "@/lib/github";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
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

export function LanguagesClient({ initialMetrics }: { initialMetrics: any }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signup");
    },
  });

  const [githubToken, setGithubToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.id) {
        try {
          // Fetch the GitHub token
          const tokenResponse = await fetch(
            `/api/github-token?userId=${session.user.id}`,
          );
          const tokenData = await tokenResponse.json();
          const token = tokenData.token || null;
          setGithubToken(token);

          // Fetch metrics with the token
          if (token) {
            const metricsData = await fetchGitHubMetrics(token);
            setMetrics(metricsData);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      fetchData();
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
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto max-w-7xl px-4 py-8"
      >
        <motion.div
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <Button variant="ghost" asChild className="group">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>
            </Button>
            <PageHeader
              title="Language Analytics"
              description="Detailed analysis of your programming language usage across repositories"
            />
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-lg bg-card/50 p-6 backdrop-blur-sm"
          >
            {metrics ? (
              <LanguageAnalytics metrics={metrics} />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No GitHub data available. Please ensure your GitHub account is
                connected.
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
