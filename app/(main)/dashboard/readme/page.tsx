"use client";

import { useEffect, useState } from "react";
import { generateReadme, improveReadme } from "@/lib/ai";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/Loader";
import ReactMarkdown from "react-markdown";
import { Search } from "lucide-react";
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

const defaultSections = [
  { id: "features", label: "Key Features", enabled: true },
  { id: "installation", label: "Installation Guide", enabled: true },
  { id: "usage", label: "Usage Instructions", enabled: true },
  { id: "contributing", label: "Contribution Guide", enabled: true },
  { id: "license", label: "License Details", enabled: true },
];

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

export default function ReadmeGenerator() {
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

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl p-6">Please sign in to view access this page</h1>

        <Button className="px-8">
          <Link href="/signup">Sign In</Link>
        </Button>
      </div>
    );
  }

  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        if (status === "authenticated" && session?.user?.id) {
          console.log("Fetching repos for user:", session.user.id);

          const metricsData = await fetchGitHubMetrics(session.user.id);
          console.log("Fetched metrics data:", metricsData);

          if (metricsData?.repositories?.length) {
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
          } else {
            setError("No repositories found");
          }
        }
      } catch (err) {
        console.error("Error loading repos:", err);
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [session, status]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSectionToggle = (id: any) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section,
      ),
    );
  };

  const handleGenerateReadme = async () => {
    if (!selectedRepo) return alert("Please select a repository!");

    setLoading(true);
    try {
      const repoData = repos.find((repo) => repo.name === selectedRepo);
      if (!repoData) {
        return alert("Repository data not found.");
      }

      const enabledSections = sections
        .filter((s) => s.enabled)
        .map((s) => s.label);
      const generatedReadme = await generateReadme(
        repoData.name,
        repoData.description || "No description provided",
        enabledSections,
      );
      setReadmeContent(generatedReadme);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImproveReadme = async () => {
    setLoading(true);
    try {
      const improvedReadme = await improveReadme(readmeContent);
      setReadmeContent(improvedReadme);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //TODO: improve functionality
  const handleCommitReadme = async () => {
    if (!session?.user?.githubAccessToken || !readmeContent) return;

    setCommitting(true);
    try {
      const owner = session.user.name || "your-github-username"; // Ensure correct GitHub owner
      await commitReadmeToGitHub(
        owner,
        selectedRepo,
        readmeContent,
        session.user.githubAccessToken,
      );

      alert("README successfully committed to GitHub!");
    } catch (error) {
      console.error(error);
      alert("Failed to commit README.");
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold">AI-Generated README</h1>

      <p className="text-gray-600 mt-2">
        Select a repository and customize your README.
      </p>

      {/* Repository Selection */}

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Select a Repository:</h2>
        <div className="relative flex items-center mt-2">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search repositories..."
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select onValueChange={setSelectedRepo}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select a Repository" />
          </SelectTrigger>
          <SelectContent>
            {filteredRepos.map((repo) => (
              <SelectItem key={repo.id} value={repo.name}>
                {repo.name} ⭐ {repo.stargazers_count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Section Selection */}
      <h2 className="text-lg font-semibold mt-4">Select README Sections:</h2>
      <div className="mt-2 space-y-2">
        {sections.map((section) => (
          <label key={section.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={() => handleSectionToggle(section.id)}
              className="form-checkbox"
            />
            <span>{section.label}</span>
          </label>
        ))}
      </div>

      {/* Generate Button */}
      <Button onClick={handleGenerateReadme} className="mt-4">
        {loading ? "Generating..." : "Generate README"}
      </Button>

      {loading && <Loader />}

      {readmeContent && (
        <div className="mt-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Generated README</h2>
            <div className="space-x-2">
              <Button onClick={handleImproveReadme} variant="outline">
                Improve with AI
              </Button>
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
              >
                {previewMode ? "Edit Markdown" : "Preview"}
              </Button>
            </div>
          </div>

          {previewMode ? (
            <div className="border p-4 rounded bg-gray-100 mt-2">
              <ReactMarkdown>{readmeContent}</ReactMarkdown>
            </div>
          ) : (
            <Textarea
              value={readmeContent}
              className="w-full h-40 mt-2"
              onChange={(e) => setReadmeContent(e.target.value)}
            />
          )}

          <Button
            onClick={handleCommitReadme}
            className="mt-4"
            disabled={committing}
          >
            {committing ? "Committing..." : "Commit to GitHub"}
          </Button>
        </div>
      )}
    </div>
  );
}
