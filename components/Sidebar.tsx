"use client";

import { Link } from "next-view-transitions";
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
          <Button
            variant="ghost"
            className="fixed left-4 top-16 z-40 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetTitle className="hidden">Dev Stats</SheetTitle>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname ?? ""} isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "sticky left-0 top-0 z-40 hidden h-screen flex-col border-r pt-14 transition-all duration-300 md:flex",
          isCollapsed ? "w-16" : "w-[16rem]",
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
          <GitFork className="mx-auto h-6 w-6" />
        )}
      </div>
      <ScrollArea className="flex-1 space-y-1 p-3">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start gap-2",
                pathname === link.href && "bg-primary/5 border-2 rounded-2xl",
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
