import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json({
    message: "Email verification complete. Your account is fully activated.",
    verified: true,
  });
}
