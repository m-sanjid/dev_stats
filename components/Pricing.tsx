"use client";

import { Check, Sparkles } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { SubscribeButton } from "./SubscribeButton";
import { motion } from "motion/react";
import BorderDiv from "./BorderDiv";
import SectionHeader from "./SectionHeader";

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
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3"
      >
        {pricingData.map((plan) => {
          const isPro = plan.title === "Pro";
          return (
            <motion.div key={plan.title}>
              <BorderDiv
                className={`${isPro ? "animate-glow border-2 border-primary" : ""} ${isCurrentPlan(plan.title) ? "ring-2 ring-primary" : ""} `}
              >
                <Card className="relative flex flex-col rounded-2xl border">
                  {isPro && (
                    <motion.div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2">
                      {!isCurrentPlan(plan.title) && (
                        <div className="flex items-center gap-1 rounded-full bg-primary px-5 py-1 text-sm font-medium text-primary-foreground shadow-lg">
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          POPULAR
                        </div>
                      )}
                    </motion.div>
                  )}
                  <CardHeader>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CardTitle className="text-2xl">{plan.title}</CardTitle>
                      <p className="text-muted-foreground">
                        {plan.description}
                      </p>
                      <div className="text-4xl font-bold">
                        {plan.price}
                        {plan.period && (
                          <span className="text-xl font-normal text-muted-foreground">
                            /{plan.period}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.ul
                      className="mb-8 space-y-4"
                      initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.4 }}
                    >
                      {plan.features.map((feature) => (
                        <motion.li
                          key={feature}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <motion.div>
                            <Check className="h-5 w-5" />
                          </motion.div>
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
                        <p className="mb-2 text-sm text-muted-foreground">
                          Limitations:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
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
      </motion.div>
    </div>
  );
}
