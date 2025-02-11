import { PageHeader } from "@/components/PageHeader";
import { LanguageAnalytics } from "@/components/LanguageAnalytics";
import { auth } from "@/auth";
import { fetchGitHubMetrics } from "@/components/FetchGithubMetrics";

export default async function LanguagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
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
