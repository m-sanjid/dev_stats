import { fetchGitHubMetrics } from "@/lib/github";
import { NextResponse } from "next/server";
import { executeGraphQLQuery, validateToken } from "@/lib/github";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // Get the GitHub token
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/token?userId=${userId}`,
    );

    const tokenData = await tokenResponse.json();
    if (!tokenData || !tokenData.accessToken) {
      throw new Error("No GitHub token found for user");
    }

    const token = tokenData.accessToken;
    if (!(await validateToken(token))) {
      throw new Error("GitHub token is invalid or expired.");
    }

    const metrics = await fetchGitHubMetrics(userId);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching GitHub metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
