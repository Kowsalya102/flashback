import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserMemoryEvents, getUserConversations } from "@/lib/db";

export async function GET(req: NextRequest) {
  const isGuest = req.nextUrl.searchParams.get("mode") === "guest";

  if (isGuest) {
    return NextResponse.json({
      memoriesRetained: 3,
      incidentsSolved: 2,
      chatsThisWeek: 2,
      recallsUsed: 4,
      isGuest: true,
    });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memoryEvents = getUserMemoryEvents(user.id);
  const conversations = getUserConversations(user.id);

  const memoriesRetained = memoryEvents.length;
  const incidentsSolved = memoryEvents.filter(
    (m) => m.eventType === "mark_solved" || m.eventType === "retain"
  ).length;

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const chatsThisWeek = conversations.filter(
    (c) => new Date(c.updatedAt).getTime() >= oneWeekAgo
  ).length;

  const recallsUsed = memoryEvents.filter((m) => m.eventType === "recall").length || memoriesRetained;

  return NextResponse.json({
    memoriesRetained,
    incidentsSolved,
    chatsThisWeek,
    recallsUsed,
    isGuest: false,
  });
}
