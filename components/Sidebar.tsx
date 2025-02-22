"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  GitFork,
  Activity,
  PieChart,
  BarChart,
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpenText,
  File,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const sidebarLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Repositories", href: "/dashboard/repos", icon: GitFork },
  { title: "Activity", href: "/dashboard/activity", icon: Activity },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { title: "Languages", href: "/dashboard/languages", icon: PieChart },
  { title: "AI Readme", href: "/dashboard/readme", icon: BookOpenText },
  { title: "Code review", href: "/dashboard/code-review", icon: File },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname ?? ""} isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-screen fixed left-0 pt-14 top-0 z-40 flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent pathname={pathname ?? ""} isCollapsed={isCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-[105px] h-8 w-8 rounded-full border bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </>
  );
}

function SidebarContent({
  pathname,
  isCollapsed,
}: {
  pathname: string;
  isCollapsed: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <GitFork className="h-6 w-6" />
            <span>Dev Stats</span>
          </Link>
        ) : (
          <GitFork className="h-6 w-6 mx-auto" />
        )}
      </div>
      <ScrollArea className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start gap-2",
                pathname === link.href && "bg-accent",
              )}
            >
              <Link href={link.href}>
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{link.title}</span>}
              </Link>
            </Button>
          );
        })}
      </ScrollArea>
    </div>
  );
}
