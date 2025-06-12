import { motion } from "motion/react";
import React from "react";

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="mb-16 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-3xl font-bold md:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.3, duration: 0.3 }}
        viewport={{ once: true }}
        className="mt-3 text-muted-foreground"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default SectionHeader;
