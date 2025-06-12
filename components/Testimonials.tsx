import { Quote } from "lucide-react";
import React from "react";
import Marquee from "react-fast-marquee";
import { testimonials } from "@/constant/testimonials";
import SectionHeader from "./SectionHeader";

export default function Testimonials() {
  return (
    <section className="relative z-10 mx-auto min-h-[60vh] w-full bg-background/80 py-20">
      <SectionHeader
        title="Loved by Developers"
        subtitle="Thousands of devs use DevStats to impress recruiters and track growth."
      />
      <div className="mx-auto max-w-6xl rounded-3xl border-2 bg-white p-2 dark:bg-black">
        <Marquee
          pauseOnHover
          speed={40}
          className="grid rounded-2xl border-2 bg-white py-4 dark:bg-black"
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="mx-4 h-full w-[320px] cursor-pointer rounded-3xl border p-4 shadow-lg"
            >
              <div className="flex justify-between pb-4">
                <h4 className="font-semibold">{t.name}</h4>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.role}
                    <span className="block text-primary">{t.company}</span>
                  </p>
                </div>
              </div>
              <div className="h-ful mt-3 pb-4 text-sm text-muted-foreground">
                <Quote className="mb-2 h-4 w-4 text-primary" />
                {t.content}
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
