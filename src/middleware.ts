import { NextResponse, NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // Keep open by default; API routes perform auth checks.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};


