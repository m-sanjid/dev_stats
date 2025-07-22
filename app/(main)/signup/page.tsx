import { SignUpForm } from "@/components/SignUpForm";
import React from "react";

function Signup() {
  return (
    <div className="w-full">
      <div
        className="fixed inset-0 bg-white/90 dark:bg-black/90"
        style={{
          backgroundImage: `
      linear-gradient(transparent 7px, rgb(151,163,173,0.5) 7px, rgb(151,163,173,0.5) 1px, transparent 8px),
      linear-gradient(90deg, transparent 7px,rgb(151,163,173,0.5)  7px, rgb(151,163,173,0.5) 1px, transparent 8px)
    `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="fixed inset-0 bg-white/10 backdrop-blur-[1px] dark:bg-black/10"
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full items-center justify-center">
        <SignUpForm />
      </div>
    </div>
  );
}

export default Signup;
