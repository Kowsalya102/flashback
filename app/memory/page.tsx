"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  Filter,
  Trash2,
  Download,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Tag,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Zap,
  RefreshCw
} from "lucide-react";

export default function MemoryBankPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [reflectData, setReflectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "insights">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
    loadReflect();
  }, []);

  const loadMemories = async () => {
    try {
      const res = await fetch("/api/memory");
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReflect = async () => {
    try {
      const res = await fetch("/api/memory/reflect");
      if (res.ok) {
        const data = await res.json();
        setReflectData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (confirm("Delete this retained incident memory?")) {
      await fetch(`/api/memory/${id}`, { method: "DELETE" });
      loadMemories();
    }
  };

  const handleDeleteAll = async () => {
    if (confirm("Are you sure you want to delete ALL retained memory events in your Hindsight bank? This action cannot be undone.")) {
      await fetch("/api/memory", { method: "DELETE" });
      loadMemories();
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hindsight_memories_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredMemories = memories.filter((m) => {
    const matchesDomain = selectedDomain === "All" || m.domain?.toLowerCase() === selectedDomain.toLowerCase();
    const text = `${m.title} ${m.symptom} ${m.rootCause} ${m.fixDetails} ${(m.tags || []).join(" ")}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
            <Database className="w-3.5 h-3.5" />
            HINDSIGHT VECTOR MEMORY BANK
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Personal Memory Catalog &amp; <span className="gradient-brand-text">Reflect Insights</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse, search, edit, export, or analyze recurring incident patterns in your vector memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-surface border border-surface-border hover:bg-surface-hover text-xs font-mono text-gray-200 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-brand-cyan" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleDeleteAll}
            className="px-3.5 py-2 rounded-xl bg-red-950/30 border border-red-800/40 hover:bg-red-900/40 text-xs font-mono text-red-400 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Memory Bank</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-4 border-b border-surface-border pb-3 text-xs font-mono">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === "catalog"
              ? "bg-brand-indigo text-white font-bold shadow-glow-indigo"
              : "text-gray-400 hover:text-white bg-surface"
          }`}
        >
          <Database className="w-4 h-4 text-brand-cyan" />
          <span>Retained Memory Catalog ({memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("insights")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === "insights"
              ? "bg-brand-indigo text-white font-bold shadow-glow-indigo"
              : "text-gray-400 hover:text-white bg-surface"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Hindsight Reflect Insights</span>
        </button>
      </div>

      {/* TAB 1: MEMORY CATALOG */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface p-3 rounded-2xl border border-surface-border">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories by symptom, MCU, root cause, or tag..."
                className="w-full bg-[#0B0B14] border border-surface-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-indigo font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              {["All", "Hardware", "Firmware", "Software"].map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedDomain === dom
                      ? "bg-brand-cyan text-black font-bold"
                      : "bg-[#0B0B14] text-gray-400 hover:text-white"
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Memories Grid */}
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-brand-cyan">
              Loading vector memory records...
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30 flex items-center justify-center mx-auto">
                <Database className="w-6 h-6 text-brand-cyan" />
              </div>
              <h3 className="text-base font-bold text-white">No Retained Memories Found</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Start a debug session at <Link href="/app" className="text-brand-cyan hover:underline font-bold">/app</Link> and click "Mark as Solved" to retain verified incident fixes into your vector bank.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMemories.map((m) => (
                <div
                  key={m.id}
                  className="glass-panel p-6 rounded-2xl border-surface-border space-y-4 shadow-xl relative group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-brand-cyan">{m.id}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          m.domain === "Hardware"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : m.domain === "Software"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        }`}>
                          {m.domain || "Firmware"}
                        </span>
                        <button
                          onClick={() => handleDeleteOne(m.id)}
                          className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white">{m.title}</h3>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-[#070712] border border-surface-border text-gray-300">
                        <span className="text-[10px] text-gray-500 block">SYMPTOM</span>
                        <p>{m.symptom}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-cyan-200">
                        <span className="text-[10px] text-brand-cyan block font-bold">CONFIRMED ROOT CAUSE</span>
                        <p>{m.rootCause}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-emerald-300">
                        <span className="text-[10px] text-emerald-400 block font-bold">PROVEN FIX</span>
                        <p>{m.fixDetails}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{m.createdAt?.split("T")[0] || "2026-09-28"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(m.tags || []).map((t: string, idx: number) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-gray-400 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REFLECT INSIGHTS */}
      {activeTab === "insights" && reflectData && (
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-3xl border-brand-cyan/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Recurring Patterns in your Debugging History</h2>
              </div>
              <span className="text-xs font-mono text-brand-cyan">
                Analyzed Across {reflectData.totalMemoriesCount} Vector Memories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reflectData.patterns.map((p: any, idx: number) => (
                <div key={idx} className="bg-[#0B0B14] p-5 rounded-2xl border border-surface-border space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-brand-cyan font-bold">{p.category}</span>
                    <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">{p.frequency}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{p.insight}</p>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-300 font-mono space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Recommended Preventive Check:
                    </div>
                    <p>{p.preventiveCheck}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
