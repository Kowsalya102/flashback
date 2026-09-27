"use client";

import React, { useState } from "react";
import { FirmwareIncident, SEEDED_INCIDENTS } from "@/lib/incidents";
import {
  Send,
  Database,
  Cpu,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ShieldAlert,
  UserCheck,
  FileCode,
  Tag,
  Zap
} from "lucide-react";

export default function DemoPage() {
  const [query, setQuery] = useState("");
  const [withMemory, setWithMemory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      userQuery: string;
      answer: string;
      incidentsUsed: FirmwareIncident[];
      withMemory: boolean;
      llmModel: string;
      memorySource: string;
      timestamp: string;
    }>
  >([]);
  const [selectedIncident, setSelectedIncident] = useState<FirmwareIncident | null>(
    SEEDED_INCIDENTS[0]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset sample tickets for 1-click testing
  const sampleQueries = [
    { label: "STM32 I2C SDA Bus Lockup", text: "STM32F4 I2C1 bus hangs inside HAL_I2C_Master_Transmit returning HAL_BUSY. SDA line stuck LOW." },
    { label: "ESP32 SPI DMA Buffer Overrun", text: "ESP32-S3 SPI DMA corrupts payload bytes above 20MHz clock frequency on PSRAM buffer write." },
    { label: "nRF52 UART Framing Error in BLE", text: "nRF52840 UART framing error at 115200 baud when BLE SoftDevice connection events fire." },
    { label: "STM32H7 Flash Brown-Out Reset", text: "STM32H7 resets with BOR flag set in RCC_RSR when writing config to internal Flash." },
    { label: "ESP32 Task Watchdog Timeout", text: "ESP32 Task Watchdog TWDT resets MCU during flash partition encryption routine." },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSubmit = queryText || query;
    if (!textToSubmit.trim() || loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSubmit,
          withMemory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process query");
      }

      setChatHistory((prev) => [
        ...prev,
        {
          userQuery: textToSubmit,
          answer: data.answer,
          incidentsUsed: data.incidentsUsed || [],
          withMemory: data.withMemory,
          llmModel: data.llmModel,
          memorySource: data.memorySource,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      if (data.incidentsUsed && data.incidentsUsed.length > 0) {
        setSelectedIncident(data.incidentsUsed[0]);
      }

      setQuery("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE INTERACTIVE DEBUGGING AGENT
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Flashback Memory Assistant <span className="gradient-brand-text">Demo</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Ask any firmware or hardware bug symptom. Toggle memory recall on/off to compare Hindsight grounded answers live.
          </p>
        </div>

        {/* Toggle Mode: Answer with Memory vs Answer without Memory */}
        <div className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-surface-border shadow-md">
          <span className="text-xs font-medium text-gray-300">Memory Engine:</span>
          <button
            onClick={() => setWithMemory(!withMemory)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              withMemory
                ? "bg-brand-indigo text-white shadow-glow-indigo"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {withMemory ? (
              <>
                <ToggleRight className="w-4 h-4 text-brand-cyan" />
                <span>WITH HINDSIGHT MEMORY</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-red-400" />
                <span>WITHOUT MEMORY (GENERIC)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Chat Interface on Left, Memory Recall Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Interactive Chat Window (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[700px] glass-panel rounded-2xl border-surface-border overflow-hidden shadow-2xl">
          {/* Chat Window Bar */}
          <div className="bg-[#12121D] px-4 py-3 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-cyan" />
              <span className="text-xs font-mono font-bold text-gray-200">
                flashback-agent // {withMemory ? "grounded-hindsight-mode" : "standard-llm-mode"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-gray-400">Rate Limit: Active</span>
            </div>
          </div>

          {/* Chat History Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-[#0B0B12]">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30 flex items-center justify-center">
                  <Database className="w-6 h-6 text-brand-cyan" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Ask Flashback a Firmware Bug</h3>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Select a sample scenario below or type a symptom involving STM32, ESP32, nRF52, I2C, SPI, UART, DMA, or FreeRTOS.
                  </p>
                </div>

                {/* Preset sample buttons */}
                <div className="w-full space-y-2 pt-2">
                  <div className="text-[11px] font-mono uppercase text-gray-500 font-semibold">
                    Preset Bug Tickets (Click to Test):
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {sampleQueries.map((sq, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sq.text)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:border-brand-indigo hover:text-white text-gray-300 transition-all text-left"
                      >
                        ⚡ {sq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              chatHistory.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  {/* User Query Bubble */}
                  <div className="flex justify-end">
                    <div className="bg-brand-indigo/30 border border-brand-indigo/50 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] text-xs sm:text-sm font-mono shadow-md">
                      <div className="text-[10px] text-brand-cyan font-sans mb-1 flex items-center gap-1">
                        <span>ENGINEER QUERY</span> &bull; <span>{item.timestamp}</span>
                      </div>
                      {item.userQuery}
                    </div>
                  </div>

                  {/* Agent Response Bubble */}
                  <div className="flex justify-start">
                    <div className={`rounded-2xl rounded-tl-none p-4 max-w-[95%] text-xs sm:text-sm shadow-xl space-y-3 ${
                      item.withMemory
                        ? "bg-[#121624] border border-brand-cyan/30 text-gray-200"
                        : "bg-[#1C1418] border border-red-500/30 text-gray-300"
                    }`}>
                      {/* Header Badge */}
                      <div className="flex items-center justify-between pb-2 border-b border-surface-border text-xs">
                        <span className="font-bold flex items-center gap-1.5">
                          {item.withMemory ? (
                            <>
                              <Database className="w-4 h-4 text-brand-cyan" />
                              <span className="text-brand-cyan font-mono">Hindsight Grounded Answer</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 font-mono">Standard LLM (No Memory)</span>
                            </>
                          )}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {item.llmModel}
                        </span>
                      </div>

                      {/* Answer Markdown Text */}
                      <div className="prose prose-invert prose-xs leading-relaxed whitespace-pre-wrap font-sans text-xs">
                        {item.answer}
                      </div>

                      {/* Recalled incidents footer tag */}
                      {item.incidentsUsed.length > 0 && (
                        <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Recalled Ticket: {item.incidentsUsed[0].id} ({item.incidentsUsed[0].mcu})
                          </span>
                          <button
                            onClick={() => setSelectedIncident(item.incidentsUsed[0])}
                            className="text-brand-cyan hover:underline"
                          >
                            Inspect Memory Ticket &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/50 border border-surface-border text-xs text-brand-cyan font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Hindsight Cloud Vector Searching & Groq Synthesis...</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#12121E] border-t border-surface-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe bug (e.g., STM32 I2C lockup, ESP32 SPI DMA corruption)..."
                className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-indigo transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white text-xs font-bold hover:shadow-glow-indigo disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Visible "Memory Recall" Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-surface-border space-y-5 shadow-2xl">
            {/* Panel Title */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-cyan" />
                <h2 className="text-base font-bold text-white">Hindsight Memory Panel</h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 font-bold">
                22 Seeded Incidents
              </span>
            </div>

            {selectedIncident ? (
              <div className="space-y-4 text-xs">
                {/* Incident Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-brand-cyan">
                    {selectedIncident.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                    selectedIncident.impact === "Critical"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {selectedIncident.impact} Impact
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">
                  {selectedIncident.title}
                </h3>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#0B0B14] border border-surface-border text-[11px] font-mono text-gray-300">
                  <div>
                    <span className="text-gray-500 block text-[10px]">MCU FAMILY</span>
                    <span className="text-brand-cyan font-bold">{selectedIncident.mcu}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">SOLVED BY</span>
                    <span className="text-gray-200">{selectedIncident.author.split(" ")[0]} {selectedIncident.author.split(" ")[1]}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">DATE RESOLVED</span>
                    <span className="text-gray-400">{selectedIncident.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">RECALL SCORE</span>
                    <span className="text-emerald-400 font-bold">{selectedIncident.confidence || 96}% Match</span>
                  </div>
                </div>

                {/* Symptom */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold">Symptom</span>
                  <p className="text-gray-300 text-xs bg-surface p-2.5 rounded border border-surface-border leading-relaxed">
                    {selectedIncident.symptom}
                  </p>
                </div>

                {/* Root Cause */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold">Root Cause</span>
                  <p className="text-gray-200 text-xs bg-brand-cyan/10 p-2.5 rounded border border-brand-cyan/20 leading-relaxed">
                    {selectedIncident.rootCause}
                  </p>
                </div>

                {/* Fix Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Proven Fix</span>
                  <p className="text-gray-200 text-xs bg-emerald-950/20 p-2.5 rounded border border-emerald-800/30 leading-relaxed">
                    {selectedIncident.fixDetails}
                  </p>
                </div>

                {/* Code Snippet */}
                {selectedIncident.codeSnippet && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-gray-400 font-bold flex items-center gap-1">
                      <FileCode className="w-3 h-3 text-brand-cyan" />
                      Patch Code Snippet
                    </span>
                    <pre className="p-3 rounded-lg bg-[#050508] border border-surface-border text-[11px] font-mono text-emerald-300 overflow-x-auto">
                      {selectedIncident.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">
                Click any chat answer or preset ticket to inspect its recalled memory record.
              </p>
            )}
          </div>

          {/* Quick incident list drawer */}
          <div className="glass-panel rounded-2xl p-5 border-surface-border space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center justify-between">
              <span>Seeded Incident Index</span>
              <span className="text-brand-cyan">22 Total</span>
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {SEEDED_INCIDENTS.slice(0, 6).map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                    selectedIncident?.id === inc.id
                      ? "bg-brand-indigo/30 text-white border border-brand-indigo/40"
                      : "bg-surface/50 text-gray-400 hover:text-white hover:bg-surface-hover"
                  }`}
                >
                  <span className="truncate pr-2">{inc.id}: {inc.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border shrink-0">
                    {inc.mcu.split("")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
