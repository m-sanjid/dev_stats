import { Check, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { CardContainer } from "./ui/card-container";

const Price = [
  {
    title: "Basic",
    description: "Perfect for getting started",
    price: "$0",
    features: [
      "Connect GitHub",
      "Basic Analytics",
      "Standard Portfolio",
      "Community Support",
    ],
  },
  {
    title: "Pro",
    description: "Most Popular Choice",
    price: "$10",
    badge: "RECOMMENDED",
    features: [
      "Connect Unlimited Platforms",
      "Advanced Analytics",
      "Custom Portfolio",
      "Priority Support",
      "API Access",
      "Team Collaboration",
      "Custom Branding",
    ],
  },
  {
    title: "Enterprise",
    description: "For large teams",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integration",
      "SLA Agreement",
      "Advanced Security",
    ],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="container max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Price.map((plan) => {
          const isPro = plan.title === "Pro";
          return (
            <CardContainer
              key={plan.title}
              highlight={isPro}
              className={`flex flex-col relative ${
                isPro ? "border-purple-500 dark:border-purple-400" : ""
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">
                  {plan.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold mb-6 dark:text-white">
                  {plan.price}
                  {plan.price !== "Custom" && (
                    <span className="text-xl font-normal text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check
                        className={`h-5 w-5 ${
                          isPro ? "text-purple-500" : "text-green-500"
                        }`}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className={`w-full ${
                  isPro
                    ? "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
                    : ""
                }`}
                variant={isPro ? "default" : "outline"}
                size="lg"
              >
                {plan.title === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </CardContainer>
          );
        })}
      </div>
    </section>
  );
}

export default Pricing;
