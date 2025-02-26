import { fetchGitHubMetrics } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
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
