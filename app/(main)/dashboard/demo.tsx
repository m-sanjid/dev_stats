"use client";

import Dashboard from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { PageWrapper } from "@/components/PageWrapper";

export default function DemoPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <h1 className="text-center text-4xl font-bold my-10">Demo Dashboard</h1>
        <Dashboard />
        <Footer />
      </div>
    </PageWrapper>
  );
} 