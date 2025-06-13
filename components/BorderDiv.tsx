import React from "react";
import { cn } from "@/lib/utils";

const BorderDiv = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("rounded-3xl border-2 p-2 bg-primary/5 backdrop-blur-md", className)}>{children}</div>
  );
};

export default BorderDiv;
