"use client";
import Image from "next/image";
import DeveloperDashboard from "./Github/Dashboard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Macbook from "./Macbook";

function Dashboard() {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Live Dashboard Preview
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Get real-time insights into your development activity
        </p>
      </div>
      <div className="mt-5">
        <Macbook />
      </div>
    </section>
  );
}

export default Dashboard;
