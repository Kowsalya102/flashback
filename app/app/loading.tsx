import React from "react";

export default function LoadingWorkspace() {
  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#09090D] p-6 lg:p-8 space-y-6 font-mono text-xs text-brand-cyan">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-10 bg-[#151522] animate-pulse rounded-2xl w-64" />
        <div className="h-20 bg-[#151522] animate-pulse rounded-2xl w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#151522] animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-[#151522] animate-pulse rounded-3xl" />
          <div className="h-64 bg-[#151522] animate-pulse rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
