"use client";

import { ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepositoryList } from "@/components/RepositoryList";
import { useState, useMemo } from "react";
import { motion } from "motion/react";

interface Repository {
  name: string;
  description: string | undefined;
  url: string;
  stars: number;
  forks: number;
  branches: number;
  lastUpdated: string;
  commits: number;
  linesChanged: number;
  language: string;
}

interface GitHubMetrics {
  totalCommits: number;
  totalLines: number;
  totalCodingHours: number;
  filesChanged: number;
  repositories: Repository[];
  githubProfile: {
    username: string;
    avatarUrl: string;
  } | null;
  weeklyCommits: Record<string, number>;
  dailyActivity: Record<string, number>;
  language: Record<string, number>;
}

interface RepoPageProps {
  metrics: GitHubMetrics | null;
}

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

export default function RepoPageClient({ metrics }: RepoPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "commits">(
    "updated",
  );

  const filteredRepositories = useMemo(() => {
    if (!metrics?.repositories) return [];

    return metrics.repositories
      .filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description?.toLowerCase() || "").includes(
            searchQuery.toLowerCase(),
          ),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "stars":
            return (b.stars || 0) - (a.stars || 0);
          case "commits":
            return (b.commits || 0) - (a.commits || 0);
          case "updated":
          default:
            return (
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime()
            );
        }
      });
  }, [metrics?.repositories, searchQuery, sortBy]);

  if (!metrics) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Please sign in to view this page
          </h1>
          <Button
            className="transform bg-gradient-to-r from-purple-600 to-blue-600 px-8 transition-all duration-300 hover:-translate-y-1 hover:from-purple-700 hover:to-blue-700"
            asChild
          >
            <Link href="/signup">Sign In</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!metrics.repositories.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="ghost" asChild className="group mb-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="py-12 text-center"
          >
            <div className="mx-auto max-w-md rounded-lg border-2 border-transparent bg-card p-8 shadow-lg transition-all duration-300 hover:border-purple-500/20 hover:shadow-xl dark:hover:border-purple-500/10">
              <h2 className="mb-3 text-2xl font-semibold text-neutral-900 dark:text-white">
                No repositories found
              </h2>
              <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                Connect your GitHub account to see your repositories here.
              </p>
              <Button
                asChild
                className="transform bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:from-purple-700 hover:to-blue-700"
              >
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Button variant="ghost" asChild className="group mb-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                Your Repositories
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                {filteredRepositories.length} of {metrics.repositories.length}{" "}
                repositories • {metrics.totalCommits.toLocaleString()} total
                commits
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              variants={item}
              className="mb-8 flex flex-col gap-4 md:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-neutral-400" />
                <Input
                  placeholder="Search repositories..."
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: "updated" | "stars" | "commits") =>
                  setSortBy(value)
                }
                defaultValue="updated"
              >
                <SelectTrigger className="w-[180px] transition-all duration-300 focus:ring-2 focus:ring-purple-500/20">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="commits">Most Commits</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={item}>
              <RepositoryList repositories={filteredRepositories} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
