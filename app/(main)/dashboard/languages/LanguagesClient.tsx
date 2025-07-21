"use client";

import { useEffect, useState } from "react";
import { getGithubMetrics } from "@/actions/get-github-metrics";
import { LanguageAnalytics } from "@/components/LanguageAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GitHubMetrics {
  language: Record<string, number>;
}

export default function LanguagesClient() {
  const [data, setData] = useState<GitHubMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await getGithubMetrics();
        if (metrics) {
          setData(metrics);
        } else {
          setError(
            "Could not retrieve language data. Please ensure your GitHub account is connected.",
          );
        }
      } catch (e) {
        console.error(e);
        setError(
          "An unexpected error occurred while fetching your language data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex items-center justify-center">
            <Skeleton className="h-80 w-80 rounded-full" />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return <LanguageAnalytics language={data?.language ?? {}} />;
}
