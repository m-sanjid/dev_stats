"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignoutButton() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut({ callbackUrl: "/" });
    } else {
      signIn();
    }
  };

  return (
    <div className="rounded-2xl border border-muted bg-primary/5 p-1 backdrop-blur-md">
      <Button
        onClick={handleAuthAction}
        className="rounded-xl border border-muted px-4 py-1 text-xs sm:text-sm md:px-8 md:text-base"
      >
        {isAuthenticated ? "Log Out" : "Log In"}
      </Button>
    </div>
  );
}
