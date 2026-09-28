import React from "react";

export default function MemoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 font-mono text-xs text-brand-cyan">
      <div className="h-10 bg-[#151522] animate-pulse rounded-2xl w-64" />
      <div className="h-14 bg-[#151522] animate-pulse rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 bg-[#151522] animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
