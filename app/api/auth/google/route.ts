import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "Google OAuth is not configured in environment variables. Missing GOOGLE_CLIENT_ID.");
    return NextResponse.redirect(loginUrl);
  }

  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
