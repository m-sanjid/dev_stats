"use client";

import { Check, Sparkles } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { SubscribeButton } from "./SubscribeButton";
import { motion } from "motion/react";
import BorderDiv from "./BorderDiv";
import SectionHeader from "./SectionHeader";
import { cn } from "@/lib/utils";

const pricingData = [
  {
    title: "Free",
    description: "Perfect for getting started",
    price: "$0",
    features: [
      "Connect GitHub Account",
      "Basic Analytics Dashboard",
      "Repository Statistics",
      "Commit History",
      "Standard API Rate Limits",
    ],
    limitations: [
      "Limited to 5 repositories",
      "Basic metrics only",
      "Community support only",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    title: "Pro",
    description: "For serious developers",
    price: "$10",
    period: "month",
    badge: "POPULAR",
    features: [
      "Everything in Free, plus:",
      "Unlimited Repositories",
      "Advanced Analytics",
      "AI README",
      "AI Portfolio",
      "Custom Dashboards",
      "Priority Support",
      "Webhook Integration",
      "Extended API Access",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
  },
  {
    title: "Enterprise",
    description: "For large teams & organizations",
    price: "Custom",
    features: [
      "Everything in Pro, plus:",
      "Dedicated Support",
      "Custom Integration",
      "SLA Agreement",
      "Advanced Security",
      "Team Training",
      "Custom API Limits",
      "Advanced Analytics",
    ],
    cta: "Contact Sales",
    href: "/contact?enquiry=enterprise",
  },
];

export default function Pricing() {
  const { data: session } = useSession();

  const isCurrentPlan = (planName: string) =>
    session?.user?.subscription === planName.toLowerCase();

  return (
    <div>
      <SectionHeader title="Pricing" subtitle="Choose the right plan for you" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-6xl px-2 sm:px-4 lg:px-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {pricingData.map((plan) => {
            const isPro = plan.title === "Pro";
            return (
              <motion.div key={plan.title} className="h-full">
                <BorderDiv
                  className={cn(
                    "mx-auto max-w-md",
                    isPro ? "animate-glow border-2 border-primary/50" : "",
                    isCurrentPlan(plan.title)
                      ? "border-2 border-primary/10"
                      : "",
                  )}
                >
                  <Card className="relative flex h-full flex-col rounded-2xl border">
                    {isPro && !isCurrentPlan(plan.title) && (
                      <motion.div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2">
                        <div className="flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-[10px] font-medium text-primary-foreground shadow-lg sm:text-[11px]">
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          POPULAR
                        </div>
                      </motion.div>
                    )}

                    <CardHeader>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <CardTitle className="text-lg sm:text-xl md:text-2xl">
                          {plan.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground sm:text-xs md:text-sm">
                          {plan.description}
                        </p>
                        <div className="text-2xl font-bold sm:text-3xl md:text-4xl">
                          {plan.price}
                          {plan.period && (
                            <span className="text-sm font-normal text-muted-foreground sm:text-base">
                              /{plan.period}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </CardHeader>

                    <CardContent className="flex grow flex-col justify-between">
                      <motion.ul
                        className="mb-8 space-y-3"
                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.4 }}
                      >
                        {plan.features.map((feature) => (
                          <motion.li
                            key={feature}
                            className="flex items-start gap-2 text-sm sm:text-xs md:text-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                          >
                            <Check className="mt-1 h-4 w-4 md:h-5 md:w-5" />
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>

                      {plan.limitations && (
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <p className="mb-2 text-sm font-semibold text-muted-foreground">
                            Limitations:
                          </p>
                          <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground sm:text-sm">
                            {plan.limitations.map((limitation) => (
                              <li key={limitation}>{limitation}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      <SubscribeButton
                        action={isCurrentPlan}
                        plan={plan}
                        isPro={isPro}
                      />
                    </CardContent>
                  </Card>
                </BorderDiv>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
