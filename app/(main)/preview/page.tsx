"use client";
import Dashboard from "@/components/Github/Dashboard";
import React from "react";
import PreviewImg2 from "@/components/Github/PreviewImg2";

function Preview() {
  return (
    <div className="mx-auto max-w-4xl">
      <main>
        <Dashboard />
        <div className="scale-125">
          <PreviewImg2 />
        </div>
      </main>
    </div>
  );
}

export default Preview;
