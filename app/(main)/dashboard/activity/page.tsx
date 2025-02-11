import { PageHeader } from "@/components/PageHeader";
import { ActivityAnalytics } from "@/components/ActivityAnalytics";
import { auth } from "@/auth";
import { fetchGitHubMetrics } from "@/components/FetchGithubMetrics";

export default async function ActivityPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const metrics = await fetchGitHubMetrics(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Activity" 
        description="Your coding activity over time"
      />
      <div className="container mx-auto py-4 px-4">
        <ActivityAnalytics metrics={metrics} />
      </div>
    </div>
  );
} 