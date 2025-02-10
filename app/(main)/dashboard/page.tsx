import { auth } from "@/auth"; // Import the auth() function you exported in your NextAuth setup
import { PrismaClient } from "@prisma/client";
import { GitHubDashboard } from "@/components/GithubDashboard";
import { GithubConnect } from "@/components/GithubConnect";
import { redirect } from "next/navigation"; // For redirection
import fetchGitHubMetrics from "@/components/FetchGithubMetrics";

const prisma = new PrismaClient();

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
      {hasGitHubToken && metrics && <GitHubDashboard metrics={metrics} />}
    </div>
  );
}
