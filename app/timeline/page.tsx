"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  Database,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export default function TimelinePage() {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(3);

  // Simulated memory retention data points over time (Weeks 1 to 12)
  const chartData = [
    { week: "Wk 1", incidents: 5, accuracy: 42, avgResolutionHours: 4.8, label: "Initial Seed (5 Tickets)" },
    { week: "Wk 3", incidents: 18, accuracy: 68, avgResolutionHours: 2.5, label: "STM32 & ESP32 Retained" },
    { week: "Wk 6", incidents: 45, accuracy: 84, avgResolutionHours: 1.1, label: "Nordic BLE & RTOS Ingestion" },
    { week: "Wk 9", incidents: 92, accuracy: 94, avgResolutionHours: 0.3, label: "Power & BOR Errata Vectorized" },
    { week: "Wk 12", incidents: 148, accuracy: 98.6, avgResolutionHours: 0.05, label: "Full Team Autonomous Recall" },
  ];

  const milestones = [
    {
      id: 1,
      title: "01. Knowledge Ingestion Phase",
      date: "Month 1 — Seed",
      incidentsCount: 18,
      mttr: "2.5 Hours",
      accuracy: "68%",
      desc: "Basic peripheral HAL tickets ingested. Agent handles standard I2C and UART pinout queries.",
      icon: Database,
    },
    {
      id: 2,
      title: "02. Cross-Architecture Memory Integration",
      date: "Month 2 — Expansion",
      incidentsCount: 65,
      mttr: "35 Minutes",
      accuracy: "89%",
      desc: "FreeRTOS mutex deadlocks, ESP32 DMA memory boundaries, and nRF52 SoftDevice interrupt priority tickets indexed.",
      icon: Layers,
    },
    {
      id: 3,
      title: "03. High-Recall Autonomous Resolution",
      date: "Month 3 — Production",
      incidentsCount: 148,
      mttr: "3 Minutes",
      accuracy: "98.6%",
      desc: "Silicon errata, power management BOR thresholds, and custom board revisions matched with high precision.",
      icon: Zap,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          Memory Compound Effect
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Agent Performance &amp; <span className="gradient-brand-text">Recall Timeline</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg">
          As your team retains more incident tickets, debugging resolution time drops exponentially while grounding accuracy reaches 98.6%.
        </p>
      </div>

      {/* METRICS HIGHLIGHT ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>TOTAL INDEXED INCIDENTS</span>
            <Database className="w-4 h-4 text-brand-indigo" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">148+</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24 new tickets this month
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>MEAN TIME TO RESOLUTION</span>
            <Clock className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-3xl font-extrabold text-brand-cyan font-mono">3 Mins</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Reduced from 4.8 Hours
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>GROUNDED ACCURACY</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">98.6%</div>
          <div className="text-xs text-gray-400 font-medium">
            Zero hallucinations on recalled tickets
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>RE-DEBUGGING ELIMINATED</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">94.2%</div>
          <div className="text-xs text-gray-400 font-medium">
            Repeat bug cycles completely avoided
          </div>
        </div>
      </div>

      {/* VISUAL CHART COMPONENT */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl border-surface-border shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Memory Ingestion vs. Resolution Time Reduction
            </h2>
            <p className="text-xs text-gray-400">
              Simulated timeline showing performance trajectory as Hindsight memory size increases.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-brand-cyan">
              <span className="w-3 h-3 rounded bg-brand-cyan inline-block" /> Accuracy (%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block" /> Resolution Time (Hours)
            </span>
          </div>
        </div>

        {/* Animated Bar / Line Visual Representation */}
        <div className="space-y-6 pt-4">
          {chartData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                <span className="font-bold text-white w-16">{item.week}</span>
                <span className="text-gray-400 flex-1 px-4 truncate">{item.label}</span>
                <span className="text-brand-cyan font-bold w-24 text-right">
                  {item.accuracy}% Acc
                </span>
                <span className="text-emerald-400 font-bold w-24 text-right">
                  {item.avgResolutionHours} hrs
                </span>
              </div>

              {/* Stacked Visual Bar */}
              <div className="h-6 w-full bg-[#0E0E18] rounded-lg p-1 flex items-center border border-surface-border relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.accuracy}%` }}
                  transition={{ duration: 1, delay: index * 0.15 }}
                  className="h-full bg-gradient-to-r from-brand-indigo to-brand-cyan rounded-md relative group"
                />

                <div className="absolute right-4 text-[10px] font-mono font-bold text-white z-10">
                  {item.incidents} Incidents Vectorized
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MILESTONE TIMELINE NODES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Memory Evolution Milestones</h2>
          <p className="text-xs text-gray-400">
            How Flashback transforms your firmware engineering workflow over 90 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMilestone === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMilestone(m.id)}
                className={`glass-panel-interactive p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? "border-brand-cyan bg-surface-hover shadow-glow-cyan"
                    : "border-surface-border opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center border border-brand-cyan/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-gray-400">
                    {m.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{m.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>

                <div className="pt-4 border-t border-surface-border/60 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 block">TICKETS</span>
                    <span className="text-white font-bold">{m.incidentsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">MTTR</span>
                    <span className="text-emerald-400 font-bold">{m.mttr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">ACCURACY</span>
                    <span className="text-brand-cyan font-bold">{m.accuracy}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
