import { auth } from "@/auth";
import { NextResponse } from "next/server";

//@ts-ignore
export async function middleware(request) {
  const session = await auth();

  if (!session?.user && request.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"],
};
