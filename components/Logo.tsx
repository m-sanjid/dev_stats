import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import React from "react";

const Logo = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <Link
      href={`${isAuthenticated ? "/home" : "/"}`}
      className="flex items-center gap-2"
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 p-[1px]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-50 blur-sm" />
        <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-background">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-lg font-bold text-transparent">
            D
          </span>
        </div>
      </div>
      <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
        DevStats
      </span>
    </Link>
  );
};

export default Logo;
