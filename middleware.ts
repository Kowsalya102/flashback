import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Redirect /app directly to /chat to open new chat session immediately
  if (pathname === "/app") {
    const chatUrl = new URL("/chat", req.url);
    searchParams.forEach((value, key) => chatUrl.searchParams.set(key, value));
    return NextResponse.redirect(chatUrl, { status: 307 });
  }

  // 2. Allow public routes, static assets, and auth endpoints
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
      return NextResponse.redirect(new URL("/chat", req.url));
    }
    return NextResponse.next();
  }

  // 3. Allow Guest mode access
  const isGuest = searchParams.get("mode") === "guest";
  if (isGuest) {
    return NextResponse.next();
  }

  // 4. Protect app routes (/chat, /memory, /settings, etc.)
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
