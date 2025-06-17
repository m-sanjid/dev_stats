"use server";

import { auth } from "@/auth";
import { fetchGitHubMetrics } from "@/lib/github";

export const getGithubMetrics = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error("You must be logged in to view this page.");
  }

  const metrics = await fetchGitHubMetrics(user.id);

  return metrics;
};
