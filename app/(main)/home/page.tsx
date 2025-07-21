"use client";

import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Code2,
  FileText,
  GitBranch,
  Sparkles,
  TrendingUp,
  User,
  Search,
} from "lucide-react";
import { animate, motion, useInView, Variants } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { fetchGitHubMetrics } from "@/lib/github";

interface GitHubRepository {
  name: string;
  stars: number;
}

interface GitHubStats {
  repositories: GitHubRepository[];
  totalCommits: number;
  languages: Record<string, number>;
  totalStars: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconMap = {
  dashboard: BarChart3,
  portfolio: User,
  repositories: GitBranch,
  readme: FileText,
  languages: Code2,
  analytics: TrendingUp,
  review: Search,
};

interface HomeItem {
  title: string;
  desc: string;
  href: string;
  button: string;
  label?: string;
  icon: keyof typeof iconMap;
  category: "core" | "pro" | "tools";
}

const homeItems: HomeItem[] = [
  {
    title: "Dashboard",
    desc: "Comprehensive overview of your development activity and key metrics",
    href: "/dashboard",
    button: "View Dashboard",
    icon: "dashboard",
    category: "core",
  },
  {
    title: "Developer Portfolio",
    label: "pro",
    desc: "AI-powered portfolio showcasing your best work and achievements",
    href: "/portfolio",
    button: "Create Portfolio",
    icon: "portfolio",
    category: "pro",
  },
  {
    title: "Repository Analytics",
    label: "pro",
    desc: "Deep insights into repository performance, growth trends, and engagement",
    href: "/dashboard/repos",
    button: "View Analytics",
    icon: "repositories",
    category: "pro",
  },
  {
    title: "Smart README",
    label: "pro",
    desc: "Generate professional documentation with AI-powered suggestions",
    href: "/dashboard/readme",
    button: "Generate README",
    icon: "readme",
    category: "pro",
  },
  {
    title: "Language Insights",
    desc: "Analyze your programming language usage and proficiency trends",
    href: "/dashboard/languages",
    button: "View Languages",
    icon: "languages",
    category: "core",
  },
  {
    title: "Advanced Analytics",
    label: "pro",
    desc: "Detailed performance metrics with predictive insights and recommendations",
    href: "/dashboard/analytics",
    button: "View Analytics",
    icon: "analytics",
    category: "pro",
  },
  {
    title: "Code Review AI",
    label: "pro",
    desc: "Intelligent code review assistance with quality and security insights",
    href: "/dashboard/code-review",
    button: "Start Review",
    icon: "review",
    category: "pro",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<GitHubStats>({
    repositories: [],
    totalCommits: 0,
    languages: {},
    totalStars: 0,
  });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "core" | "pro" | "tools" | string
  >("all");
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    async function getStats() {
      if (user?.id) {
        const metrics = await fetchGitHubMetrics(user.id);
        const totalStars = metrics.repositories.reduce(
          (acc: number, repo: GitHubRepository) => acc + repo.stars,
          0,
        );
        setStats({
          repositories: metrics.repositories,
          totalCommits: metrics.totalCommits,
          languages: metrics.language,
          totalStars: totalStars,
        });
      }
    }
    getStats();
  }, [user?.id]);

  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isCardsInView = useInView(cardsRef, { once: true });

  const filteredItems =
    activeCategory === "all"
      ? homeItems
      : homeItems.filter((item) => item.category === activeCategory);

  const statsCards = [
    {
      title: "Active Repos",
      value: stats.repositories.length,
      icon: GitBranch,
    },
    {
      title: "Languages",
      value: Object.keys(stats.languages).length,
      icon: Code2,
    },
    { title: "Total Stars", value: stats.totalStars, icon: Sparkles },
    { title: "Commits", value: stats.totalCommits, icon: TrendingUp },
  ];

  const AnimatedCounter = ({
    value,
    duration = 2,
  }: {
    value: number;
    duration?: number;
  }) => {
    const [displayValue, setDisplayValue] = useState("0");
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true });

    useEffect(() => {
      if (!isInView) return;

      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest).toString());
        },
      });

      return () => controls.stop();
    }, [isInView, value, duration]);

    return (
      <motion.div
        ref={nodeRef}
        className="text-2xl font-bold text-neutral-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {displayValue}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900">
      <main className="container mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        <motion.div
          ref={heroRef}
          className="flex flex-col items-center justify-center space-y-8 text-center"
          initial="hidden"
          animate={isHeroInView ? "show" : "hidden"}
          variants={container}
        >
          <motion.div className="max-w-4xl space-y-6" variants={item}>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-4 w-4" />
              Developer Analytics Platform
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 bg-clip-text text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-400">
                Your Development
              </span>
              <br />
              <span className="bg-gradient-to-r from-neutral-600 via-neutral-800 to-black bg-clip-text text-transparent dark:from-neutral-400 dark:via-neutral-200 dark:to-white">
                Command Center
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-xl">
              Comprehensive analytics, AI-powered insights, and professional
              tools to elevate your development workflow and showcase your
              expertise.
            </p>
          </motion.div>

          {!isAuthenticated && (
            <motion.div
              className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4"
              variants={item}
            >
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={
                      isHeroInView
                        ? { scale: 1, rotate: 0 }
                        : { scale: 0, rotate: -180 }
                    }
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <stat.icon className="mx-auto mb-2 h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  </motion.div>
                  <AnimatedCounter
                    value={stat.value}
                    duration={2 + index * 0.2}
                  />
                  <motion.div
                    className="text-xs text-neutral-500 dark:text-neutral-400"
                    initial={{ opacity: 0 }}
                    animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  >
                    {stat.title}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          ref={cardsRef}
          className="mt-16 space-y-8"
          initial="hidden"
          animate={isCardsInView ? "show" : "hidden"}
          variants={container}
        >
          <motion.div className="flex justify-center" variants={item}>
            <div className="inline-flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              {["all", "core", "pro", "tools"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    activeCategory === category
                      ? "rounded-md bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
          >
            {filteredItems.map((card, index) => (
              <motion.div
                key={index}
                variants={item}
                onMouseEnter={() => setHoveredCard(card.title)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className="h-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {React.createElement(iconMap[card.icon], {
                          className: "h-6 w-6 text-neutral-500",
                        })}
                        <CardTitle className="text-lg font-semibold">
                          {card.title}
                        </CardTitle>
                      </div>
                      {card.label && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {card.label}
                        </span>
                      )}
                    </div>
                    <CardDescription className="pt-2">
                      {card.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={card.href}>
                      <Button
                        variant={
                          hoveredCard === card.title ? "default" : "outline"
                        }
                        className="w-full transition-all duration-300"
                      >
                        {card.button}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
