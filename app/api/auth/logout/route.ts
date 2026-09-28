import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out successfully." });
  clearSessionCookie(res.headers);
  return res;
}
