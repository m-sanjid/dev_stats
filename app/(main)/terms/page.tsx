import SectionHeader from "@/components/SectionHeader";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DevStats",
  description: "Read the terms of service for using DevStats. Understand your rights and responsibilities as a user.",
  openGraph: {
    title: "Terms of Service | DevStats",
    description: "Read the terms of service for using DevStats. Understand your rights and responsibilities as a user.",
    url: "https://devstats.com/terms",
    siteName: "DevStats",
    type: "website",
  },
};

const termsItems = [
  {
    title: "1. Acceptance of Terms",
    desc: "By accessing or using our application, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our app.",
  },
  {
    title: "2. User Responsibilities",
    desc: "Users must not misuse the app, engage in illegal activities, or attempt to compromise the security and integrity of the platform.",
  },
  {
    title: "3. Subscription & Payments",
    desc: "Subscription details, billing cycles, and payment policies are outlined in our billing section. Users can upgrade, downgrade, or cancel their plans at any time.",
  },
  {
    title: "4. Intellectual Property",
    desc: "All content, features, and intellectual property of the app are owned by us or our licensors. Unauthorized use of the content is strictly prohibited.",
  },
  {
    title: "5. Limitation of Liability",
    desc: "We are not liable for any indirect, incidental, or consequential damages arising from your use of the app. Use the app at your own risk.",
  },
  {
    title: "6. Updates to Terms",
    desc: "We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.",
  },
  {
    title: "7. Contact Information",
    desc: "If you have any questions or concerns about these terms, please contact us at support@example.com.",
  },
];

function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-background px-6 py-20">
      <SectionHeader
        title="Terms of Service"
        subtitle="By accessing or using our application, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our app."
      />

      <div className="space-y-6">
        {termsItems.map((item, index) => (
          <section key={index}>
            <h2 className="mb-2 text-lg font-semibold md:text-2xl">
              {item.title}
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              {item.desc}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}

export default TermsPage;
