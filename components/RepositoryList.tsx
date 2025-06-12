"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const cardHover = {
  scale: 1.04,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 12,
  },
};

const iconHover = {
  scale: 1.2,
  rotate: 5,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
};

const PAGE_SIZE = 6;

export function RepositoryList({ repositories }: RepositoryListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(repositories.length / PAGE_SIZE);

  const paginatedRepos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return repositories.slice(start, start + PAGE_SIZE);
  }, [repositories, page]);

  // For animated page transitions
  const [direction, setDirection] = useState(0);
  const handlePageChange = (newPage: number) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(newPage);
  };

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={page}
          variants={container}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{
            duration: 0.35,
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {paginatedRepos.map((repo) => (
            <motion.div key={repo.name} variants={item} whileHover={cardHover}>
              <Card className="group h-full rounded-2xl border border-white/30 bg-white/70 shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl dark:border-zinc-700/40 dark:bg-zinc-900/70">
                <CardContent className="p-6">
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <motion.h3
                            className="text-lg font-semibold text-neutral-900 dark:text-white"
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            {repo.name}
                          </motion.h3>
                          {repo.url && (
                            <motion.div
                              whileHover={iconHover}
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Link href={repo.url} target="_blank">
                                <ExternalLink className="h-4 w-4 text-neutral-400 hover:text-purple-500" />
                              </Link>
                            </motion.div>
                          )}
                        </div>
                        {repo.description && (
                          <motion.p
                            className="mb-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {repo.description}
                          </motion.p>
                        )}
                        {repo.language && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <LanguageTag language={repo.language} />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <motion.div
                      className="mb-4 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {repo.stars !== undefined && (
                        <motion.div variants={item}>
                          <StatBadge
                            icon={Star}
                            value={repo.stars}
                            label="Stars"
                          />
                        </motion.div>
                      )}
                      {repo.forks !== undefined && (
                        <motion.div variants={item}>
                          <StatBadge
                            icon={GitFork}
                            value={repo.forks}
                            label="Forks"
                          />
                        </motion.div>
                      )}
                      {repo.branches !== undefined && (
                        <motion.div variants={item}>
                          <StatBadge
                            icon={GitBranch}
                            value={repo.branches}
                            label="Branches"
                          />
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      className="mt-auto border-t border-neutral-200 pt-4 dark:border-neutral-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-1"
                          whileHover={{ scale: 1.02 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <GitCommit className="h-4 w-4" />
                            <span>Commits</span>
                          </div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {repo.commits.toLocaleString()}
                          </p>
                        </motion.div>
                        <motion.div
                          className="space-y-1"
                          whileHover={{ scale: 1.02 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Lines Changed
                          </p>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {repo.linesChanged.toLocaleString()}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            className="rounded-lg bg-zinc-100 px-3 py-1 text-zinc-500 transition-colors hover:bg-indigo-100 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-indigo-900"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                page === i + 1
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-zinc-100 text-zinc-500 hover:bg-indigo-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-indigo-900"
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="rounded-lg bg-zinc-100 px-3 py-1 text-zinc-500 transition-colors hover:bg-indigo-100 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-indigo-900"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
