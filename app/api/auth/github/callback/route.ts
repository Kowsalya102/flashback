import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;

  if (error || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error || "GitHub authentication was cancelled.")}`, baseUrl));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/github/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("GitHub OAuth missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variables.")}`, baseUrl));
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange GitHub OAuth code.");
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "Flashback-App",
      },
    });
    const profile = await userRes.json();

    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "Flashback-App",
        },
      });
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
        if (primary) email = primary.email;
      }
    }

    if (!email) {
      throw new Error("GitHub account email could not be retrieved.");
    }

    let user = getUserByEmail(email);
    if (!user) {
      user = createUser(email, "", profile.name || profile.login || email.split("@")[0]);
    }

    const res = NextResponse.redirect(new URL("/app", baseUrl));
    setSessionCookie(res.headers, user.id);
    return res;
  } catch (err: any) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "GitHub login failed.")}`, baseUrl));
  }
}
