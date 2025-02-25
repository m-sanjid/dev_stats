import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Help() {
  return (
    <div>
      <main className="min-h-screen bg-inherit mx-auto max-w-5xl flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
        <p className="mb-6 text-lg text-center">
          Welcome to the Help page! Here you’ll find resources and guidance to
          make the most of your experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Profile & Settings</h2>
            <p>
              Learn how to manage your profile, change account details, and
              customize preferences.
            </p>
            <Link href={"/settings"}>
              <Button className="mt-4" variant={"outline"}>
                Go to Settings
              </Button>
            </Link>
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">
              Subscription & Billing
            </h2>
            <p>
              Understand your subscription, upgrade to Pro, or manage billing
              and payment methods.
            </p>
            <Link href={"/pricing"}>
              <Button className="mt-4" variant={"outline"}>
                Manage Subscription
              </Button>
            </Link>
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">AI Features</h2>
            <p>
              Explore how to use AI-powered features like code suggestions,
              summaries, and reports.
            </p>
            <Link href={"/home"}>
              <Button className="mt-4" variant={"outline"}>
                Explore AI Features
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="text-lg mb-4">
            Reach out to our support team, or visit our community forum to get
            answers.
          </p>
          <Link href={"/contact"}>
            <Button variant={"default"}>Contact Support</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Help;
