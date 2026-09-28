import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserMemoryEvents, addMemoryEvent, deleteAllUserMemories } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memories = getUserMemoryEvents(user.id);
  return NextResponse.json({ memories });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, symptom, domain, rootCause, fixDetails, tags, conversationId } = await req.json();

  if (!title || !symptom || !rootCause || !fixDetails) {
    return NextResponse.json({ error: "Title, symptom, root cause, and fix details are required." }, { status: 400 });
  }

  const memory = addMemoryEvent(user.id, "mark_solved", {
    conversationId,
    title,
    symptom,
    domain: domain || "General",
    rootCause,
    fixDetails,
    tags: tags || ["Resolved"],
  });

  return NextResponse.json({ message: "Memory retained successfully in Hindsight bank.", memory });
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  deleteAllUserMemories(user.id);
  return NextResponse.json({ message: "All memory events deleted." });
}
