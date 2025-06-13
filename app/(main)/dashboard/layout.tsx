"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <PageWrapper>
      <div className="flex min-h-screen bg-background">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1">{children}</div>
      </div>
    </PageWrapper>
  );
}
