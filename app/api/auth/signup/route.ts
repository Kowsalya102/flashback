import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Valid email and a password with at least 6 characters are required." },
        { status: 400 }
      );
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const pwdHash = hashPassword(password);
    const user = createUser(email, pwdHash, name || "");

    const res = NextResponse.json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hindsightBankId: user.hindsightBankId,
      },
    });

    setSessionCookie(res.headers, user.id);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create account" }, { status: 500 });
  }
}
