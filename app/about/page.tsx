import React from "react";
import Link from "next/link";
import { Github, ExternalLink, Cpu, Database, ShieldCheck, Code2, Sparkles, BookOpen } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Elena Vance",
      role: "System Architect & Embedded Memory Lead",
      bio: "Designed Flashback's serverless vector pipeline and led STM32/ESP32 hardware incident taxonomy schemas.",
      built: "Built the dual-mode Hindsight memory retriever and I2C/SPI incident catalog.",
      articleUrl: "https://hindsight.vectorize.io/blog/firmware-memory-architecture",
      avatar: "EV",
      color: "from-indigo-500 to-purple-600",
    },
    {
      name: "Marcus Brody",
      role: "Principal Firmware & RTOS Engineer",
      bio: "12+ years in low-level embedded C/C++, specialized in FreeRTOS concurrency, DMA alignment, and silicon errata.",
      built: "Designed the ESP32-S3 PSRAM DMA and RP2040 inter-core deadlock resolution engine.",
      articleUrl: "https://hindsight.vectorize.io/blog/espressif-dma-memory-alignment",
      avatar: "MB",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Liam O'Connor",
      role: "Wireless Protocols & Nordic BLE Lead",
      bio: "Expert in Nordic nRF52/nRF53 SoftDevice radio coexistence, UART EasyDMA, and power optimization.",
      built: "Created the nRF52 SoftDevice UARTE interrupt isolation pattern.",
      articleUrl: "https://hindsight.vectorize.io/blog/nordic-easydma-ble-coexistence",
      avatar: "LO",
      color: "from-teal-500 to-emerald-600",
    },
    {
      name: "Siddharth Nair",
      role: "Hardware Electronics & Power Systems Lead",
      bio: "Analog and digital power engineer focused on STM32H7 BOR voltage rail stability and HRTIM PWM phase control.",
      built: "Authored the Brown-Out Reset option byte calculator and hardware power glitch diagnostics.",
      articleUrl: "https://hindsight.vectorize.io/blog/stm32h7-bor-power-rail-stabilization",
      avatar: "SN",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          The Team Behind Flashback
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Engineers Building for <span className="gradient-brand-text">Engineers</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg">
          We built Flashback because we were tired of losing critical firmware fixes every time an engineer changed teams or closed a debug ticket.
        </p>
      </div>

      {/* TEAM MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="glass-panel p-8 rounded-2xl border-surface-border space-y-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-brand-indigo/40 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Avatar Badge */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-mono font-extrabold text-lg shadow-lg`}>
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono text-brand-cyan mt-0.5">
                    {member.role}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {member.bio}
              </p>

              <div className="p-3 rounded-xl bg-surface/60 border border-surface-border text-xs text-gray-300 space-y-1 font-mono">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Key Contribution</span>
                <span>{member.built}</span>
              </div>
            </div>

            {/* Article Link Out */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-gray-500 font-mono">Technical Writeup:</span>
              <a
                href={member.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-brand-cyan hover:text-white transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Member Article</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* TECH STACK RECAP BOX */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border-surface-border shadow-2xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Production Tech Stack</h2>
          <p className="text-xs text-gray-400">
            Engineered with modern serverless architecture and zero client secret exposure.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-surface-border space-y-2">
            <Code2 className="w-6 h-6 text-brand-indigo mx-auto" />
            <div className="text-sm font-bold text-white">Next.js 14</div>
            <div className="text-[11px] text-gray-400">App Router & TypeScript</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-surface-border space-y-2">
            <Database className="w-6 h-6 text-brand-cyan mx-auto" />
            <div className="text-sm font-bold text-white">Hindsight API</div>
            <div className="text-[11px] text-gray-400">Vectorize Vector Memory</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-surface-border space-y-2">
            <Cpu className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">Groq API</div>
            <div className="text-[11px] text-gray-400">openai/gpt-oss-120b</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-surface-border space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="text-sm font-bold text-white">Vercel</div>
            <div className="text-[11px] text-gray-400">Continuous HTTPS Serverless</div>
          </div>
        </div>
      </section>
    </div>
  );
}
