"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChevronRight,
  Clock,
  Code,
  GitCommit,
  Github,
  Folder,
} from "lucide-react";
import BorderDiv from "@/components/BorderDiv";
import SectionHeader from "../SectionHeader";

const data = [
  { name: "Mon", value: 3 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 4 },
  { name: "Thu", value: 5 },
  { name: "Fri", value: 1 },
  { name: "Sat", value: 6 },
  { name: "Sun", value: 3 },
];

const repos = [
  { value: "j.a.r.v.i.s", label: 32, lines: 58525, language: "TypeScript" },
  { value: "e.d.i.t.h", label: 54, lines: 85593, language: "Rust" },
  { value: "f.r.i.d.a.y", label: 84, lines: 8572, language: "Go" },
];

const languages = [
  { id: "TypeScript", percentage: 28, color: "bg-blue-500" },
  { id: "Rust", percentage: 22, color: "bg-orange-500" },
  { id: "JavaScript", percentage: 18, color: "bg-yellow-500" },
  { id: "Go", percentage: 15, color: "bg-cyan-500" },
  { id: "Python", percentage: 10, color: "bg-green-500" },
  { id: "Other", percentage: 7, color: "bg-neutral-400" },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <BorderDiv>
    <div className="group relative h-full w-full overflow-hidden rounded-2xl border bg-white p-6 dark:bg-black">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="rounded-full bg-primary p-3">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 transition-transform duration-300 group-hover:scale-110" />
    </div>
  </BorderDiv>
);

export default function AppleDeveloperDashboard() {
  const [activeWeek, setActiveWeek] = useState("current");

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <SectionHeader
          title="Developer Dashboard"
          subtitle="Track your coding activity and project insights"
        />

        {/* Profile Section */}
        <BorderDiv className="mb-8">
          <div className="overflow-hidden rounded-2xl border bg-white dark:bg-black">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-4 ring-white/50 dark:ring-neutral-700/50">
                      <AvatarImage
                        src="https://w7.pngwing.com/pngs/923/882/png-transparent-iron-man-helmet-illustration-iron-man-drawing-ironman-marvel-avengers-assemble-heroes-photography-thumbnail.png"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 backdrop-blur-sm">
                        TS
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1 ring-2 ring-white dark:ring-neutral-800">
                      <Github className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      tony_stark
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Full Stack Developer
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-2 rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/30">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span className="text-sm text-green-700 dark:text-green-400">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center space-x-2 rounded-full bg-primary px-6 py-3 text-primary-foreground">
                  <Folder className="h-4 w-4" />
                  <span className="font-medium">View Repositories</span>
                </button>
              </div>
            </div>
          </div>
        </BorderDiv>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard title="Total Commits" value={1096} icon={GitCommit} />
          <StatCard title="Lines of Code" value={2397848} icon={Code} />
          <StatCard title="Coding Hours" value="10,432 hrs" icon={Clock} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Commit Activity Chart */}
          <BorderDiv className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border bg-white dark:bg-black">
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    Weekly Activity
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveWeek("current")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        activeWeek === "current"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => setActiveWeek("previous")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        activeWeek === "previous"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                      }`}
                    >
                      Last Week
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis
                        dataKey="name"
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={true}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{
                          fill: "#3B82F6",
                          stroke: "#fff",
                          strokeWidth: 2,
                          r: 6,
                        }}
                        activeDot={{
                          r: 8,
                          fill: "#3B82F6",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </BorderDiv>
          {/* Languages Used */}
          <BorderDiv>
            <div className="h-full overflow-hidden rounded-2xl border bg-white dark:bg-black">
              <div className="p-8">
                <h3 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
                  Languages
                </h3>
                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="group flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-3 w-3 rounded-full ${lang.color} transition-transform duration-200 group-hover:scale-110`}
                        />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {lang.id}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BorderDiv>
        </div>

        {/* Recent Repositories */}
        <BorderDiv className="mt-8">
          <div className="overflow-hidden rounded-2xl border bg-white dark:bg-black">
            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Recent Repositories
                </h3>
                <button className="flex items-center space-x-2 text-blue-500 transition-colors hover:text-blue-600">
                  <span className="text-sm font-medium">View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {repos.map((repo, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-2xl bg-neutral-50/50 p-4 transition-all duration-200 hover:bg-neutral-100/50 hover:shadow-sm dark:bg-neutral-700/30 dark:hover:bg-neutral-700/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-lg bg-primary p-2 shadow-sm">
                        <Folder className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          {repo.value}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {repo.language} • {repo.label} commits
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {repo.lines.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        lines changed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BorderDiv>
      </div>
    </div>
  );
}
