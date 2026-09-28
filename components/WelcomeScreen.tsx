"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Sparkles, ArrowRight, Github, Mail, ShieldCheck, Database, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleGuestMode = () => {
    // Navigate to sandbox app in guest mode
    router.push("/app?mode=guest");
  };

  return (
    <div className="min-h-screen bg-[#07070F] text-gray-200 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#6366F1]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar Logo */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <Logo size={36} />
        <div className="flex items-center gap-3 text-xs font-mono">
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
            About &amp; Docs
          </Link>
          <Link href="/login" className="px-3.5 py-1.5 rounded-xl bg-surface border border-surface-border text-white hover:border-brand-indigo transition-all">
            Sign In
          </Link>
        </div>
      </div>

      {/* Main Single-Screen Content Container */}
      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto relative z-10 py-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#06B6D4] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            PERSISTENT VECTOR MEMORY AGENT
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The debugging assistant that <span className="gradient-brand-text">never forgets a fix.</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Persistent memory across Hardware, Firmware, and Software. Stop re-solving the same hardware glitches and concurrency bugs.
          </p>
        </div>

        {/* Short Before/After Memory Preview Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#120D12] border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <ShieldAlert className="w-4 h-4" /> Without Memory (Generic LLM)
            </div>
            <p className="text-gray-400 text-[11px]">
              "Try lower clock speeds and check oscilloscope traces for signal integrity..."
            </p>
            <div className="text-[10px] text-red-400/80 font-sans">Time wasted: 4.5 hours re-probing</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1524] border border-[#06B6D4]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#06B6D4] font-bold">
              <Database className="w-4 h-4" /> With Flashback (Hindsight Memory)
            </div>
            <p className="text-emerald-300 text-[11px]">
              "Recalled Ticket INC-2024-102: Allocate SPI DMA buffer with MALLOC_CAP_INTERNAL..."
            </p>
            <div className="text-[10px] text-emerald-400 font-sans">Resolved in 3 mins with verified fix</div>
          </div>
        </div>

        {/* Action Buttons Container */}
        <div className="max-w-md mx-auto space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/signup")}
              className="py-3 px-4 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#06B6D4] shadow-glow-indigo hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Continue GitHub</span>
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="py-3 px-4 rounded-2xl font-bold text-xs text-gray-200 bg-surface border border-surface-border hover:bg-surface-hover transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#06B6D4]" />
              <span>Email Sign Up</span>
            </button>
          </div>

          <button
            onClick={handleGuestMode}
            className="w-full py-3 rounded-2xl font-bold text-xs text-gray-300 bg-[#12121E] border border-surface-border hover:border-[#06B6D4] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#06B6D4]" />
            <span>Try without an account (Guest Sandbox)</span>
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-surface-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-2 relative z-10">
        <div>&copy; {new Date().getFullYear()} Flashback Systems. Powered by Hindsight.</div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-gray-300">How It Works</Link>
          <Link href="/about" className="hover:text-gray-300">Memory Architecture</Link>
          <Link href="/about" className="hover:text-gray-300">Team &amp; Tech Stack</Link>
        </div>
      </div>
    </div>
  );
};
