import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Step 1: Handle GitHub OAuth initiation
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
  }

  // Generate a random state for CSRF protection
  const state = randomBytes(16).toString("hex");

  // Store the state in the database for validation later
  await prisma.user.update({
    where: { id: session.user.id },
    data: { githubOAuthState: state },
  });

  // Redirect the user to GitHub for authorization
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.AUTH_GITHUB_ID}&redirect_uri=${encodeURIComponent("http://localhost:3000/api/auth/connect-github")}&scope=repo read:user read:email&state=${state}`;

  return NextResponse.redirect(githubAuthUrl);
}

// Step 2: Handle GitHub OAuth callback
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard?error=Missing+code+or+state", req.url),
    );
  }

  try {
    // Retrieve the stored state from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { githubOAuthState: true },
    });

    console.log("Stored State:", user?.githubOAuthState);
    console.log("Received State:", state);

    if (!user?.githubOAuthState || state !== user.githubOAuthState) {
      return NextResponse.redirect(
        new URL("/dashboard?error=Invalid+state+parameter", req.url),
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.AUTH_GITHUB_ID,
          client_secret: process.env.AUTH_GITHUB_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error(
        "GitHub token error:",
        tokenData.error_description || tokenData.error,
      );
      return NextResponse.redirect(
        new URL(
          `/dashboard?error=${encodeURIComponent(tokenData.error_description || "Failed to get access token")}`,
          req.url,
        ),
      );
    }

    // Fetch GitHub user data
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.statusText}`);
    }

    const githubUser = await userResponse.json();

    // Store the token and GitHub username in the database
    await prisma.githubToken.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        accessToken: tokenData.access_token,
        githubUsername: githubUser.login,
        tokenType: tokenData.token_type,
        scope: tokenData.scope,
      },
      update: {
        accessToken: tokenData.access_token,
        githubUsername: githubUser.login,
        tokenType: tokenData.token_type,
        scope: tokenData.scope,
      },
    });

    // Clear the state after successful authentication
    await prisma.user.update({
      where: { id: session.user.id },
      data: { githubOAuthState: null },
    });

    // Redirect to the dashboard with success message
    return NextResponse.redirect(
      new URL(
        "/dashboard?github=connected&message=GitHub+account+linked+successfully",
        req.url,
      ),
    );
  } catch (error) {
    console.error("Error connecting GitHub account:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=Failed+to+connect+GitHub", req.url),
    );
  }
}
