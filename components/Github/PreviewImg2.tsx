import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function PreviewImg2() {
  return (
    <div className="scale-75 mt-14">
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Repository Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Active Repositories</dt>
              <dd className="text-2xl font-bold">55</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Total Stars</dt>
              <dd className="text-2xl font-bold">323K</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Coding Hours</dt>
              <dd className="text-2xl font-bold">45263</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((repo) => (
            <Card key={repo.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{repo.name}</span>
                  <Badge variant="secondary">{repo.language}</Badge>
                </CardTitle>
                <CardDescription>
                  {repo.description || "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    ⭐ {repo.stars.toLocaleString()}
                  </span>
                  <span className="text-sm">
                    🔀 {repo.forks.toLocaleString()}
                  </span>
                  <span className="text-sm">📅 {repo.lastUpdated}</span>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  onClick={() => window.open(repo.url, "_blank")}
                  className="w-full"
                >
                  View Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PreviewImg2;

const metrics = [
  {
    name: "e.d.i.t.h",
    language: "c++",
    stars: "22K",
    forks: 5923,
    lastUpdated: "22/1/2025",
    url: "",
    description:"A powerful tool for ironman glasses",
  },
  {
    name: "mark-II",
    language: "c",
    stars: "283K",
    forks: 53425,
    lastUpdated: "22/2/2025",
    url: "",
    description:"A powerful upgrade to the mark-I",
  },
];
