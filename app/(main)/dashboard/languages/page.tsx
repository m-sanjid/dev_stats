import { PageHeader } from "@/components/PageHeader";
import { LanguageAnalytics } from "@/components/LanguageAnalytics";
import { auth } from "@/auth";
import { fetchGitHubMetrics } from "@/lib/github";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LanguagesPage() {
  const session = await auth();

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

  const metrics = await fetchGitHubMetrics(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Languages"
        description="Analysis of your programming languages"
      />
      <div className="container mx-auto py-8 px-4 max-w-7xl mt-16">
        <LanguageAnalytics metrics={metrics} />
      </div>
    </div>
  );
}
