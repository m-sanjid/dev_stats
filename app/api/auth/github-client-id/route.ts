import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Return GitHub client ID from environment variables
    return NextResponse.json({
      clientId: process.env.AUTH_GITHUB_ID || null,
    });
  } catch (error) {
    console.error("Error fetching GitHub client ID:", error);
    return NextResponse.json(
      { error: "Failed to get GitHub client ID" },
      { status: 500 },
    );
  }
}
