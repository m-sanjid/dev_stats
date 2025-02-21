import { auth } from "@/auth";
import { fetchGitHubMetrics } from "@/lib/github";
import RepoPageClient from "./client";

export default async function RepoPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <RepoPageClient metrics={null} />;
  }

  const metrics = await fetchGitHubMetrics(session.user.id);
  return <RepoPageClient metrics={metrics} />;
}
