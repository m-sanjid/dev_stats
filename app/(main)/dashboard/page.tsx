import { auth } from "@/auth"; // Import the auth() function you exported in your NextAuth setup
import { GitHubDashboard } from "@/components/GithubDashboard";
import { GithubConnect } from "@/components/GithubConnect";
import { redirect } from "next/navigation"; // For redirection
import fetchGitHubMetrics from "@/components/FetchGithubMetrics";
import { prisma } from "@/lib/prisma";
import RepoButton from "@/components/Buttons/RepoButton";
import { PageHeader } from "@/components/PageHeader";

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
    <>
      <PageHeader 
        title="Dashboard" 
        description="Your coding activity at a glance"
        showBack={false}
      />
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <GithubConnect hasGithubToken={!!githubToken} />
            <RepoButton />
          </div>
        </div>
        
        {hasGitHubToken && metrics && <GitHubDashboard metrics={metrics} />}
      </div>
    </>
  );
}
