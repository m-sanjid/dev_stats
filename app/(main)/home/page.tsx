"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Layout, FolderPlus, PlayCircle, Lock } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold py-16 tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to Your
                <span className="text-purple-600 dark:text-purple-400">
                  {" "}
                  Dashboard
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] pb-8 text-slate-600 dark:text-slate-400 md:text-xl">
                Manage your portfolios, track performance, and explore new
                opportunities all in one place.
              </p>
            </div>

            {isAuthenticated ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full max-w-5xl">
                <Card className="transform transition-all hover:scale-105">
                  <CardHeader>
                    <Layout className="h-8 w-8 text-purple-600" />
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>
                      View your portfolio overview and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="transform transition-all hover:scale-105">
                  <CardHeader>
                    <FolderPlus className="h-8 w-8 text-purple-600" />
                    <CardTitle>Create Portfolio</CardTitle>
                    <CardDescription>
                      Start building your investment portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/profile/${session.user.username || session.user.id}`}
                    >
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Create Portfolio
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="transform transition-all hover:scale-105">
                  <CardHeader>
                    <PlayCircle className="h-8 w-8 text-purple-600" />
                    <CardTitle>Try Demo</CardTitle>
                    <CardDescription>
                      Explore features with sample data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/preview">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Launch Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="w-full max-w-md">
                <CardHeader>
                  <Lock className="h-8 w-8 text-slate-400 mx-auto" />
                  <CardTitle>Access Required</CardTitle>
                  <CardDescription>
                    Please sign in to access your personalized dashboard and
                    features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
