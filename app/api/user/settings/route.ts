import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, memoryEnabled, skillLevel } = await req.json();

    const updated = updateUser(user.id, {
      name: name ?? user.name,
      memoryEnabled: memoryEnabled ?? user.memoryEnabled,
      userProfile: {
        ...user.userProfile,
        skillLevel: skillLevel || user.userProfile.skillLevel,
      },
    });

    return NextResponse.json({ message: "Updated successfully", user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
