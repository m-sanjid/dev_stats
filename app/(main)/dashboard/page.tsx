import { auth } from "@/auth"; // Import the auth() function you exported in your NextAuth setup
import { PrismaClient } from "@prisma/client";
import { GitHubDashboard } from "@/components/GithubDashboard";
import { GithubConnect } from "@/components/GithubConnect";
import { redirect } from "next/navigation"; // For redirection

const prisma = new PrismaClient();

const fetchGitHubMetrics = async (userId: string) => {
  const token = await prisma.githubToken.findUnique({
    where: { userId },
  });

  if (!token)
    return { dailyActivity: {}, totalCommits: 0, githubProfile: null };

  // Fetch user's GitHub profile
  const profileResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${token.accessToken}` },
  });

  if (!profileResponse.ok)
    return { dailyActivity: {}, totalCommits: 0, githubProfile: null };

  const profileData = await profileResponse.json();

  return {
    dailyActivity: {}, // Fetch daily activity data separately if needed
    totalCommits: 0,
    githubProfile: {
      username: profileData.login, // GitHub username
      avatarUrl: profileData.avatar_url, // Profile picture
    },
  };
};

export default async function DashboardPage() {
  // Use auth() from your NextAuth v5 setup to get the session
  const session = await auth();

  // If no session, redirect to the signin page
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch GitHub token and metrics
  const githubToken = await prisma.githubToken.findUnique({
    where: { userId: session.user.id },
  });

  const metrics = githubToken
    ? await fetchGitHubMetrics(session.user.id)
    : { dailyActivity: {}, totalCommits: 0, githubProfile: null };
  const hasGitHubToken = !!githubToken;

  // Render the page with your components
  return (
    <div className="container mx-auto py-8 space-y-6">
      <GithubConnect hasGithubToken={!!githubToken} />
      <h1>{githubToken?.id}</h1>
      {hasGitHubToken && metrics && <GitHubDashboard metrics={metrics} />}
    </div>
  );
}
