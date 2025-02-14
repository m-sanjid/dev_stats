import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchGitHubMetrics } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // Fetch GitHub token from the database (Server-side only)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: { provider: "github" },
          select: { access_token: true },
        },
      },
    });

    if (!user || !user.accounts[0]?.access_token) {
      return NextResponse.json(
        { success: false, error: "GitHub account not connected" },
        { status: 401 },
      );
    }

    // Fetch GitHub metrics using the token
    const metrics = await fetchGitHubMetrics(userId);

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error("Error fetching GitHub metrics:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
