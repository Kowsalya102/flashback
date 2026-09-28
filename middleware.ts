import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Allow public routes, static assets, and auth endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/health") ||
    pathname.includes(".") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/demo" ||
    pathname === "/about" ||
    pathname === "/timeline" ||
    pathname === "/forgot-password"
  ) {
    const token = req.cookies.get("flashback_session")?.value;
    if (token && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return NextResponse.next();
  }

  // 2. Allow Guest mode access
  const isGuest = searchParams.get("mode") === "guest";
  if (isGuest) {
    return NextResponse.next();
  }

  // 3. Protect app routes (/app, /chat, /memory, /settings, etc.)
  const token = req.cookies.get("flashback_session")?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "Please sign in to access Flashback.");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
