"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitFork,
  Star,
  GitBranch,
  ExternalLink,
  GitCommit,
} from "lucide-react";
import Link from "next/link";
import { LanguageTag } from "@/components/ui/language-tag";
import { StatBadge } from "@/components/ui/stat-badge";

type Repository = {
  name: string;
  commits: number;
  linesChanged: number;
  description?: string;
  url?: string;
  language?: string;
  stars?: number;
  forks?: number;
  branches?: number;
};

interface RepositoryListProps {
  repositories: Repository[];
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {repositories.map((repo) => (
        <motion.div
          key={repo.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full hover:shadow-lg transition-all duration-200 dark:hover:shadow-purple-500/5 group">
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {repo.name}
                      </h3>
                      {repo.url && (
                        <Link
                          href={repo.url}
                          target="_blank"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-400 hover:text-purple-500" />
                        </Link>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {repo.description}
                      </p>
                    )}
                    {repo.language && <LanguageTag language={repo.language} />}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {repo.stars !== undefined && (
                    <StatBadge icon={Star} value={repo.stars} label="Stars" />
                  )}
                  {repo.forks !== undefined && (
                    <StatBadge icon={GitFork} value={repo.forks} label="Forks" />
                  )}
                  {repo.branches !== undefined && (
                    <StatBadge
                      icon={GitBranch}
                      value={repo.branches}
                      label="Branches"
                    />
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <GitCommit className="h-4 w-4" />
                        <span>Commits</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {repo.commits.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Lines Changed
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {repo.linesChanged.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 