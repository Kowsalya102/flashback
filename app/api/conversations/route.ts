import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserConversations, createConversation } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convs = getUserConversations(user.id);
  return NextResponse.json({ conversations: convs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, domain } = await req.json().catch(() => ({}));
  const conv = createConversation(user.id, title || "New Debug Session", domain || "Auto-detect");
  return NextResponse.json({ conversation: conv });
}
