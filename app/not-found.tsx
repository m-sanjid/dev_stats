"use client";

import Logo from "@/components/Logo";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-16 
        bg-gradient-to-br from-neutral-50 via-white to-neutral-100 
        dark:from-neutral-950 dark:via-black dark:to-neutral-900"
      aria-label="404 Not Found Page"
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center animate-bounce-slow bg-white/80 dark:bg-black/60 backdrop-blur-md">
          <Logo />
        </div>

        <PageHeader
          title="Page Not Found"
          description="Sorry, this page doesn't exist or may have been moved."
          showBack={false}
          gradient
        />

        <div className="w-full max-w-md mx-auto mt-4 rounded-xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/60 animate-fade-in-up backdrop-blur-md">
            <h2 className="text-4xl font-bold tracking-tight text-primary mb-2">
              404{" "}
              <Sparkles className="w-6 h-6 text-primary inline animate-pulse ml-1" />
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-4">
              The page you’re looking for isn’t available. Try checking the URL or head back home.
            </p>
            <Button asChild aria-label="Go to homepage" size="lg" className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
