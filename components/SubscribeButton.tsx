"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe, Stripe } from "@stripe/stripe-js";

interface Props {
  isPro: boolean;
  plan: {
    title: string;
    cta: string;
  };
  action: (planName: string) => boolean;
}

export const SubscribeButton: React.FC<Props> = ({ isPro, plan, action }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading(plan.title);
      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        console.error(
          "Checkout api error:",
          data.error,
          "Status",
          response.status,
        );
        throw new Error(data.error);
      }

      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      className={`w-full ${
        isPro
          ? "bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary"
          : ""
      }`}
      variant={isPro ? "default" : "outline"}
      size="lg"
      disabled={loading === plan.title || action(plan.title)}
    >
      <>
        {loading === plan.title
          ? "Processing..."
          : action(plan.title)
            ? "Current Plan"
            : plan.cta}
      </>
    </Button>
  );
};

// Stripe client
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
