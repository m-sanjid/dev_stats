"use client";
import Dashboard from "@/components/Github/Dashboard";
import { Footer } from "@/components/Footer";
import React from "react";
import PreviewImg2 from "@/components/Github/PreviewImg2";

function Preview() {
  return (
    <div className="max-w-4xl mx-auto">
      <main>
        <Dashboard />
        <div className="scale-125">
          <PreviewImg2 />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Preview;
