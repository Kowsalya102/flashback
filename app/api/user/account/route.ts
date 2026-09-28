import { NextResponse } from "next/server";
import { getCurrentUser, clearSessionCookie } from "@/lib/auth";
import { deleteUser } from "@/lib/db";

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  deleteUser(user.id);
  const res = NextResponse.json({ message: "Account deleted." });
  clearSessionCookie(res.headers);
  return res;
}
