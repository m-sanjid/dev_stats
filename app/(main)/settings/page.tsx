"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);
  const { data: session } = useSession();

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 h-18">
          <TabsTrigger value="profile" className="py-4">
            Profile Settings
          </TabsTrigger>
          <TabsTrigger value="subscription" className="py-4">
            Subscription
          </TabsTrigger>
          <TabsTrigger value="preferences" className="py-4">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="py-4">
            Security & Privacy
          </TabsTrigger>
          <TabsTrigger value="billing" className="py-4">
            Billing & Payment
          </TabsTrigger>
          <TabsTrigger value="integrations" className="py-4">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="ai" className="py-4">
            AI Features
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className=" max-w-3xl">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Input
                placeholder="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
              />
              <Button>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Management */}
        <TabsContent value="subscription">
          <Card className=" max-w-3xl">
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
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card className=" max-w-3xl">
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
        </TabsContent>

        {/* Security & Privacy */}
        <TabsContent value="security">
          <Card className=" max-w-3xl">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Change Password</Button>
              <Button className="ml-4">Two-Factor Authentication</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Payment */}
        <TabsContent value="billing">
          <Card className=" max-w-3xl">
            <CardHeader>
              <CardTitle>Billing & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>View Invoices</Button>
              <Button className="ml-4">Update Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card className=" max-w-3xl">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Connect GitHub</Button>
              <Button className="ml-4">Connect Stripe</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Features */}
        <TabsContent value="ai">
          <Card className=" max-w-3xl">
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Enable AI-Powered Summaries</Button>
              <Button className="ml-4">Customize AI Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
