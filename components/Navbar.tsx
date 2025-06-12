"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  FileText,
  Settings,
  Menu,
  Keyboard,
  Search,
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

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Pro", href: "/pricing", icon: GitFork },
  { title: "Settings", href: "/settings", icon: Settings },
];

const outNavItems = [
  { title: "Pricing", href: "/pricing" },
  { title: "Preview", href: "/preview" },
  { title: "Contact", href: "/contact" },
  { title: "About Us", href: "/about" },
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
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-lg"
          : "bg-background/50 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
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

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex">
          {isAuthenticated ? (
            <>
              {navItems.map(({ title, href, icon: Icon }) => (
                <Button
                  key={href}
                  variant={pathname === href ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 transition-all duration-200",
                    pathname === href
                      ? "bg-secondary/80 text-secondary-foreground"
                      : "hover:bg-secondary/50",
                  )}
                  asChild
                >
                  <Link href={href}>
                    <Icon className="h-4 w-4" /> {title}
                  </Link>
                </Button>
              ))}
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
            </>
          ) : (
            outNavItems.map(({ title, href }) => (
              <Button
                key={href}
                variant={pathname === href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  pathname === href
                    ? "bg-secondary/80 text-secondary-foreground"
                    : "hover:bg-secondary/50",
                )}
                asChild
              >
                <Link href={href}>{title}</Link>
              </Button>
            ))
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {currentPlan === "pro" && (
                <div className="hidden items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-500 md:flex">
                  <GitFork className="h-3 w-3" />
                  <span>Pro</span>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-2 py-1.5 hover:bg-secondary/50"
                  >
                    <Image
                      width={24}
                      height={24}
                      src={session.user?.image || "/default-avatar.png"}
                      alt="Avatar"
                      className="h-6 w-6 rounded-full ring-2 ring-border"
                    />
                    <span className="hidden text-sm font-medium md:inline-block">
                      {session.user?.name}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                    <Link href="/settings" className="flex items-center gap-2">
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
            <DropdownMenuContent align="end" className="w-56">
              {isAuthenticated
                ? navItems.map(({ title, href, icon: Icon }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" /> {title}
                      </Link>
                    </DropdownMenuItem>
                  ))
                : outNavItems.map(({ title, href }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href}>{title}</Link>
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
