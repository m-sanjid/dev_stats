import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get userId from query params or session
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  // Verify the requesting user is requesting their own data
  if (userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const githubToken = await prisma.githubToken.findUnique({
      where: { userId: session.user.id },
      select: {
        accessToken: true,
        // Only select fields you need to return, avoid returning sensitive data
      },
    });

    return NextResponse.json({
      token: githubToken ? true : null, // Return boolean instead of actual token for security
    });
  } catch (error) {
    console.error("Error fetching GitHub token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
