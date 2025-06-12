import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Help() {
  return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center bg-inherit p-6">
        <h1 className="mb-6 text-3xl font-bold">Help & Support</h1>
        <p className="mb-6 text-center text-lg">
          Welcome to the Help page! Here you’ll find resources and guidance to
          make the most of your experience.
        </p>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4 shadow">
            <h2 className="mb-2 text-xl font-semibold">Profile & Settings</h2>
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

          <div className="rounded-lg border p-4 shadow">
            <h2 className="mb-2 text-xl font-semibold">
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

          <div className="rounded-lg border p-4 shadow">
            <h2 className="mb-2 text-xl font-semibold">AI Features</h2>
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
          <h2 className="mb-4 text-2xl font-bold">Need More Help?</h2>
          <p className="mb-4 text-lg">
            Reach out to our support team, or visit our community forum to get
            answers.
          </p>
          <Link href={"/contact"}>
            <Button variant={"default"}>Contact Support</Button>
          </Link>
        </div>
      </main>
  );
}

export default Help;
