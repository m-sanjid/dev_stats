import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { GithubDashboard } from "@/components/GithubDashboard";
import { GithubConnect } from "@/components/GithubConnect";

export default async function DashboardPage() {
  const session = await auth();

  // If no session, redirect to the signin page
  if (!session) {
    redirect("/auth/signin");
  }

  const githubToken = await prisma.githubToken.findUnique({
    where: { userId: session.user.id },
  });
  console.log(githubToken);

  return (
    <>
      <PageHeader
        title="GitHub Dashboard"
        description="View your GitHub repositories and activity"
      />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <GithubConnect hasGithubToken={!!githubToken} />
        </div>
        {githubToken && <GithubDashboard />}
      </div>
    </>
  );
}
