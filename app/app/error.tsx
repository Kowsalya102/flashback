"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Debug Workspace error:", error);
  }, [error]);

  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#09090D] flex items-center justify-center p-6 font-mono text-xs text-gray-200">
      <div className="glass-panel p-8 rounded-3xl border-red-800/40 max-w-md w-full space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">Debug Workspace Error</h2>
          <p className="text-xs text-gray-400">
            {error.message || "An unexpected error occurred while loading the workspace."}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold hover:scale-105 transition-all text-xs inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading Workspace</span>
        </button>
      </div>
    </div>
  );
}
