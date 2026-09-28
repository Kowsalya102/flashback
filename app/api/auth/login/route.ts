import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const pwdHash = hashPassword(password);
    if (user.passwordHash !== pwdHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const res = NextResponse.json({
      message: "Logged in successfully.",
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
    return NextResponse.json({ error: err.message || "Failed to log in" }, { status: 500 });
  }
}
