import React from "react";

import { BarChart, GithubIcon, Gitlab, Share2 } from "lucide-react";

const features = [
  {
    title: "Multi-Platform Integration",
    description:
      "Connect your GitHub, GitLab, Stack Overflow, and dev.to accounts to showcase all your contributions in one place.",
    icon: <GithubIcon className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Comprehensive Analytics",
    description:
      "Get detailed insights into your contributions, including commit history, pull requests, and more.",
    icon: <BarChart className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Custom Portfolios",
    description:
      "Create beautiful, customizable portfolios to highlight your best work and skills.",
    icon: <Share2 className="h-8 w-8 text-purple-500" />,
  },
  {
    title: "Continuous Sync",
    description:
      "Your profile stays up-to-date with real-time syncing across all connected platforms.",
    icon: <Gitlab className="h-8 w-8 text-orange-500" />,
  },
];

function Features() {
  return (
    <section className="px-4 py-10 my-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-20">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((p) => (
            <div
              key={p.title}
              className="shadow-xl p-6 mx-4 rounded-xl border border-slate-200 hover:shadow-2xl hover:shadow-blue-400 hover:scale-110"
            >
              <div className="flex items-center">
                {p.icon}
                <span className="font-semibold text-xl ml-2 px-2">
                  {p.title}
                </span>
              </div>

              <p className="py-2 mb-2 text-slate-500">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
