import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Flashback Persistent Memory Agent",
    hindsightStatus: process.env.HINDSIGHT_API_KEY ? "connected" : "fallback_mode",
    groqStatus: process.env.GROQ_API_KEY ? "connected" : "fallback_mode",
    timestamp: new Date().toISOString(),
  });
}
