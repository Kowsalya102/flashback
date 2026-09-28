"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  return <AppShell initialConvId={params.id} />;
}
