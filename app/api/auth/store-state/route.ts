import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Store state in session and DB for GitHub OAuth
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get state from request body
    const { state } = await req.json();

    if (!state || typeof state !== "string") {
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 },
      );
    }

    // Get the session cookie
    const sessionCookie = req.cookies.get("next-auth.session-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Session not found" }, { status: 400 });
    }

    console.log("Session Cookie:", sessionCookie);

    // Store state in DB
    await updateSession(session.user.id, state);
    console.log("State stored for user:", session.user.id, "State:", state);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing state:", error);
    return NextResponse.json(
      { error: "Failed to store state" },
      { status: 500 },
    );
  }
}

// Validate the state during callback
export async function validateState(userId: string, returnedState: string) {
  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubOAuthState: true },
  });

  console.log("Stored State:", user?.githubOAuthState);
  console.log("Returned State:", returnedState);

  if (user?.githubOAuthState !== returnedState) {
    throw new Error("Invalid or mismatched state");
  }
}

// Update session with state
async function updateSession(userId: string, state: string) {
  const { prisma } = await import("@/lib/prisma");

  await prisma.user.update({
    where: { id: userId },
    data: { githubOAuthState: state },
  });
}

// Example callback for GitHub
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const returnedState = url.searchParams.get("state");

    if (!returnedState) {
      return NextResponse.json(
        { error: "Missing state parameter" },
        { status: 400 },
      );
    }

    // Validate state
    await validateState(session.user.id, returnedState);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GitHub callback error:", error);
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 },
    );
  }
}

// Let me know if you’d like me to add more features or refine this further! 🚀
