import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Delete GitHub token from database
    await prisma.githubToken
      .delete({
        where: { userId: session.user.id },
      })
      .catch((error) => {
        // If the token doesn't exist, that's fine
        if (error.code !== "P2025") {
          // Prisma "Record not found" error
          throw error;
        }
      });

    return NextResponse.json({
      success: true,
      message: "GitHub account disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting GitHub account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect GitHub account" },
      { status: 500 },
    );
  }
}
