import SectionHeader from "@/components/SectionHeader";
import React from "react";

const privacyItems = [
  {
    title: "Information We Collect",
    desc: "We collect information you provide, like your name, email, and usage data to improve your experience.",
  },
  {
    title: "How We Use Your Information",
    desc: "We use your data to personalize your experience, provide customer support, and improve our services.",
  },
  {
    title: "Data Security",
    desc: "We take security seriously and use industry-standard measures to protect your data.",
  },
  {
    title: "Your Rights",
    desc: "You can access, update, or delete your data anytime through your account settings.",
  },
  {
    title: "Contact Us",
    desc: "If you have any questions, feel free to contact us at support@devstats.com.",
  },
];

function Privacy() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center bg-background px-6 py-20">
      <SectionHeader
        title="Privacy Policy"
        subtitle="Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information."
      />

      <div className="space-y-6">
        {privacyItems.map((item, index) => (
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

export default Privacy;
