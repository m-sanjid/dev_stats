import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.subscription !== "pro") {
    return NextResponse.json({ error: "Not a Pro user" }, { status: 403 });
  }

  const { useWebhook } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { useWebhook },
  });

  return NextResponse.json({ success: true });
}
