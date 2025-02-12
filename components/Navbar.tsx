"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  Activity,
  Code,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Home,
  FileText,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import SignoutButton from "./Buttons/SignoutButton";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pro",
    href: "/pricing",
    icon: GitFork,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const outNavItems = [
  { title: "Pricing", href: "#pricing" },
  { title: "Try Demo", href: "/demo" },
  { title: "Contact", href: "/contact" },
  { title: "About Us", href: "/about" },
  { title: "Help", href: "/help" },
  { title: "Blog", href: "/blog" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthenticated = !!session;
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const currentTheme =
      localStorage.getItem("theme") ||
      (root.classList.contains("dark") ? "dark" : "light");
    setIsDarkMode(currentTheme === "dark");
    root.classList.toggle("dark", currentTheme === "dark");
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-14 items-center">
          <div className="flex flex-1 items-center justify-between">
            {/* Minimal content for SSR */}
            <div className="flex items-center gap-6 md:gap-8">
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DevStats
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const toggleTheme = () => {
    if (isDarkMode !== undefined) {
      const newTheme = isDarkMode ? "light" : "dark";
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle("dark", !isDarkMode);
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between px-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DevStats
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <img
                      src={session.user?.image || "/default-avatar.png"}
                      alt="Avatar"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="hidden md:inline-block">
                      {session.user?.name}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex justify-between">
                <div className="hidden md:flex space-x-2">
                  {outNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <Link href={item.href}>{item.title}</Link>
                      </Button>
                    );
                  })}
                  <SignoutButton />
                </div>
              </div>
            )}

            {/* Theme Toggle on the right side */}
            {isDarkMode !== undefined && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
