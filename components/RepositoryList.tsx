"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitFork,
  Star,
  GitBranch,
  ExternalLink,
  GitCommit,
} from "lucide-react";
import { Link } from "next-view-transitions";
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

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
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

const PAGE_SIZE = 6;

export function RepositoryList({ repositories }: RepositoryListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(repositories.length / PAGE_SIZE);

  const paginatedRepos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return repositories.slice(start, start + PAGE_SIZE);
  }, [repositories, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedRepos.map((repo) => (
            <div
              key={repo.name}
              className="rounded-3xl border bg-primary/5 p-2 backdrop-blur-md"
            >
              <Card className="group h-full rounded-2xl border transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{repo.name}</h3>
                          {repo.url && (
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                              }}
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Link href={repo.url} target="_blank">
                                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </Link>
                            </motion.div>
                          )}
                        </div>
                        {repo.description && (
                          <motion.p
                            className="mb-3 line-clamp-2 text-sm text-muted-foreground"
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
                      className="mb-4 flex items-center gap-4 text-sm text-muted-foreground"
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
                      className="mt-auto border-t pt-4"
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
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <GitCommit className="h-4 w-4" />
                            <span>Commits</span>
                          </div>
                          <p className="font-medium">
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
                          <p className="text-sm text-muted-foreground">
                            Lines Changed
                          </p>
                          <p className="font-medium">
                            {repo.linesChanged.toLocaleString()}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </AnimatePresence>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {/* Prev Button */}
          <button
            className="rounded-lg bg-primary/5 px-3 py-1 text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 dark:bg-primary/5 dark:text-primary-foreground dark:hover:bg-primary/10"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>

          {/* Page Numbers with Ellipsis */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              return (
                p === 1 || // Always show first page
                p === totalPages || // Always show last page
                Math.abs(p - page) <= 1 // Show current, one before, and one after
              );
            })
            .reduce((acc: (number | "...")[], p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) {
                acc.push("...");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-primary dark:text-primary-foreground"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}`}
                  className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                    page === item
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-primary/5 text-primary hover:bg-primary/10 dark:bg-primary/5 dark:text-primary-foreground dark:hover:bg-primary/10"
                  }`}
                  onClick={() => handlePageChange(item)}
                >
                  {item}
                </button>
              ),
            )}

          {/* Next Button */}
          <button
            className="rounded-lg bg-primary/5 px-3 py-1 text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 dark:bg-primary/5 dark:text-primary-foreground dark:hover:bg-primary/10"
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
