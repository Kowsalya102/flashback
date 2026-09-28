"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, MessageSquare } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-mono text-xs text-gray-200">
      <div className="bg-[#11111A] border border-red-800/40 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-white">Something Went Wrong</h1>
          <p className="text-xs text-gray-400">
            {error?.message || "An unexpected error occurred."}
          </p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white font-bold text-xs shadow-glow-indigo flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
          <Link
            href="/chat"
            className="px-4 py-2.5 rounded-xl bg-[#181824] border border-[#232332] text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-[#06B6D4]" />
            <span>Go to Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
