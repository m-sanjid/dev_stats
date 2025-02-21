"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/PageWrapper";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={cn(
            "flex min-h-screen flex-col",
            isCollapsed ? "md:pl-16" : "md:pl-64",
            "transition-all duration-300",
          )}
        >
          {children}
        </div>
      </div>
      <Toaster />
    </PageWrapper>
  );
}
