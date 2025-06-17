"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import LoginCTA from "@/components/LoginCTA";
import BorderDiv from "@/components/BorderDiv";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme =
      localStorage.getItem("theme") ||
      (root.classList.contains("dark") ? "dark" : "light");
    setIsDarkMode(currentTheme === "dark");
    root.classList.toggle("dark", currentTheme === "dark");
  }, []);

  const toggleTheme = () => {
    if (isDarkMode !== undefined) {
      const newTheme = isDarkMode ? "light" : "dark";
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle("dark", !isDarkMode);
      localStorage.setItem("theme", newTheme);
    }
  };

  const isPro = session?.user?.subscription === "pro";

  if (!isAuthenticated) {
    return <LoginCTA />;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="h-18 mb-6">
          <TabsTrigger value="subscription" className="py-4">
            Subscription
          </TabsTrigger>
          <TabsTrigger value="preferences" className="py-4">
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Subscription Management */}
        <TabsContent value="subscription" className="min-h-[60vh]">
          <BorderDiv>
            <Card className="h-full w-full rounded-2xl">
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  Current Plan: <strong>{isPro ? "Pro" : "Free"}</strong>
                </div>
                <Link href={"/pricing"}>
                  <Button className="mt-4">Manage Subscription</Button>
                </Link>
              </CardContent>
            </Card>
          </BorderDiv>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="min-h-[60vh]">
          <BorderDiv>
            <Card className="h-full w-full rounded-2xl">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={toggleTheme}>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </Button>
                <Button className="ml-4">Change Language</Button>
              </CardContent>
            </Card>
          </BorderDiv>
        </TabsContent>
      </Tabs>
    </div>
  );
}
