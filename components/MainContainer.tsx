"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const MainContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAppPage = pathname?.startsWith("/app") || pathname?.startsWith("/chat");

  if (isAppPage) {
    return <main className="w-full h-screen h-[100dvh] overflow-hidden flex flex-col">{children}</main>;
  }

  return <main className="flex-1 pt-20">{children}</main>;
};
