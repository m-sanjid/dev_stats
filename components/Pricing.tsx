import { Check } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const Price = [
  {
    title: "Basic",
    description: "Perfect for getting started",
    price: "$0",
    features: ["Connect GitHub", "Basic Analytics", "Standard Portfolio"],
  },
  {
    title: "Pro",
    description: "For serious Developers",
    price: "$10",
    features: [
      "Connect Unlimited Platforms",
      "Advanced Analytics",
      "Custom Portfolio",
      "Priority Support",
    ],
  },
  {
    title: "Team",
    description: "Best for Teams and Organizations",
    price: "$50",
    features: [
      "All Pro features",
      "Team Management",
      "Collaboration Tools",
      "Api key",
    ],
  },
];

function Pricing() {
  return (
    <section className="px-4 py-10 my-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-20">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Price.map((p) => (
            <div
              key={p.title}
              className={`shadow-xl p-6 grid-cols-1 mx-4 group rounded-lg border border-slate-200 ${p.title == "Pro" ? "scale-110" : ""} hover:shadow-2xl hover:shadow-blue-400 hover:scale-110`}
            >
              <h1 className="font-semibold text-3xl pt-2 my-1">{p.title}</h1>
              <p className="py-2 mb-2 text-slate-500">{p.description}</p>
              <div className="lg:text-5xl text-3xl p-2 font-thin">
                <span className="font-bold p-1">{p.price}</span>
                /month
              </div>
              <ul className="">
                {p.features.map((i) => (
                  <li key={i} className="p-2">
                    {" "}
                    <span className="flex gap-3">
                      <Check
                        stroke="green"
                        size="24px"
                        strokeWidth="1.5px"
                        display={""}
                      />
                      {i}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="p-2 mb-5">
                <Button
                  className={` w-full ${p.title === "Basic" ? "mt-12" : "mt-2"}`}
                  variant={p.title === "Pro" ? "default" : "outline"}
                >
                  {p.title === "Basic" ? "Get Started" : "Subscribe"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
