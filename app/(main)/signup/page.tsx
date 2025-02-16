import { SignUpForm } from "@/components/SignUpForm";
import React from "react";

function Signup() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 dark:bg-black/90 bg-white/90"
        style={{
          backgroundImage: `
            linear-gradient(transparent 7px, rgb(151,163,173,0.5) 7px, rgb(151,163,173,0.5) 3px, transparent 8px),
            linear-gradient(90deg, transparent 7px, rgb(151,163,173,0.5) 7px, rgb(151,163,173,0.5) 3px, transparent 8px)
          `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="absolute inset-0 backdrop-blur-[1px] bg-white/10 dark:bg-black/10"
        aria-hidden="true"
      />
      <div className="relative h-full w-full flex items-center justify-center">
        <SignUpForm />
      </div>
    </div>
  );
}

export default Signup;
