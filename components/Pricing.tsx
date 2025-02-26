"use client";

import { Check, Sparkles } from "lucide-react";
import React from "react";
import { CardContainer } from "./ui/card-container";
import * as m from "motion/react-client";
import { useSession } from "next-auth/react";
import { SubscribeButton } from "./SubscribeButton";

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
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl opacity-70" />
      </div>

      {pricingData.map((plan, index) => {
        const isPro = plan.title === "Pro";

        return (
          <m.div
            key={plan.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CardContainer
              highlight={isPro}
              className={`flex flex-col relative backdrop-blur-sm 
                ${isPro ? "border-purple-500 dark:border-purple-400" : ""}
                ${isCurrentPlan(plan.title) ? "ring-2 ring-green-500" : ""}
              `}
            >
              {isPro && (
                <m.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </m.div>
              )}

              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-1 p-4"
              >
                <h3 className="text-2xl font-bold mb-2 dark:text-white">
                  {plan.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold mb-6 dark:text-white">
                  {plan.price}
                  {plan.period && (
                    <span className="text-xl font-normal text-gray-600 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <m.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <Check
                        className={`h-5 w-5 ${
                          isPro ? "text-purple-500" : "text-green-500"
                        }`}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </m.li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Limitations:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </m.div>

              <div className="p-6 pt-0">
                <SubscribeButton
                  action={isCurrentPlan}
                  plan={plan}
                  isPro={isPro}
                />
              </div>
            </CardContainer>
          </m.div>
        );
      })}
    </m.div>
  );
}
