"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SigninButton() {
  const { data: session, status } = useSession();
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
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
      aria-label={isAuthenticated ? "Sign out" : "Sign in"}
    >
      {isAuthenticated ? "Log Out" : "Log In"}
    </Button>
  );
}
