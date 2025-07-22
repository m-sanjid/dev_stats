"use client";

import { motion } from "motion/react";
import React from "react";
import BorderDiv from "./BorderDiv";

const SectionHeader = ({
  title,
  subtitle,
  tag,
}: {
  title: string;
  subtitle?: string;
  tag?: string;
}) => {
  return (
    <div className="mb-16 flex flex-col items-center justify-center text-center">
      {tag && (
        <BorderDiv className="my-4 w-fit">
          <motion.div className="rounded-2xl bg-primary/10 px-2 py-1 text-xs">
            {tag}
          </motion.div>
        </BorderDiv>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-2xl font-bold md:text-3xl lg:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 0.3 }}
          viewport={{ once: true }}
          className="mt-3 text-sm text-muted-foreground md:text-base"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
