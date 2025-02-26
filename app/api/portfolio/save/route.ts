import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, bio, projects } = await req.json();

  await prisma.portfolio.upsert({
    where: { userId },
    update: { bio, projects },
    create: { userId, bio, projects },
  });
  return NextResponse.json({ success: true });
}
