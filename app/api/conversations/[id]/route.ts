import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getConversation, getConversationMessages, updateConversation, deleteConversation } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = getConversation(params.id);
  if (!conv || conv.userId !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const messages = getConversationMessages(params.id);
  return NextResponse.json({ conversation: conv, messages });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = getConversation(params.id);
  if (!conv || conv.userId !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const updates = await req.json();
  const updated = updateConversation(params.id, updates);
  return NextResponse.json({ conversation: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = getConversation(params.id);
  if (!conv || conv.userId !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  deleteConversation(params.id);
  return NextResponse.json({ message: "Conversation deleted" });
}
