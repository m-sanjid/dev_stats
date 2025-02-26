import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function generateReadme(
  repoName: string,
  repoDescription: string,
  otherDetails: { [key: string]: string },
) {
  const prompt = `You are an expert technical writer specializing in GitHub README files.

Project Title: ${repoName}
Project Description: ${repoDescription}

${formatOtherDetails(otherDetails)}

Please generate a well-structured README using Markdown, including:

## Project Title
## Description
## Table of Contents
## Key Features (if applicable)
## Getting Started
  - Prerequisites
  - Installation
## Usage
## Contributing
## License
## Contact
## Acknowledgements
## Project Status`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const textResponse = result.response?.text?.();
  if (!textResponse) throw new Error("AI failed to generate README.");

  return textResponse;
}

// eslint-disable-next-line
function formatOtherDetails(otherDetails: { [key: string]: any }): string {
  let formatted = "";
  for (const key in otherDetails) {
    formatted += `\n## ${key}\n`;

    if (Array.isArray(otherDetails[key])) {
      formatted += otherDetails[key].map((item) => `- ${item}`).join("\n");
    } else if (typeof otherDetails[key] === "object") {
      for (const nestedKey in otherDetails[key]) {
        formatted += `- **${nestedKey}**: ${otherDetails[key][nestedKey]}\n`;
      }
    } else {
      formatted += `${otherDetails[key]}`;
    }
    formatted += "\n";
  }
  return formatted;
}

export async function improveReadme(currentReadme: string) {
  const prompt = `You are an expert in improving GitHub README files. Please enhance this README by suggesting missing sections, fixing formatting, and improving clarity:\n\n${currentReadme}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const textResponse = result.response?.text?.();
  if (!textResponse) throw new Error("AI failed to generate README.");

  return textResponse;
}

export async function generateProjectSummary(
  repoName: string,
  repoDescription: string,
  languages: string[],
) {
  const prompt = `Analyze the following GitHub project:
  - Name: ${repoName}
  - Description: ${repoDescription}
  - Tech Stack: ${languages.join(", ")}

  Provide:
  1. A concise professional summary.
  2. The project's main impact or unique feature.
  3. Suggested improvements if applicable.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });
  const textResponse = result.response?.text?.();
  if (!textResponse) throw new Error("AI failed to generate summary.");
  return textResponse;
}

interface GitHubMetrics {
  totalCommits: number;
  totalLines: number;
  totalCodingHours: number;
  filesChanged: number;
  repositories: Repository[];
  githubProfile: GitHubProfile | null;
  weeklyCommits: Record<string, number>;
  dailyActivity: Record<number, number>;
  language: Record<string, number>;
}

interface Repository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  branches: number;
  lastUpdated: string;
  commits: number;
  linesChanged: number;
  language: string;
}

interface GitHubProfile {
  username: string;
  avatarUrl: string;
}

export async function generateBio(metrics: GitHubMetrics) {
  const sanitizedMetrics = {
    totalCommits: metrics.totalCommits ?? 0,
    totalCodingHours: metrics.totalCodingHours ?? 0,
    filesChanged: metrics.filesChanged ?? 0,
    language: metrics.language ?? {},
    repositories: metrics.repositories ?? [],
  };

  const languages =
    Object.entries(sanitizedMetrics.language)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang, percentage]) => `${lang} (${Math.round(percentage)}%)`)
      .join(", ") || "No language data available";

  const mostUsedLanguages = new Set(
    sanitizedMetrics.repositories.map((repo) => repo.language),
  );

  const prompt = `
  Generate a short and concise professional bio highlighting:
  1. Their strongest skills based on activity.
  2. Areas of expertise shown through their work.
  3. Development patterns and preferences.
  
  GitHub Profile Analysis:
  - Total Commits: ${sanitizedMetrics.totalCommits}
  - Coding Hours: ${sanitizedMetrics.totalCodingHours}
  - Files Changed: ${sanitizedMetrics.filesChanged}
  - Top Languages: ${languages}
  
  Technical Expertise:
  - Primary Languages: ${Array.from(mostUsedLanguages).join(", ")}
  - Most Active Repositories: ${sanitizedMetrics.repositories
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 3)
    .map((repo) => repo.name)
    .join(", ")}
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    const textResponse = result.response?.text?.();
    if (!textResponse) throw new Error("AI failed to generate summary.");
    return textResponse;
  } catch (error) {
    console.error("Error generating bio:", error);
    return `A professional developer with ${sanitizedMetrics.totalCommits} contributions and expertise in ${Object.keys(sanitizedMetrics.language)[0] || "various"} technologies.`;
  }
}
