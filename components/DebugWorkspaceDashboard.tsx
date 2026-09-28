"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  Plus,
  MessageSquare,
  Database,
  Sparkles,
  Zap,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  ExternalLink,
  Calculator,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Terminal
} from "lucide-react";

export function DebugWorkspaceDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams ? searchParams.get("mode") === "guest" : false;

  // System Health State
  const [health, setHealth] = useState<{
    hindsightStatus: string;
    groqStatus: string;
    databaseStatus: string;
    latencyMs?: number;
    timestamp?: string;
  } | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);

  // User Stats State
  const [stats, setStats] = useState<{
    memoriesRetained: number;
    incidentsSolved: number;
    chatsThisWeek: number;
    recallsUsed: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  // Conversations State
  const [conversations, setConversations] = useState<any[]>([]);
  const [convsLoading, setConvsLoading] = useState(true);
  const [convsError, setConvsError] = useState(false);

  // Memory Activity Feed State
  const [memories, setMemories] = useState<any[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(true);
  const [memoriesError, setMemoriesError] = useState(false);

  // Reflect Insights State
  const [reflectData, setReflectData] = useState<any>(null);
  const [reflectLoading, setReflectLoading] = useState(true);
  const [reflectError, setReflectError] = useState(false);

  // Fetch Health Endpoint (Auto-refreshes every 30s)
  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(false);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      } else {
        setHealthError(true);
      }
    } catch {
      setHealthError(true);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // Fetch Stats Endpoint
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const url = isGuestMode ? "/api/user/stats?mode=guest" : "/api/user/stats";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setStatsError(true);
      }
    } catch {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, [isGuestMode]);

  // Fetch Conversations
  const fetchConversations = useCallback(async () => {
    setConvsLoading(true);
    setConvsError(false);
    if (isGuestMode) {
      setConversations([
        { id: "guest_conv_1", title: "STM32 & I2C Bus Lockup Diagnosis", domain: "Firmware", updatedAt: new Date().toISOString() },
        { id: "guest_conv_2", title: "Python Asyncio Telemetry Deadlock", domain: "Software", updatedAt: new Date(Date.now() - 3600000).toISOString() },
      ]);
      setConvsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      } else {
        setConvsError(true);
      }
    } catch {
      setConvsError(true);
    } finally {
      setConvsLoading(false);
    }
  }, [isGuestMode]);

  // Fetch Memories Catalog
  const fetchMemories = useCallback(async () => {
    setMemoriesLoading(true);
    setMemoriesError(false);
    try {
      const res = await fetch("/api/memory");
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      } else {
        setMemoriesError(true);
      }
    } catch {
      setMemoriesError(true);
    } finally {
      setMemoriesLoading(false);
    }
  }, []);

  // Fetch Reflect Insights
  const fetchReflect = useCallback(async () => {
    setReflectLoading(true);
    setReflectError(false);
    try {
      const res = await fetch("/api/memory/reflect");
      if (res.ok) {
        const data = await res.json();
        setReflectData(data);
      } else {
        setReflectError(true);
      }
    } catch {
      setReflectError(true);
    } finally {
      setReflectLoading(false);
    }
  }, []);

  // Initial Load & Auto-Refresh Timer (30s)
  useEffect(() => {
    fetchHealth();
    fetchStats();
    fetchConversations();
    fetchMemories();
    fetchReflect();

    const interval = setInterval(() => {
      fetchHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchHealth, fetchStats, fetchConversations, fetchMemories, fetchReflect]);

  // Handler for opening a chat with prefilled query/tool
  const handleLaunchChat = (queryPrompt?: string) => {
    const modeParam = isGuestMode ? "?mode=guest" : "";
    if (queryPrompt) {
      const encoded = encodeURIComponent(queryPrompt);
      router.push(`/chat${modeParam}${isGuestMode ? "&" : "?"}prompt=${encoded}`);
    } else {
      router.push(`/chat${modeParam}`);
    }
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#09090D] text-gray-200 overflow-y-auto font-sans p-4 sm:p-6 lg:p-8 space-y-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* 1. GUEST MODE SOFT BANNER */}
        {isGuestMode && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-indigo/20 via-brand-cyan/20 to-purple-500/20 border border-brand-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-cyan-200">
              <Zap className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>
                <strong>Guest Sandbox Mode:</strong> Your debugging state and memories are transient. Sign up for a free account to persist your own dedicated Hindsight memory bank.
              </span>
            </div>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold hover:scale-105 transition-all text-xs shrink-0"
            >
              Sign Up Free
            </Link>
          </div>
        )}

        {/* 2. HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-cyan font-bold">
              <Activity className="w-4 h-4" />
              OPERATIONAL COMMAND CENTER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Debug Workspace <span className="gradient-brand-text">Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Live system status, recent debug sessions, vector memory activity, and engineering tools.
            </p>
          </div>

          <button
            onClick={() => handleLaunchChat()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold text-xs sm:text-sm shadow-glow-indigo hover:shadow-glow-cyan hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>New Debug Session</span>
          </button>
        </div>

        {/* 3. LIVE STATUS STRIP */}
        <div className="glass-panel p-4 rounded-2xl border-surface-border space-y-3 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-2 text-gray-400">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="font-bold text-white">LIVE INFRASTRUCTURE STATUS</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {health?.latencyMs !== undefined && (
                <span className="text-gray-400">Latency: <strong className="text-emerald-400">{health.latencyMs}ms</strong></span>
              )}
              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="p-1 hover:text-white transition-colors text-gray-400"
                title="Refresh Live Status (Auto-refreshes every 30s)"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? "animate-spin text-brand-cyan" : ""}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hindsight Memory Status */}
            <div className="p-3 rounded-xl bg-[#0B0B14] border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-cyan" />
                <span>Hindsight Memory Bank</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  healthError ? "bg-red-500" : health?.hindsightStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`} />
                <span className={healthError ? "text-red-400" : health?.hindsightStatus === "connected" ? "text-emerald-400" : "text-amber-400"}>
                  {healthError ? "Error" : health?.hindsightStatus === "connected" ? "Connected" : "Fallback"}
                </span>
              </div>
            </div>

            {/* Groq LLM Engine Status */}
            <div className="p-3 rounded-xl bg-[#0B0B14] border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-indigo" />
                <span>Groq LPU Engine</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  healthError ? "bg-red-500" : health?.groqStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`} />
                <span className={healthError ? "text-red-400" : health?.groqStatus === "connected" ? "text-emerald-400" : "text-amber-400"}>
                  {healthError ? "Error" : health?.groqStatus === "connected" ? "Connected" : "Fallback"}
                </span>
              </div>
            </div>

            {/* Database Storage Status */}
            <div className="p-3 rounded-xl bg-[#0B0B14] border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Database Engine</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2.5 h-2.5 rounded-full ${healthError ? "bg-red-500" : "bg-emerald-400 animate-pulse"}`} />
                <span className={healthError ? "text-red-400" : "text-emerald-400"}>
                  {healthError ? "Error" : "Operational"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. REAL STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Card 1: Memories Retained */}
          <div className="glass-panel p-5 rounded-2xl border-surface-border space-y-2 relative overflow-hidden">
            <div className="text-[11px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-brand-cyan" /> Retained Memories
            </div>
            {statsLoading ? (
              <div className="h-8 bg-[#181824] animate-pulse rounded-lg w-16" />
            ) : statsError ? (
              <div className="text-xs text-red-400 font-bold">Failed to load</div>
            ) : (
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.memoriesRetained || 0}
              </div>
            )}
            <div className="text-[10px] text-gray-500">
              {stats?.memoriesRetained === 0 ? "No data yet — Retain fixes from chat" : "Persistent vector memories"}
            </div>
          </div>

          {/* Card 2: Incidents Solved */}
          <div className="glass-panel p-5 rounded-2xl border-surface-border space-y-2 relative overflow-hidden">
            <div className="text-[11px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Solved Incidents
            </div>
            {statsLoading ? (
              <div className="h-8 bg-[#181824] animate-pulse rounded-lg w-16" />
            ) : statsError ? (
              <div className="text-xs text-red-400 font-bold">Failed to load</div>
            ) : (
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.incidentsSolved || 0}
              </div>
            )}
            <div className="text-[10px] text-gray-500">
              {stats?.incidentsSolved === 0 ? "No data yet — Mark solved in chat" : "Verified bug resolutions"}
            </div>
          </div>

          {/* Card 3: Chats This Week */}
          <div className="glass-panel p-5 rounded-2xl border-surface-border space-y-2 relative overflow-hidden">
            <div className="text-[11px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-indigo" /> Chats This Week
            </div>
            {statsLoading ? (
              <div className="h-8 bg-[#181824] animate-pulse rounded-lg w-16" />
            ) : statsError ? (
              <div className="text-xs text-red-400 font-bold">Failed to load</div>
            ) : (
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.chatsThisWeek || 0}
              </div>
            )}
            <div className="text-[10px] text-gray-500">
              {stats?.chatsThisWeek === 0 ? "No chats this week yet" : "Active debug sessions"}
            </div>
          </div>

          {/* Card 4: Vector Recalls Used */}
          <div className="glass-panel p-5 rounded-2xl border-surface-border space-y-2 relative overflow-hidden">
            <div className="text-[11px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recalls Used
            </div>
            {statsLoading ? (
              <div className="h-8 bg-[#181824] animate-pulse rounded-lg w-16" />
            ) : statsError ? (
              <div className="text-xs text-red-400 font-bold">Failed to load</div>
            ) : (
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.recallsUsed || 0}
              </div>
            )}
            <div className="text-[10px] text-gray-500">
              {stats?.recallsUsed === 0 ? "No data yet — Recalls occur during turn" : "Injected into diagnostic answers"}
            </div>
          </div>
        </div>

        {/* 5. CONTINUE WHERE YOU LEFT OFF & MEMORY ACTIVITY FEED GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Conversations Card */}
          <div className="glass-panel p-6 rounded-3xl border-surface-border space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-white font-bold">
                  <MessageSquare className="w-4 h-4 text-brand-cyan" />
                  <span>Continue Where You Left Off</span>
                </div>
                <span className="text-gray-500 text-[11px] font-mono">Last 5 Sessions</span>
              </div>

              {convsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-[#151522] animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : convsError ? (
                <div className="p-4 text-center text-xs font-mono text-red-400 bg-red-950/20 rounded-xl border border-red-800/30">
                  Failed to load recent debug sessions.
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center space-y-3 font-mono text-xs">
                  <div className="text-gray-400">No active debug sessions found yet.</div>
                  <button
                    onClick={() => handleLaunchChat()}
                    className="px-4 py-2 rounded-xl bg-brand-indigo/20 border border-brand-indigo/40 text-brand-cyan font-bold hover:bg-brand-indigo/30"
                  >
                    Start Your First Debug Session
                  </button>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {conversations.slice(0, 5).map((conv) => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-2xl bg-[#0B0B14] border border-surface-border hover:border-brand-indigo flex items-center justify-between gap-3 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0">
                        <MessageSquare className="w-4 h-4 text-brand-cyan shrink-0" />
                        <div className="truncate">
                          <div className="text-white font-bold truncate group-hover:text-brand-cyan transition-colors">
                            {conv.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="px-1.5 py-0.5 rounded bg-[#181824] text-gray-400 font-bold uppercase">
                              {conv.domain || "Auto-detect"}
                            </span>
                            <span>{conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/chat/${conv.id}${isGuestMode ? "?mode=guest" : ""}`)}
                        className="px-3 py-1.5 rounded-xl bg-brand-indigo/20 border border-brand-indigo/40 text-brand-cyan font-bold hover:bg-brand-indigo/30 text-xs shrink-0 flex items-center gap-1 transition-all"
                      >
                        <span>Resume</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Memory Activity Feed Card */}
          <div className="glass-panel p-6 rounded-3xl border-surface-border space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Database className="w-4 h-4 text-brand-cyan" />
                  <span>Memory Activity Feed</span>
                </div>
                <Link
                  href="/memory"
                  className="text-brand-cyan hover:underline text-[11px] flex items-center gap-1 font-mono font-bold"
                >
                  <span>View all memories</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {memoriesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-[#151522] animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : memoriesError ? (
                <div className="p-4 text-center text-xs font-mono text-red-400 bg-red-950/20 rounded-xl border border-red-800/30">
                  Failed to load memory activity feed.
                </div>
              ) : memories.length === 0 ? (
                <div className="p-8 text-center space-y-2 font-mono text-xs">
                  <div className="text-gray-400">No retained memories in Hindsight bank yet.</div>
                  <div className="text-[11px] text-gray-500">
                    Mark a diagnostic turn as solved to retain verified fixes.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 font-mono text-xs">
                  {memories.slice(0, 4).map((m) => (
                    <div key={m.id} className="p-3 rounded-2xl bg-[#0B0B14] border border-surface-border space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-brand-cyan font-bold">{m.id}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                          {m.eventType || "Retained"}
                        </span>
                      </div>
                      <div className="text-white font-bold truncate">{m.title}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-1">{m.rootCause || m.symptom}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. PATTERNS AND INSIGHTS CARD */}
        <div className="glass-panel p-6 rounded-3xl border-brand-cyan/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Hindsight Reflect — Patterns &amp; Subsystem Insights</span>
            </div>
            <button
              onClick={fetchReflect}
              disabled={reflectLoading}
              className="px-3 py-1 rounded-xl bg-surface border border-surface-border hover:bg-surface-hover text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-all font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reflectLoading ? "animate-spin text-amber-400" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {reflectLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-[#151522] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : reflectError || !reflectData ? (
            <div className="p-6 text-center text-xs font-mono text-gray-400 bg-[#0B0B14] rounded-2xl border border-surface-border">
              Insights available after retaining memories into your vector bank.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {reflectData.patterns?.slice(0, 3).map((p: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#0B0B14] border border-surface-border space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-brand-cyan font-bold">{p.category}</span>
                    <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">{p.frequency}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{p.title}</div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">{p.insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. QUICK ENGINEERING TOOLS LAUNCHER */}
        <div className="space-y-4">
          <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-cyan" />
            <span>Quick Engineering Tools &amp; Calculators</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {/* Tool 1: Log Analyzer */}
            <div
              onClick={() => handleLaunchChat("Analyze raw serial console log for panic, fault, or exception stacktrace.")}
              className="glass-panel p-5 rounded-2xl border-surface-border hover:border-brand-cyan transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-brand-cyan">
                <FileSearch className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded">LOGS</span>
              </div>
              <div className="font-bold text-white group-hover:text-brand-cyan transition-colors">
                Serial Log &amp; Crash Analyzer
              </div>
              <div className="text-[11px] text-gray-400">
                Parse hard faults, kernel panics, and stacktraces directly in chat.
              </div>
            </div>

            {/* Tool 2: I2C Pull-Up Calculator */}
            <div
              onClick={() => handleLaunchChat("Calculate I2C bus pull-up resistor value for 400kHz Fast Mode with 150pF bus capacitance.")}
              className="glass-panel p-5 rounded-2xl border-surface-border hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-amber-400">
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">HARDWARE</span>
              </div>
              <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                I2C Bus Pull-Up Calculator
              </div>
              <div className="text-[11px] text-gray-400">
                Determine max/min pull-up resistance for 100k, 400k, or 1M bus speeds.
              </div>
            </div>

            {/* Tool 3: RC Filter Time Constant */}
            <div
              onClick={() => handleLaunchChat("Calculate RC time constant and cutoff frequency for R=10k, C=100nF low-pass filter.")}
              className="glass-panel p-5 rounded-2xl border-surface-border hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-emerald-400">
                <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">FILTERS</span>
              </div>
              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                RC Filter &amp; Time Constant
              </div>
              <div className="text-[11px] text-gray-400">
                Compute cutoff frequency (-3dB) and 10%-90% rise time for RC filters.
              </div>
            </div>

            {/* Tool 4: Resistor Divider */}
            <div
              onClick={() => handleLaunchChat("Calculate resistor divider for 12V to 3.3V ADC scaling with 10k output impedance.")}
              className="glass-panel p-5 rounded-2xl border-surface-border hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-purple-400">
                <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">ADC</span>
              </div>
              <div className="font-bold text-white group-hover:text-purple-400 transition-colors">
                Resistor Voltage Divider
              </div>
              <div className="text-[11px] text-gray-400">
                Scale high voltage rails down for 3.3V or 1.8V ADC inputs safely.
              </div>
            </div>

            {/* Tool 5: Baud Rate Error */}
            <div
              onClick={() => handleLaunchChat("Calculate UART baud rate error percentage for 115200 baud on 8MHz MCU clock.")}
              className="glass-panel p-5 rounded-2xl border-surface-border hover:border-cyan-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-cyan-400">
                <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">UART</span>
              </div>
              <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                UART Baud Rate Drift Calculator
              </div>
              <div className="text-[11px] text-gray-400">
                Check fractional baud divider error % against MCU clock frequencies.
              </div>
            </div>

            {/* Tool 6: ADC LSB Resolution */}
            <div
              onClick={() => handleLaunchChat("Calculate ADC LSB voltage step for 12-bit ADC with 3.3V VREF.")}
              className="glass-panel p-5 rounded-2xl border-surface-border hover:border-brand-indigo transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-brand-indigo">
                <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] bg-brand-indigo/20 text-brand-indigo px-2 py-0.5 rounded">RESOLUTION</span>
              </div>
              <div className="font-bold text-white group-hover:text-brand-indigo transition-colors">
                ADC LSB &amp; Step Resolution
              </div>
              <div className="text-[11px] text-gray-400">
                Determine millivolt per LSB count for 10-bit, 12-bit, or 16-bit ADCs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
