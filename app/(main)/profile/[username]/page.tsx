"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { fetchGitHubMetrics } from "@/lib/github";
import { generateBio } from "@/lib/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "@/components/Resume";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SocialShareDropdown from "@/components/SocialShare";
import EditableBio from "@/components/EditableBio";
import SnapshotCapture from "@/components/SnapShotCapture";

interface Repository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  commits: number;
  linesChanged: number;
  branches?: number;
}

interface GitHubMetrics {
  totalCommits: number;
  totalLines: number;
  totalCodingHours: number;
  filesChanged: number;
  repositories: Repository[];
  githubProfile: {
    username: string;
    avatarUrl: string;
  } | null;
  language: LanguageStats;
  weeklyCommits: Record<string, number>;
  dailyActivity: Record<number, number>;
}
interface LanguageStats {
  [key: string]: number;
}

function usePortfolioData(session: any, status: string) {
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null);
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (status === "loading") return;

      if (status !== "authenticated" || !session?.user?.id) {
        setError("Please sign in to view your portfolio.");
        setLoading(false);
        return;
      }
      if (!session?.user?.id) {
        setError("User session is incomplete.");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching GitHub data for: ${session.user.id}`);
        const rawMetrics = await fetchGitHubMetrics(session.user.id);

        if (!rawMetrics || typeof rawMetrics !== "object") {
          throw new Error("Invalid metrics data received");
        }

        setMetrics({
          totalCommits: rawMetrics.totalCommits ?? 0,
          totalLines: rawMetrics.totalLines ?? 0,
          totalCodingHours: rawMetrics.totalCodingHours ?? 0,
          filesChanged: rawMetrics.filesChanged ?? 0,
          repositories: rawMetrics.repositories ?? [],
          githubProfile: rawMetrics.githubProfile,
          language: rawMetrics.language ?? {},
          weeklyCommits: rawMetrics.weeklyCommits ?? {},
          dailyActivity: rawMetrics.dailyActivity ?? {},
        });

        const generatedBio = await generateBio(session.user.id, rawMetrics);
        setBio(generatedBio);
      } catch (err) {
        console.error("Portfolio data fetch failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load portfolio data",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session, status]);
  return { metrics, bio, loading, error };
}

// Loading skeleton component for better UX
function PortfolioSkeleton() {
  return (
    <div className="space-y-4 mx-auto max-w-4xl">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

// Language card component
function LanguageStats({ languages }: { languages: LanguageStats }) {
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const total = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <ul className="space-y-2">
      {sortedLanguages.map(([language, value]) => (
        <li key={language} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Badge variant="outline">{language}</Badge>
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((value / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function PortfolioPage() {
  const { data: session, status } = useSession();
  const { metrics, bio, loading, error } = usePortfolioData(session, status);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [userBio, setUserBio] = useState<string>(bio); // Store updated bio
  const ref = useRef(null);

  const handleBioSave = (newBio: string) => {
    setUserBio(newBio);
    // TODO: Save the bio
  };
  // useEffect(() => {
  //   async function captureSnapshot() {
  //     if (!portfolioRef.current) return;
  //     const canvas = await html2canvas(portfolioRef.current, {
  //       scale: 2, // High quality
  //       useCORS: true, // Ensures images from external sources are captured
  //     });
  //     setSnapshotUrl(canvas.toDataURL("image/png"));
  //   }
  //   captureSnapshot();
  // }, [userBio]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <PortfolioSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Unable to Load Portfolio</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            {error.includes("sign in") && (
              <Button
                onClick={() => signIn("github")}
                className="mt-4"
                variant="secondary"
              >
                Sign in with GitHub
              </Button>
            )}
            {error.includes("GitHub access") && (
              <Button
                onClick={() => signIn("github")}
                className="mt-4"
                variant="secondary"
              >
                Reconnect GitHub Account
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl flex flex-col">
      <div ref={portfolioRef} className="border p-6 rounded-lg my-4 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">
          {session?.user?.name}'s
          <span className="text-3xl font-medium">
            {" "}
            Developer Portfolio
          </span>{" "}
        </h1>

        <EditableBio initialBio={bio} onSave={handleBioSave} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Total Commits</dt>
                    <dd className="text-2xl font-bold">
                      {metrics?.totalCommits.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">
                      Lines of Code Changed
                    </dt>
                    <dd className="text-2xl font-bold">
                      {metrics?.totalLines.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Files Modified</dt>
                    <dd className="text-2xl font-bold">
                      {metrics?.filesChanged.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </CardContent>{" "}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programming Languages</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics?.language && (
                <LanguageStats languages={metrics.language} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Repository Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Active Repositories</dt>
                  <dd className="text-2xl font-bold">
                    {metrics?.repositories.length.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total Stars</dt>
                  <dd className="text-2xl font-bold">
                    {metrics?.repositories
                      .reduce((acc, repo) => acc + repo.stars, 0)
                      .toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Coding Hours</dt>
                  <dd className="text-2xl font-bold">
                    {metrics?.totalCodingHours.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics?.repositories
              .sort(
                (a, b) =>
                  new Date(b.lastUpdated).getTime() -
                  new Date(a.lastUpdated).getTime(),
              )
              .slice(0, 4)
              .map((repo) => (
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
                      <span className="text-sm">
                        📅 {format(new Date(repo.lastUpdated), "MMM d, yyyy")}
                      </span>
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

      <div className="flex justify-between">
        <PDFDownloadLink
          document={
            <ResumePDF
              profile={session?.user?.name || "Developer"}
              bio={bio}
              userBio={userBio}
              projects={metrics?.repositories.map((repo) => repo.name) || []}
            // careerAdvice="AI-powered career insights"
            />
          }
          fileName={`${session?.user?.name}_profilesummary.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <Button disabled={pdfLoading} size="lg">
              {pdfLoading
                ? "Generating PDF..."
                : "Download Profile Summary (PDF)"}
            </Button>
          )}
        </PDFDownloadLink>

        <SnapshotCapture
          targetRef={portfolioRef}
          fileName="portfolio_snapshot"
          onCapture={setSnapshotUrl}
        />

        <SocialShareDropdown
          //TODO:replace with original url improve snapshot
          url={`http://localhost:3000/profile/${session?.user.username || session?.user.id}`}
          image={snapshotUrl || ""}
          text="Check out my GitHub portfolio snapshot! 🚀"
        />
      </div>
    </div>
  );
}
