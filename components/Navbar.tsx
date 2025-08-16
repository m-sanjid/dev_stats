"use client";

import { useSession, signOut } from "next-auth/react";
import { Link } from "next-view-transitions";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  FileText,
  Settings,
  Menu,
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
import Image from "next/image";
import { CommandMenu } from "./CommandPalette";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { motion } from "motion/react";

const navItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Pro", href: "/pricing" },
  { title: "Settings", href: "/settings" },
];

const outNavItems = [
  { title: "Pricing", href: "/pricing" },
  { title: "Preview", href: "/preview" },
  { title: "Contact", href: "/contact" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthenticated = !!session;
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentPlan = session?.user?.subscription;

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const currentTheme =
      localStorage.getItem("theme") ||
      (root.classList.contains("dark") ? "dark" : "light");
    setIsDarkMode(currentTheme === "dark");
    root.classList.toggle("dark", currentTheme === "dark");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur" />
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
    <nav
      className={cn(
        "duration-400 sticky z-50 w-full text-sm transition-all ease-in-out",
        isScrolled
          ? "top-0 mx-auto border backdrop-blur-md md:top-2 md:max-w-5xl md:rounded-3xl md:bg-white/40 dark:md:bg-black/40 md:p-2"
          : "top-0 mx-auto max-w-6xl md:px-4",
      )}
    >
      <div className={isScrolled ? "md:rounded-2xl md:border md:px-2" : ""}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
          <Logo />
          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {(isAuthenticated ? navItems : outNavItems).map(
              ({ title, href }) => (
                <div key={href} className="relative">
                  <Link className={cn("relative z-10 p-2",pathname !== href ?"text-muted-foreground font-normal":"font-medium text-primary")} href={href}>
                    {title}
                  </Link>
                  {pathname === href && (
                    <motion.div
                      layoutId="active-link-id"
                      className="absolute -inset-2 rounded-2xl border bg-primary/5 p-1 backdrop-blur-sm"
                    >
                      <motion.div className="h-full w-full rounded-xl border bg-white p-1 dark:bg-black" />
                    </motion.div>
                  )}
                </div>
              ),
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-secondary/50"
                asChild
              >
                <Link
                  href={`/profile/${session.user.username || session.user.id}`}
                >
                  <FileText className="h-4 w-4" />
                  AI Portfolio
                </Link>
              </Button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {currentPlan === "pro" && (
                  <div className="hidden items-center rounded-2xl border bg-primary/5 p-1 text-xs font-medium backdrop-blur-sm md:flex">
                    <span className="animate-pulse rounded-xl border bg-white px-2 py-0.5 text-xs font-medium uppercase tracking-tighter dark:bg-black">
                      Pro
                    </span>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 rounded-[14px] border-2 bg-primary/5 p-1 backdrop-blur-sm">
                      <Image
                        width={24}
                        height={24}
                        src={session.user?.image || "/default-avatar.png"}
                        alt="Avatar"
                        className="h-6 w-6 rounded-full ring-2 ring-border"
                      />
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${session.user.username || session.user.id}`}
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-red-500 focus:text-red-500"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <SignoutButton />
            )}
            <CommandMenu />
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full border border-border/50 bg-background/50 p-2 hover:bg-secondary/50"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-border/50 bg-background/50 p-2 hover:bg-secondary/50 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-6 w-56">
                {(isAuthenticated ? navItems : outNavItems).map(
                  ({ title, href }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} className="flex items-center gap-2">
                        {title}
                      </Link>
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
