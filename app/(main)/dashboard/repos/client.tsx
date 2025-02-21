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

interface Repository {
  name: string;
  description: string | null;
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
    name: string;
    login: string;
    avatarUrl: string;
  } | null;
  weeklyCommits: Record<string, number>;
  dailyActivity: Record<string, number>;
  language: Record<string, number>;
}

interface RepoPageProps {
  metrics: GitHubMetrics | null;
}

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
      <div className="flex max-w-4xl flex-col items-center justify-center h-screen">
        <h1 className="text-xl p-6">Please sign in to view access this page</h1>
        <Button className="px-8">
          <Link href="/signup">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!metrics.repositories.length) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="text-center py-12">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No repositories found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect your GitHub account to see your repositories here.
            </p>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" asChild className="mb-4 group">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Repositories
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredRepositories.length} of {metrics.repositories.length}{" "}
            repositories • {metrics.totalCommits.toLocaleString()} total commits
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search repositories..."
            className="pl-10"
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
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="stars">Most Stars</SelectItem>
            <SelectItem value="commits">Most Commits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RepositoryList repositories={filteredRepositories} />
    </div>
  );
}
