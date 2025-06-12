import Link from "next/link";
import React from "react";

const Logo = (isAuthenticated: boolean) => {
  return (
    <Link
      href={`${isAuthenticated ? "/home" : "/"}`}
      className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent"
    >
      DevStats
    </Link>
  );
};

export default Logo;
