"use client";

import { useEffect, useState } from "react";
import { generateReadme, improveReadme } from "@/lib/ai";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { commitReadmeToGitHub, fetchGitHubMetrics } from "@/lib/github";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import ProOnlyComponent from "@/components/ProOnlyComponent";

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  branches: number;
  lastUpdated: string;
  commits: number;
  linesChanged: number;
  language: string;
}

interface Section {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
}

const defaultSections: Section[] = [
  {
    id: "features",
    label: "Key Features",
    enabled: true,
    description: "Highlight main functionality and capabilities",
  },
  {
    id: "installation",
    label: "Installation Guide",
    enabled: true,
    description: "Step-by-step setup instructions",
  },
  {
    id: "usage",
    label: "Usage Instructions",
    enabled: true,
    description: "How to use the project with examples",
  },
  {
    id: "contributing",
    label: "Contribution Guide",
    enabled: true,
    description: "Guidelines for contributors",
  },
  {
    id: "license",
    label: "License Details",
    enabled: true,
    description: "Project licensing information",
  },
];

const ReadmeGenerator = () => {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [sections, setSections] = useState(defaultSections);
  const [readmeContent, setReadmeContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isPro = session?.user?.subscription === "pro";

  useEffect(() => {
    const loadRepos = async () => {
      if (status !== "authenticated" || !session?.user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const metricsData = await fetchGitHubMetrics(session.user.id);

        if (!metricsData?.repositories?.length) {
          setError("No repositories found");
          return;
        }

        const formattedRepos: Repository[] = metricsData.repositories.map(
          (repo, index) => ({
            id: index,
            name: repo.name,
            description: repo.description || "",
            html_url: repo.url,
            stargazers_count: repo.stars || 0,
            forks_count: repo.forks || 0,
            branches: repo.branches || 0,
            lastUpdated: repo.lastUpdated || new Date().toISOString(),
            commits: repo.commits || 0,
            linesChanged: repo.linesChanged || 0,
            language: repo.language || "Unknown",
          }),
        );

        setRepos(formattedRepos);
      } catch (err) {
        console.error("Error loading repos:", err);
        setError("Failed to load repositories");
        toast.error("Failed to load repositories", {
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [session, status]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">
          Sign in to Generate READMEs
        </h1>
        <Button asChild>
          <Link href="/signup">Sign In with GitHub</Link>
        </Button>
      </div>
    );
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSectionToggle = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section,
      ),
    );
  };

  const LoadingSkeleton = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="p-4 border-neutral-300 border rounded-lg" key={i}>
            <Skeleton className="w-full h-[300px]" />
          </div>
        ))}
      </div>
    );
  };

  const handleGenerateReadme = async () => {
    if (!selectedRepo) {
      toast.warning("Selection Required", {
        description: "Please select a repository first",
      });
      return;
    }

    setLoading(true);
    try {
      const repoData = repos.find((repo) => repo.name === selectedRepo);
      if (!repoData) throw new Error("Repository data not found");

      const enabledSections = sections
        .filter((s) => s.enabled)
        .reduce((acc, section) => ({
          ...acc,
          [section.id]: section.label
        }), {} as { [key: string]: string });

      const generatedReadme = await generateReadme(
        repoData.name,
        repoData.description,
        enabledSections,
      );

      setReadmeContent(generatedReadme);
      toast.success("README Generated", {
        description: "Your README has been generated successfully",
      });
    } catch (error) {
      console.error(error);
      toast.error("Generation Failed", {
        description: "Failed to generate README. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImproveReadme = async () => {
    if (!readmeContent) return;

    setLoading(true);
    try {
      const improvedReadme = await improveReadme(readmeContent);
      setReadmeContent(improvedReadme);
      toast.success("README Improved", {
        description: "Your README has been enhanced with AI suggestions",
      });
    } catch (error) {
      console.error(error);
      toast.error("Improvement Failed", {
        description: "Failed to improve README. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCommitReadme = async () => {
    if (!session?.user?.githubAccessToken || !readmeContent || !selectedRepo) {
      toast.error("Unable to Commit", {
        description: "Missing required information to commit README",
      });
      return;
    }

    setCommitting(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const owner = session.user.name || session.user.id;
        await commitReadmeToGitHub(
          owner,
          selectedRepo,
          readmeContent,
          session.user.githubAccessToken,
        );
        resolve("README successfully committed to GitHub");
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Committing README to GitHub...",
      success: "README successfully committed",
      error: "Failed to commit README",
    });

    promise.finally(() => setCommitting(false));
  };

  if (loading) {
    <LoadingSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="AI-Generated README"
        description="Select a repository and customize your README sections."
      />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <>
          {" "}
          {isPro ? (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Select Repository
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search repositories..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a Repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredRepos.map((repo) => (
                        <SelectItem key={repo.id} value={repo.name}>
                          <div className="flex items-center space-x-2">
                            <span>{repo.name}</span>
                            <span className="text-gray-400">
                              ⭐ {repo.stargazers_count}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    README Sections
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={section.id}
                          checked={section.enabled}
                          onChange={() => handleSectionToggle(section.id)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={section.id}
                          className="cursor-pointer flex-1"
                        >
                          <div className="font-medium">{section.label}</div>
                          <div className="text-sm text-gray-500">
                            {section.description}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleGenerateReadme}
                    disabled={loading || !selectedRepo}
                    className="flex-1"
                  >
                    {loading ? "Generating..." : "Generate README"}
                  </Button>
                </div>
                {loading ? <LoadingSkeleton /> : ""}

                {readmeContent && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        Generated README
                      </h2>
                      <div className="space-x-2">
                        <Button
                          onClick={handleImproveReadme}
                          variant="outline"
                          disabled={loading}
                        >
                          Improve with AI
                        </Button>
                        <Button
                          onClick={() => setPreviewMode(!previewMode)}
                          variant="outline"
                        >
                          {previewMode ? "Edit" : "Preview"}
                        </Button>
                      </div>
                    </div>

                    {previewMode ? (
                      <div className="border rounded-lg p-6 overflow-hidden">
                        <ReactMarkdown>{readmeContent}</ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea
                        value={readmeContent}
                        onChange={(e) => setReadmeContent(e.target.value)}
                        className="min-h-[400px] font-mono"
                        placeholder="README content will appear here..."
                      />
                    )}

                    <div className="relative">
                      <div className="absolute text-white left-1/4 z-20">
                        Comming soon
                      </div>
                      <Button
                        onClick={handleCommitReadme}
                        disabled
                        // disabled={committing || !readmeContent}
                        className="w-full blur-[2px]"
                      >
                        {committing
                          ? "Committing to GitHub..."
                          : "Commit to GitHub"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <ProOnlyComponent />
          )}
        </>
      </div>
    </>
  );
};

export default ReadmeGenerator;
