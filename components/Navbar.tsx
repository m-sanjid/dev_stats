"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import SigninButton from "./Buttons/SigninButton";

const navItems = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Dashboard", href: "/dashboard" },
  { id: 3, name: "Pricing", href: "#pricing" },
  { id: 4, name: "About", href: "#about" },
];

const commonNavItems = [
  { id: 1, name: "Pricing", href: "#pricing" },
  { id: 2, name: "Try Demo", href: "/demo" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="flex justify-between items-center p-6 shadow-md bg-white">
      {/* Logo */}
      <div className="text-xl font-bold">Logo</div>

      {/* Navigation Links */}
      <div className="flex gap-4 items-center">
        <ul className="flex gap-4">
          {(isAuthenticated ? navItems : commonNavItems).map((item) => (
            <li key={item.id}>
              <Button variant="ghost" asChild>
                <Link href={item.href}>{item.name}</Link>
              </Button>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <img
              src={session.user?.image || "/default-avatar.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border"
            />
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        ) : (
          <SigninButton />
        )}
      </div>
    </div>
  );
}
