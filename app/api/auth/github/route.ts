import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "GitHub OAuth is not configured in environment variables. Missing GITHUB_CLIENT_ID.");
    return NextResponse.redirect(loginUrl);
  }

  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const redirectUri = `${baseUrl}/api/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user:email read:user",
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
