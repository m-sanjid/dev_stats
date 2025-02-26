"use client";
import { Button } from "@/components/ui/button";
import { Book, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function RepoButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <Button
        asChild
        variant="outline"
        className="group hover:bg-purple-50 dark:hover:bg-purple-900/20"
      >
        <Link href="/dashboard/repos">
          <Book className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300" />
          Repositories
          <ChevronRight className="ml-2 h-4 w-4 text-purple-400 dark:text-purple-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </Button>
    </motion.div>
  );
}
