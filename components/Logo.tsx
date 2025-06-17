import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import React from "react";

const Logo = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <Link
      href={`${isAuthenticated ? "/home" : "/"}`}
      className="flex items-center gap-2 rounded-2xl border bg-primary/5 p-2 backdrop-blur-sm"
    >
      <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg border bg-black p-[1px] text-primary-foreground dark:bg-white">
        <span className="text-lg font-bold">D</span>
      </div>
      <span className="text-xs tracking-tighter">DevStats</span>
    </Link>
  );
};

export default Logo;
