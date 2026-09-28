import React from "react";
import Link from "next/link";
import { TerminalHero } from "@/components/TerminalHero";
import { BeforeAfterComparison } from "@/components/BeforeAfterComparison";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Logo } from "@/components/Logo";
import {
  Brain,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Database,
  Cpu,
  Github,
  Sparkles,
  Wrench,
  Code2,
  HardDrive
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-12 overflow-hidden bg-hero-gradient bg-grid-pattern">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-indigo/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] bg-brand-cyan/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-surface-border text-xs font-medium text-gray-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              <span>Powered by <strong>Hindsight</strong> Memory API &amp; <strong>Groq</strong></span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your team's debugging history,{" "}
              <span className="gradient-brand-text">remembered forever.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              "The debugging assistant that never forgets a fix." Persistent memory across <strong>Hardware</strong>, <strong>Firmware</strong>, and <strong>Software</strong> debugging incidents.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/app"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo hover:shadow-glow-cyan transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Launch Flashback App</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-gray-300 bg-surface/80 border border-surface-border hover:bg-surface-hover hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4 text-brand-cyan" />
                <span>Try Public Sandbox Demo</span>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <TerminalHero />
          </div>
        </div>
      </section>

      {/* NEW SECTION: WHAT FLASHBACK DEBUGS (Hardware, Embedded/Firmware, Software) */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold text-brand-cyan tracking-wider">Cross-Disciplinary Coverage</span>
            <h2 className="text-3xl font-extrabold text-white">
              What Flashback Debugs
            </h2>
            <p className="text-gray-400 text-sm">
              Unified memory recall spanning physical circuits, microcontrollers, and cloud software stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1: HARDWARE */}
            <div className="glass-panel-interactive p-8 rounded-2xl border-surface-border space-y-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">HARDWARE</h3>
                <p className="text-xs text-brand-cyan font-mono">Analog &amp; Digital Circuit Debugging</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-amber-400">•</span> Power supply ripple &amp; brown-out resets</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">•</span> PCB traces, schematics &amp; component values</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">•</span> Signal integrity, EMI noise &amp; ground loops</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">•</span> Sensors, actuators, motor drivers &amp; RF antennas</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">•</span> Oscilloscope, logic analyzer &amp; multimeter telemetry</li>
              </ul>
            </div>

            {/* CARD 2: EMBEDDED/FIRMWARE */}
            <div className="glass-panel-interactive p-8 rounded-2xl border-surface-border space-y-5">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center border border-brand-cyan/20">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">EMBEDDED / FIRMWARE</h3>
                <p className="text-xs text-brand-cyan font-mono">MCU, RTOS &amp; Peripheral Drivers</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-brand-cyan">•</span> STM32, ESP32, nRF52, AVR, RP2040, RISC-V</li>
                <li className="flex items-center gap-2"><span className="text-brand-cyan">•</span> FreeRTOS &amp; Zephyr task deadlocks &amp; stack limits</li>
                <li className="flex items-center gap-2"><span className="text-brand-cyan">•</span> I2C, SPI, UART, CAN bus &amp; USB EasyDMA drivers</li>
                <li className="flex items-center gap-2"><span className="text-brand-cyan">•</span> Watchdog resets, low-power modes &amp; bootloaders</li>
                <li className="flex items-center gap-2"><span className="text-brand-cyan">•</span> Linker script memory section overlaps &amp; GCC flags</li>
              </ul>
            </div>

            {/* CARD 3: SOFTWARE */}
            <div className="glass-panel-interactive p-8 rounded-2xl border-surface-border space-y-5">
              <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center border border-brand-indigo/20">
                <Code2 className="w-6 h-6 text-brand-indigo" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">SOFTWARE</h3>
                <p className="text-xs text-brand-cyan font-mono">Backend, Web, Systems &amp; Cloud</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 leading-relaxed">
                <li className="flex items-center gap-2"><span className="text-brand-indigo">•</span> C/C++, Python, Rust, TS/JS, Go &amp; Java</li>
                <li className="flex items-center gap-2"><span className="text-brand-indigo">•</span> Asyncio deadlocks, race conditions &amp; memory leaks</li>
                <li className="flex items-center gap-2"><span className="text-brand-indigo">•</span> PostgreSQL, Redis &amp; REST API performance</li>
                <li className="flex items-center gap-2"><span className="text-brand-indigo">•</span> Docker build cache invalidation &amp; CI pipelines</li>
                <li className="flex items-center gap-2"><span className="text-brand-indigo">•</span> MQTT brokers, BLE gateways &amp; cloud IoT streams</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PROBLEM SECTION */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-xs uppercase tracking-widest font-bold text-red-400">
              The Engineering Knowledge Loss Problem
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight">
              Engineering teams re-solve the same bugs because past solutions walk out the door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Tribal Knowledge Loss</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                When a senior engineer leaves, their knowledge of board rev caveats, race conditions, and switching noise fixes disappears from Slack threads.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Duplicate Debug Cycles</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Engineers waste days re-probing signals or reading stack traces for bugs that were already debugged and fixed months ago.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center border border-brand-indigo/20">
                <Brain className="w-5 h-5 text-brand-cyan" />
              </div>
              <h3 className="text-lg font-bold text-white">Generic AI Hallucinations</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Standard LLMs don't know your custom PCB schematics, internal API quirks, or past Jira tickets. They give generic textbook answers that fail in production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW FLASHBACK WORKS */}
      <section className="py-16 bg-[#08080E] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold text-brand-cyan tracking-wider">Workflow</span>
            <h2 className="text-3xl font-extrabold text-white">
              How Flashback Works in 3 Steps
            </h2>
            <p className="text-gray-400 text-sm">
              Continuous incident indexing powered by Hindsight Cloud vector API.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="glass-panel-interactive p-8 rounded-2xl border-surface-border relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-brand-indigo/20 text-brand-indigo font-bold text-lg flex items-center justify-center border border-brand-indigo/30">
                  01
                </span>
                <span className="text-xs font-mono text-gray-500 uppercase">Input</span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-indigo" />
                Retain
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every resolved debug session, scope measurement, or fix is automatically structured and stored inside your personal <strong>Hindsight Cloud</strong> memory bank.
              </p>
            </div>

            <div className="glass-panel-interactive p-8 rounded-2xl border-surface-border relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-brand-cyan/20 text-brand-cyan font-bold text-lg flex items-center justify-center border border-brand-cyan/30">
                  02
                </span>
                <span className="text-xs font-mono text-gray-500 uppercase">Search</span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-cyan" />
                Recall
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                When you paste a log or describe a symptom, Flashback performs vector similarity recall, matching physical behavior and stack trace faults.
              </p>
            </div>

            <div className="glass-panel-interactive p-8 rounded-2xl border-surface-border relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center border border-emerald-500/30">
                  03
                </span>
                <span className="text-xs font-mono text-gray-500 uppercase">Fix</span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Resolve
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Groq LLM synthesizes a grounded response citing the exact past ticket, root cause, author, and verified code or component fix needed to resolve the bug in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BEFORE VS AFTER MEMORY COMPARISON CARD */}
      <BeforeAfterComparison />

      {/* SECTION 6: ARCHITECTURE DIAGRAM SECTION */}
      <ArchitectureDiagram />

      {/* SECTION 7: CALL TO ACTION */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border-brand-indigo/30 text-center relative overflow-hidden bg-gradient-to-r from-[#121222] via-[#10152B] to-[#0D1826] shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <div className="flex justify-center">
                <Logo size={48} showWordmark={false} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Give your engineering team persistent memory today.
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Sign in to launch your personal Hindsight memory bank or test the public interactive sandbox.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-cyan hover:scale-105 transition-all duration-200"
                >
                  Open Flashback App
                </Link>
                <Link
                  href="/demo"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-gray-300 bg-surface border border-surface-border hover:bg-surface-hover hover:text-white transition-all"
                >
                  Try Public Sandbox Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
