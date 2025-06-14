import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import React from "react";

const Logo = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <Link
      href={`${isAuthenticated ? "/home" : "/"}`}
      className="flex items-center gap-2 rounded-2xl border p-2 bg-primary/5 backdrop-blur-sm"
    >
      <div className="relative h-6 w-6 overflow-hidden rounded-lg border p-[1px] flex items-center justify-center bg-black dark:bg-white text-primary-foreground">
          <span className="text-lg font-bold">
            D
          </span>
      </div>
          <span className="text-xs tracking-tighter">DevStats</span>
    </Link>
  );
};

export default Logo;
