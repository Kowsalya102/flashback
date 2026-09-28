import React from "react";

export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 font-mono text-xs text-brand-cyan">
      <div className="h-10 bg-[#151522] animate-pulse rounded-2xl w-64" />
      <div className="h-96 bg-[#151522] animate-pulse rounded-3xl w-full" />
    </div>
  );
}
