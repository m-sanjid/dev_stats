"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import PreviewCard from "./Github/PreviewCard";
import PulsingGrid from "./PulsingGrid";
import BorderDiv from "./BorderDiv";
import { FlipWords } from "./ui/flip-words";
import { GlowingEffect } from "./ui/glowing-effect";

function Hero() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const features = [
    "AI-Powered Insights",
    "Smart README Generator",
    "Real-time Analytics",
    "Performance Tracking",
  ];

  return (
    <div className="relative mx-auto flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900">
      {/* Interactive Background Elements */}

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 py-16 text-center">
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <PulsingGrid>
            {/* Feature Badges */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-8 flex flex-wrap items-center justify-center gap-3"
            >
              <BorderDiv>
                <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/90">
                  <FlipWords words={features} />
                </div>
              </BorderDiv>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-6"
            >
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <motion.span
                  className="block text-neutral-900 dark:text-white"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Elevate Your
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-neutral-600 via-neutral-500 to-neutral-400 bg-clip-text text-transparent dark:from-neutral-300 dark:via-neutral-400 dark:to-neutral-500"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Developer Story
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-xl"
            >
              Generate sleek READMEs, visualize your GitHub journey, and wow
              recruiters with interactive analytics.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-16 flex w-full flex-col justify-center gap-4 sm:flex-row"
            >
              <BorderDiv className="group">
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full rounded-2xl"
                >
                  <Link href="https://github.com/your-repo" target="_blank">
                    <motion.span className="flex items-center gap-2">
                      <IconBrandGithub className="h-5 w-5 transition-colors group-hover:text-neutral-900 dark:group-hover:text-white" />
                      Explore on GitHub
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Star className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                      </motion.div>
                    </motion.span>
                  </Link>
                </Button>
              </BorderDiv>

              <BorderDiv className="group">
                <Button size="lg" className="w-full rounded-2xl" asChild>
                  <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                    <motion.span className="flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                    </motion.span>
                  </Link>
                </Button>
              </BorderDiv>
            </motion.div>
          </PulsingGrid>

          {/* Enhanced Preview Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 60, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="mx-auto my-10 w-full max-w-6xl"
          >
            <BorderDiv className="relative bg-white/90 shadow-inner backdrop-blur-lg dark:bg-black/90">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />

              {/* Preview Content */}
              <div className="relative overflow-hidden rounded-2xl border-2 bg-primary/5 backdrop-blur-md">
                <div className="relative z-10 flex aspect-[16/10] items-center justify-center p-8">
                  <PreviewCard />
                </div>
              </div>
            </BorderDiv>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
