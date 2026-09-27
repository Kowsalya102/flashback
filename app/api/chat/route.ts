import { NextRequest, NextResponse } from "next/server";
import { recallMemory } from "@/lib/hindsight";
import { generateAnswer } from "@/lib/groq";

// In-memory rate limiting map (IP -> count & reset timestamp)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const now = Date.now();
    const limitData = rateLimitMap.get(ip);

    if (limitData) {
      if (now < limitData.resetTime) {
        if (limitData.count >= 25) {
          return NextResponse.json(
            { error: "Demo usage limit reached for this session. Please try again in 1 minute." },
            { status: 429 }
          );
        }
        limitData.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    }

    const body = await req.json();
    const { query, withMemory = true } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Valid firmware bug query string is required." },
        { status: 400 }
      );
    }

    // Step 1: Hindsight Recall (if memory enabled)
    let recalledIncidents = [];
    let memorySource = "disabled";

    if (withMemory) {
      const recallResult = await recallMemory(query);
      recalledIncidents = recallResult.recalledIncidents;
      memorySource = recallResult.source;
    }

    // Step 2: Groq Answer Generation (grounded or ungrounded)
    const result = await generateAnswer(query, recalledIncidents, withMemory);

    return NextResponse.json({
      answer: result.answer,
      incidentsUsed: result.incidentsUsed,
      withMemory: result.withMemory,
      llmModel: result.llmModel,
      memorySource,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat query: " + (error?.message || "Internal server error") },
      { status: 500 }
    );
  }
}
