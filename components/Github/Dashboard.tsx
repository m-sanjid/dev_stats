"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Book,
  Check,
  ChevronRight,
  Clock,
  Code,
  GitCommit,
  Github,
} from "lucide-react";
import { Button } from "../ui/button";
import { StatCard } from "../ui/stat-card";
import * as motion from "motion/react-client";

const data = [
  { name: "Mon", value: 3 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 4 },
  { name: "Thurs", value: 5 },
  { name: "Fri", value: 1 },
  { name: "Sat", value: 6 },
  { name: "Sun", value: 3 },
];

const repos = [
  { value: "j.a.r.v.i.s", label: 32, lines: 58525 },
  { value: "e.d.i.t.h", label: 54, lines: 85593 },
  { value: "f.r.i.d.a.y", label: 84, lines: 8572 },
];

const language = [
  { id: "C++", width: "w-[30px]", percentage: "10%" },
  { id: "rust", width: "w-[50px]", percentage: "20%" },
  { id: "java", width: "w-[30px]", percentage: "10%" },
  { id: "assembly", width: "w-[20px]", percentage: "5%" },
  { id: "typescript", width: "w-[50px]", percentage: "20%" },
  { id: "Go", width: "w-[30px]", percentage: "10%" },
  { id: "shell", width: "w-[20px]", percentage: "5%" },
  { id: "javascript", width: "w-[30px]", percentage: "10%" },
];

export default function DeveloperDashboard() {
  return (
    <motion.div
      className="mx-auto max-w-4xl p-8 dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-800"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <motion.div className="relative mx-auto max-w-[1200px]">
        {/* Main card */}
        <Card className="relative border-neutral-800 backdrop-blur-sm dark:bg-neutral-900/50">
          <CardHeader className="border-b border-neutral-800">
            <div className="mb-2 flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-lg font-semibold text-transparent">
                    Developer Dashboard
                  </CardTitle>
                  <p className="mt-2 text-sm text-neutral-400">
                    Real-time Data and Activities
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4 flex gap-3 p-4">
              <div className="flex items-center gap-3 rounded-md bg-green-100 p-2 text-green-600">
                <Check />
                GitHub Connected
              </div>
              <Button variant="outline" className="px-4 py-6">
                <Book stroke="purple" />
                Repositories
                <ChevronRight />
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {/* Profile Card - Spans 1 column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-700">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          className="contain-size"
                          src="https://w7.pngwing.com/pngs/923/882/png-transparent-iron-man-helmet-illustration-iron-man-drawing-ironman-marvel-avengers-assemble-heroes-photography-thumbnail.png"
                        />
                        <AvatarFallback>DP</AvatarFallback>
                      </Avatar>

                      <Github className="absolute -bottom-2 -right-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        tony_stark
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        GitHub Profile
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Cards - Span 3 columns */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
                <StatCard
                  title="Total Commits"
                  value={1096}
                  icon={GitCommit}
                  delay={0.1}
                />
                <StatCard
                  title="Lines Changed"
                  value={23978480}
                  icon={Code}
                  delay={0.2}
                />
                <StatCard
                  title="Coding Hours"
                  value={`10432 hrs`}
                  icon={Clock}
                  delay={0.3}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-8 p-6 pt-14">
            <div className="col-span-2">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="pb-4 text-2xl">
                      Commit Avtivity
                    </CardTitle>
                    <div className="flex justify-between">
                      <span className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white">
                        Previous Week
                      </span>

                      <span className="rounded-md bg-neutral-400 px-3 py-2 text-sm text-black dark:text-white">
                        Next Week
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-6 p-4 hover:shadow-lg">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                          <XAxis
                            dataKey="name"
                            stroke="#4B5563"
                            tick={{ fill: "#9CA3AF" }}
                          />
                          <YAxis stroke="#4B5563" tick={{ fill: "#9CA3AF" }} />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={{ fill: "#8B5CF6", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Languages Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {language.map((lang) => (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                          {lang.id}
                        </p>
                        <div
                          className={`bg-purple-400 ${lang.width} mt-2 h-2 dark:bg-purple-500`}
                        ></div>
                      </div>
                      <span className="text-xs text-neutral-800 dark:text-neutral-200">
                        {lang.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="relative mt-10 w-full border-neutral-800 backdrop-blur-sm dark:bg-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="border-b py-2 text-lg font-semibold">
              Recent Repositories
            </CardTitle>
            <div className="text-md flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View All
              <ChevronRight />
            </div>
          </CardHeader>
          <CardContent>
            {repos.map((repo) => (
              <div
                key={repo.value}
                className="flex items-center justify-between border-b px-4 py-2 last:border-b-0"
              >
                <span className="font-medium">{repo.value}</span>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">{repo.label} commits</p>
                  <p className="text-sm text-neutral-600">
                    {repo.lines} lines changed
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
