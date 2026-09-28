import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getConversation, getConversationMessages, addMessage, addMemoryEvent, updateConversation } from "@/lib/db";
import { recallMemory } from "@/lib/hindsight";
import { generateAnswer } from "@/lib/groq";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conv = getConversation(params.id);
    if (!conv || conv.userId !== user.id) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const { content, domain, withMemory = true, attachments } = await req.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // Save User Message
    const userMsg = addMessage(params.id, "user", content, undefined, attachments);

    // Auto-update conversation title if it's the first message
    const existingMsgs = getConversationMessages(params.id);
    if (existingMsgs.length <= 1) {
      const generatedTitle = content.slice(0, 32) + (content.length > 32 ? "..." : "");
      updateConversation(params.id, { title: generatedTitle });
    }

    // Determine domain & memory setting
    const targetDomain = domain || conv.domain || "Auto-detect";
    const memoryEnabled = withMemory && user.memoryEnabled && conv.memoryEnabled;

    // Step 1: Hindsight Recall (Per-user memory bank)
    let recalledIncidents: any[] = [];
    if (memoryEnabled) {
      const recallRes = await recallMemory(content);
      recalledIncidents = recallRes.recalledIncidents;

      // Log memory audit event
      if (recalledIncidents.length > 0) {
        addMemoryEvent(user.id, "recall", {
          conversationId: params.id,
          title: `Recall for query: ${content.slice(0, 30)}`,
          symptom: content,
          domain: targetDomain,
          rootCause: recalledIncidents[0].rootCause || "Vector memory hit",
          fixDetails: recalledIncidents[0].fixDetails || "Grounded team fix",
          tags: recalledIncidents[0].tags || [],
        });
      }
    }

    // Step 2: Groq Answer Generation
    const answerRes = await generateAnswer(content, recalledIncidents, memoryEnabled, targetDomain);

    // Save Assistant Message
    const assistantMsg = addMessage(
      params.id,
      "assistant",
      answerRes.answer,
      answerRes.incidentsUsed,
      undefined,
      [{ tool: "hindsight_recall", status: memoryEnabled ? "recalled" : "disabled", count: answerRes.incidentsUsed.length }]
    );

    return NextResponse.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      incidentsUsed: answerRes.incidentsUsed,
      llmModel: answerRes.llmModel,
      withMemory: memoryEnabled,
    });
  } catch (err: any) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: err.message || "Failed to process message" }, { status: 500 });
  }
}
