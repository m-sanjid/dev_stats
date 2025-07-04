"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export function OAuthButton({
  provider,
  children,
}: {
  provider: "google" | "github";
  children: React.ReactNode;
}) {
  const handleSignIn = () => signIn(provider, { callbackUrl: "/dashboard" });

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-2"
      onClick={handleSignIn}
      aria-label={`Sign in with ${provider}`}
    >
      {children}
    </Button>
  );
}
