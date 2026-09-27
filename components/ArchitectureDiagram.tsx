"use client";

import React, { useState } from "react";
import { Terminal, Server, Cpu, Database, ArrowRight, CheckCircle2, Zap } from "lucide-react";

export const ArchitectureDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      name: "Client Interface",
      tech: "VS Code Extension / Web Chat UI",
      desc: "Engineer types firmware symptom or error code directly from IDE terminal or web portal.",
      icon: Terminal,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      name: "Next.js API Gateway",
      tech: "Serverless Route Handler",
      desc: "Validates input, rate-limits request, and securely proxies request to Groq & Hindsight without exposing API keys.",
      icon: Server,
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: 3,
      name: "Hindsight Cloud Memory",
      tech: "Vectorize Engine",
      desc: "Performs high-dimensional vector search over past team incident tickets, retrieving relevant fixes and register specs.",
      icon: Database,
      color: "from-cyan-500 to-teal-500",
    },
    {
      id: 4,
      name: "Groq LPU Engine",
      tech: "openai/gpt-oss-120b",
      desc: "Synthesizes grounded solution by combining raw LLM reasoning with retrieved Hindsight team incident memory.",
      icon: Cpu,
      color: "from-amber-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#0A0A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-brand-cyan" />
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Flashback & <span className="gradient-brand-text">Hindsight</span> Connect
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Zero client key exposure. Low-latency serverless vector recall powered by Vectorize.
          </p>
        </div>

        {/* Animated SVG Pipeline Diagram */}
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border-surface-border shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isHovered = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`relative rounded-xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isHovered
                      ? "bg-surface-hover border-brand-cyan shadow-glow-cyan transform -translate-y-1"
                      : "bg-surface/70 border-surface-border hover:border-gray-600"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Node Header */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-gray-500 font-bold">0{step.id}</span>
                    </div>

                    {/* Node Info */}
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">{step.name}</h3>
                      <div className="text-xs text-brand-cyan font-mono mb-2">{step.tech}</div>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Connecting Arrow for Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-6 h-6 rounded-full bg-surface-border border border-surface border-cyan-500/30 flex items-center justify-center text-brand-cyan">
                        <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Flow Indicator */}
          <div className="mt-8 pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Server-side security: Keys <code className="text-brand-cyan bg-surface px-1.5 py-0.5 rounded font-mono">GROQ_API_KEY</code> & <code className="text-brand-cyan bg-surface px-1.5 py-0.5 rounded font-mono">HINDSIGHT_API_KEY</code> are never exposed to browser.</span>
            </div>
            <div className="text-right font-mono text-[11px] text-gray-500">
              Avg Recall Latency: <span className="text-brand-cyan font-bold">&lt; 140ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
