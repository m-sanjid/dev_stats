import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // Fetch GitHub token from `accounts` table instead of `githubToken`
    const account = await prisma.account.findFirst({
      where: { userId, provider: "github" },
      select: { access_token: true },
    });

    if (!account?.access_token) {
      return NextResponse.json(
        { success: false, error: "GitHub token not found", accessToken: null },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: account.access_token,
    });
  } catch (error) {
    console.error("Error fetching GitHub token:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", accessToken: null },
      { status: 500 },
    );
  }
}
