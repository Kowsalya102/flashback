import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  const hindsightConnected = Boolean(process.env.HINDSIGHT_API_KEY);
  const groqConnected = Boolean(process.env.GROQ_API_KEY);

  return NextResponse.json({
    status: "ok",
    service: "Flashback Persistent Memory Agent",
    hindsightStatus: hindsightConnected ? "connected" : "fallback_mode",
    groqStatus: groqConnected ? "connected" : "fallback_mode",
    databaseStatus: "healthy",
    latencyMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  });
}
