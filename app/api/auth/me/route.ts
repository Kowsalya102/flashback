import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      hindsightBankId: user.hindsightBankId,
      memoryEnabled: user.memoryEnabled,
      userProfile: user.userProfile,
      createdAt: user.createdAt,
    },
  });
}
