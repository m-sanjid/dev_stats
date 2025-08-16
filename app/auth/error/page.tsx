"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/Callout";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-xl"
      >
        <Callout>
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          </motion.div>

          <h1 className="text-2xl font-semibold text-red-500 mb-2">Authentication Error</h1>

          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
            Error Code: <span className="font-medium">{error}</span>
          </p>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Please try signing in again or choose a different provider.
          </p>

          <div className="flex gap-3">
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Retry Login
            </Button>
            <Button
              variant="ghost"
              className="w-full border border-neutral-300 dark:border-neutral-700"
              onClick={() => router.push("/")}
            >
              Go Home
            </Button>
          </div>
        </Callout>
      </motion.div>
    </main>
  );
}
