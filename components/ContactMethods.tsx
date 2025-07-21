"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { contactMethods } from "@/constant/contact";
import BorderDiv from "./BorderDiv";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const ContactMethods = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mb-8 px-4">
      <BorderDiv>
        <div
          onMouseLeave={() => setHovered(null)}
          className="overflow-hidden rounded-2xl border bg-primary/5 shadow-sm backdrop-blur-md"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className={cn(
                  "border-b",
                  index === contactMethods.length - 1 && "border-b-0",
                )}
                onMouseEnter={() => setHovered(index)}
              >
                <div className="flex cursor-pointer items-center px-4 py-4 transition-colors">
                  <div
                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${method.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: method.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{method.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {method.subtitle}
                        </p>
                      </div>
                      {hovered === index && (
                        <motion.div
                          layoutId="contactMethod"
                          className="flex items-center gap-2"
                        >
                          <span
                            className="rounded-full px-2 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${method.color}10`,
                              color: method.color,
                            }}
                          >
                            {method.badge}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                {index < contactMethods.length - 1 && (
                  <div className="ml-14 h-px"></div>
                )}
              </div>
            );
          })}
        </div>
      </BorderDiv>
    </div>
  );
};

export default ContactMethods;
