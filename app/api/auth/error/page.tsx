"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    console.error("Authentication error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-4">
          {error === "Configuration" && "Server configuration error"}
          {error === "AccessDenied" && "Authorization denied"}
          {error === "Verification" && "Token verification failed"}
          {!error && "Unknown authentication error"}
        </p>
        <a
          href="/login"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}
