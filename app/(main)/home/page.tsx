"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Layout, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface HomeItem {
  title: string;
  desc: string;
  href: string;
  button: string;
  label?: string;
}

const homeItems: HomeItem[] = [
  {
    title: "Dashboard",
    desc: "View your portfolio overview and analytics",
    href: "/dashboard",
    button: "Go to Dashboard",
  },
  {
    title: "AI Portfolio",
    label: "pro",
    desc: "Create AI portfolio based on your work",
    href: "port",
    button: "Portfolio",
  },
  {
    title: "Repository Metrics",
    label: "pro",
    desc: "Deep dive into your repositories performance, Track stars, forks...",
    href: "/dashboard/repos",
    button: "Repositories",
  },
  {
    title: "AI README",
    label: "pro",
    desc: "Generate AI README for your repos",
    href: "/dashboard/readme",
    button: "AI README",
  },
  {
    title: "Languages",
    desc: "view your programming languages",
    href: "/dashboard/languages",
    button: "Languages",
  },
  {
    title: "Smart Analytics",
    label: "pro",
    desc: "View detailed Analytics",
    href: "/dashboard/analytics",
    button: "Analytics",
  },
  {
    title: "Code Review",
    label: "pro",
    desc: "AI powered code review for PRs",
    href: "/dashboard/code-review",
    button: "Code Review",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-background to-background dark:from-purple-900/20">
        <main className="container mx-auto max-w-5xl px-4 py-16">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 text-center"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div className="space-y-4" variants={item}>
              <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text py-10 text-4xl font-bold tracking-tighter text-transparent dark:from-purple-400 dark:to-blue-400 sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to Your DevStats
              </h1>
              <p className="mx-auto max-w-[700px] pb-8 text-muted-foreground md:text-xl">
                Manage your portfolios, track performance, and get actionable
                insights all in one place.
              </p>
            </motion.div>

            {isAuthenticated ? (
              <motion.div
                className="grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3"
                variants={container}
              >
                {homeItems.map((homeItem, index) => (
                  <motion.div
                    key={homeItem.title}
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="group overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg dark:hover:shadow-purple-500/5">
                      <CardHeader>
                        <div className="flex justify-between py-2">
                          <Layout className="h-8 w-8 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                          {homeItem.label && (
                            <div className="flex items-center gap-1 rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600">
                              <Sparkles className="h-3 w-3" />
                              {homeItem.label}
                            </div>
                          )}
                        </div>
                        <CardTitle className="transition-colors group-hover:text-purple-600">
                          {homeItem.title}
                        </CardTitle>
                        <CardDescription className="transition-colors group-hover:text-muted-foreground/80">
                          {homeItem.desc}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link
                          href={
                            homeItem.href === "port"
                              ? `/profile/${session.user.username || session.user.id}`
                              : homeItem.href
                          }
                        >
                          <Button className="w-full transform bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 hover:translate-y-[-2px] hover:from-purple-700 hover:to-blue-700">
                            {homeItem.button}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="w-full max-w-md border-2 border-transparent transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg">
                  <CardHeader>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="mx-auto"
                    >
                      <Lock className="h-8 w-8 text-purple-600" />
                    </motion.div>
                    <CardTitle className="mt-4">Access Required</CardTitle>
                    <CardDescription>
                      Please sign in to access your personalized dashboard and
                      features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Link href="/signup">
                      <Button className="transform bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 hover:translate-y-[-2px] hover:from-purple-700 hover:to-blue-700">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>

    </div>
  );
}
