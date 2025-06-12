"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignoutButton() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut({ callbackUrl: "/" }); // Redirects to homepage after sign out
    } else {
      signIn();
    }
  };

  return (
    <Button
      onClick={handleAuthAction}
      className="rounded-md bg-purple-600 px-8 py-2 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
    >
      {isAuthenticated ? "Log Out" : "Log In"}
    </Button>
  );
}
