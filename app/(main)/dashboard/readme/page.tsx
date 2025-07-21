"use client";

import { useEffect, useState } from "react";
import { generateReadme, improveReadme } from "@/lib/ai";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Search, Settings, Eye, EyeOff, Save, Wand2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { commitReadmeToGitHub, fetchGitHubMetrics } from "@/lib/github";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import ProOnlyComponent from "@/components/ProOnlyComponent";
import { motion, Variants } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LoginCTA from "@/components/LoginCTA";
import BorderDiv from "@/components/BorderDiv";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

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
          console.log(error);
          return;
        }

        const formattedRepos: Repository[] = metricsData.repositories.map(
          (repo:Repository, index:number) => ({
            id: index,
            name: repo.name,
            description: repo.description || "",
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count || 0,
            forks_count: repo.forks_count || 0,
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

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    toast.success("Copied to clipboard");
  };

  if (!session) {
    return <LoginCTA />;
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
      <motion.div
        className="grid grid-cols-1 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            variants={item}
            className="rounded-lg border border-primary/20 bg-card/50 p-4 backdrop-blur-sm"
          >
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </motion.div>
        ))}
      </motion.div>
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
        .reduce(
          (acc, section) => ({
            ...acc,
            [section.id]: section.label,
          }),
          {} as { [key: string]: string },
        );

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

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto max-w-7xl px-4 py-8"
      >
        <motion.div
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <PageHeader
              title="README Generator"
              description="Create professional README files for your GitHub repositories"
            />
          </motion.div>

          {isPro ? (
            <motion.div variants={item} className="space-y-8">
              <BorderDiv>
                <Card className="rounded-2xl bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Repository Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                          placeholder="Search repositories..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select
                        value={selectedRepo}
                        onValueChange={setSelectedRepo}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a repository" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredRepos.map((repo) => (
                            <SelectItem key={repo.id} value={repo.name}>
                              {repo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </BorderDiv>

              <BorderDiv>
                <Card className="rounded-2xl bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      README Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className="flex items-center justify-between rounded-lg bg-primary/5 p-4 transition-colors hover:bg-background/80"
                        >
                          <div>
                            <Label className="text-sm font-medium">
                              {section.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                          <Switch
                            checked={section.enabled}
                            onCheckedChange={() =>
                              handleSectionToggle(section.id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BorderDiv>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleGenerateReadme}
                  disabled={loading || !selectedRepo}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Generating..." : "Generate README"}
                </Button>
                <Button
                  onClick={handleImproveReadme}
                  disabled={loading || !readmeContent}
                  variant="outline"
                  className="border-input hover:bg-accent hover:text-accent-foreground"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Improve with AI
                </Button>
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant="outline"
                  className="border-input hover:bg-accent hover:text-accent-foreground"
                >
                  {previewMode ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCommitReadme}
                  disabled={committing || !readmeContent}
                  variant="outline"
                  className="border-input hover:bg-accent hover:text-accent-foreground"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {committing ? "Committing..." : "Commit to GitHub"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={item}>
              <ProOnlyComponent />
            </motion.div>
          )}

          <motion.div variants={item}>
            {loading ? (
              <LoadingSkeleton />
            ) : previewMode ? (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{readmeContent}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <Textarea
                  value={readmeContent}
                  onChange={(e) => setReadmeContent(e.target.value)}
                  className="min-h-[500px] font-mono"
                  placeholder="Your README content will appear here..."
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 z-10"
                  onClick={handleCopy}
                >
                  <Copy />
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReadmeGenerator;
