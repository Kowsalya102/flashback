"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Database, ShieldAlert, Cpu, Sparkles, UserCheck } from "lucide-react";

export const BeforeAfterComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"sideBySide" | "before" | "after">("sideBySide");

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-red-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-brand-cyan/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            The Core Value Proposition
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Before Memory vs. <span className="gradient-brand-text">With Flashback</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Generic LLMs give textbook advice. Flashback retrieves your team's exact hardware fixes, register addresses, board rev caveats, and engineer notes.
          </p>

          {/* Mobile Tab Toggle */}
          <div className="flex justify-center md:hidden pt-4">
            <div className="bg-surface border border-surface-border p-1 rounded-lg flex gap-1 text-xs">
              <button
                onClick={() => setActiveTab("sideBySide")}
                className={`px-3 py-1.5 rounded-md font-medium ${
                  activeTab === "sideBySide" ? "bg-brand-indigo text-white" : "text-gray-400"
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveTab("before")}
                className={`px-3 py-1.5 rounded-md font-medium ${
                  activeTab === "before" ? "bg-red-500/20 text-red-300" : "text-gray-400"
                }`}
              >
                Without Memory
              </button>
              <button
                onClick={() => setActiveTab("after")}
                className={`px-3 py-1.5 rounded-md font-medium ${
                  activeTab === "after" ? "bg-emerald-500/20 text-emerald-300" : "text-gray-400"
                }`}
              >
                With Flashback
              </button>
            </div>
          </div>
        </div>

        {/* Question Prompt Card */}
        <div className="mb-8 p-4 rounded-xl bg-[#12121D] border border-surface-border flex items-center gap-3 text-sm text-gray-200 shadow-lg max-w-4xl mx-auto">
          <div className="px-2.5 py-1 rounded bg-brand-indigo/30 text-brand-indigo font-mono text-xs font-bold shrink-0">
            ENGINEER QUESTION
          </div>
          <p className="font-mono text-xs sm:text-sm text-cyan-200">
            "ESP32-S3 SPI DMA transfer corrupts payload bytes when clock speed exceeds 20MHz on PCB rev B."
          </p>
        </div>

        {/* Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: Without Memory (Generic AI) */}
          {(activeTab === "sideBySide" || activeTab === "before") && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border-red-500/20 relative flex flex-col justify-between shadow-xl bg-gradient-to-b from-[#140F14]/90 to-[#0F0B0F]/90">
              <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-red-500/20">
                  <div className="flex items-center gap-2.5 text-red-400 font-semibold text-sm">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <span>Without Memory (Generic LLM)</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    No Team Context
                  </span>
                </div>

                {/* Generic Response Content */}
                <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                  <p className="text-gray-400 italic">
                    "When experiencing SPI DMA corruption on ESP32, you should check your clock settings and wiring..."
                  </p>

                  <ul className="space-y-2 text-gray-400 text-xs">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Try lowering the clock frequency below 10MHz to verify stability.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Ensure your SPI signals have short trace lengths on your board layout.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Check the ESP-IDF documentation for spi_master driver examples.</span>
                    </li>
                  </ul>

                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/30 text-red-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Outcome & Time Wasted:
                    </div>
                    <p className="text-red-400/90 text-[11px]">
                      Engineer spends 4.5 hours re-debugging the DMA memory allocator, unaware that Marcus already solved this 3 months ago!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-border/50 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Accuracy: Low (Generic)</span>
                <span>Time-to-Resolution: ~4.5 Hours</span>
              </div>
            </div>
          )}

          {/* RIGHT: With Flashback Memory (Hindsight Grounded) */}
          {(activeTab === "sideBySide" || activeTab === "after") && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border-brand-cyan/40 relative flex flex-col justify-between shadow-2xl bg-gradient-to-b from-[#0F172A]/90 to-[#0A101D]/90 ring-1 ring-brand-cyan/30">
              <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-brand-cyan/20">
                  <div className="flex items-center gap-2.5 text-brand-cyan font-semibold text-sm">
                    <Database className="w-5 h-5 text-brand-cyan" />
                    <span>With Flashback (Hindsight Memory)</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-brand-cyan" />
                    Recalled Ticket INC-2024-102
                  </span>
                </div>

                {/* Grounded Response Content */}
                <div className="space-y-4 text-xs sm:text-sm text-gray-200 leading-relaxed">
                  <div className="flex items-center gap-2 text-xs text-brand-indigo font-mono bg-brand-indigo/10 p-2 rounded border border-brand-indigo/30">
                    <UserCheck className="w-4 h-4 text-brand-cyan" />
                    <span>Solved by Marcus Brody (Principal Firmware Architect) on PCB Rev B</span>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold text-white text-xs uppercase tracking-wide text-cyan-300">
                      Exact Root Cause & Register Fix:
                    </div>
                    <p className="text-xs text-gray-300">
                      SPI DMA buffer was allocated without 32-bit internal DRAM alignment. PSRAM cache-invalidation trips corruption above 20MHz clock.
                    </p>
                  </div>

                  {/* Code snippet fix */}
                  <div className="bg-[#050B14] border border-brand-cyan/30 rounded-lg p-3 font-mono text-[11px] text-cyan-200">
                    <div className="text-gray-500 mb-1">// Fix: Allocate buffer with MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL</div>
                    <pre className="text-emerald-300">
{`uint8_t *tx_buf = (uint8_t *)heap_caps_malloc(
  FRAME_SIZE, 
  MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL
);`}
                    </pre>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Outcome & Time Saved:
                    </div>
                    <p className="text-emerald-300/90 text-[11px]">
                      Instant fix in under 3 minutes with zero trial-and-error. Grounded in actual team incident records.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-cyan/20 text-[11px] text-gray-400 flex items-center justify-between">
                <span className="text-brand-cyan font-semibold">Confidence: 98.4% Match</span>
                <span className="text-emerald-400 font-bold">Time-to-Resolution: ~3 Minutes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
