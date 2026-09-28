"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { EmbeddedCalculatorsModal } from "@/components/EmbeddedCalculatorsModal";
import { MarkAsSolvedModal } from "@/components/MarkAsSolvedModal";
import {
  Plus,
  MessageSquare,
  Search,
  Pin,
  Trash2,
  Edit2,
  Database,
  Send,
  Paperclip,
  Calculator,
  CheckCircle2,
  Sparkles,
  User as UserIcon,
  LogOut,
  Settings,
  ChevronRight,
  ChevronLeft,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  X,
  FileText,
  Menu,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  FileCode
} from "lucide-react";

export default function ChatAppPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("Auto-detect");
  const [withMemory, setWithMemory] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [searchSidebar, setSearchSidebar] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(true);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [markSolvedOpen, setMarkSolvedOpen] = useState(false);
  const [activeIncidentForSolve, setActiveIncidentForSolve] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load User & Conversations on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          loadConversations();
        } else {
          router.push("/login");
        }
      });
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (data.conversations && data.conversations.length > 0 && !activeConvId) {
          selectConversation(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectConversation = async (id: string) => {
    setActiveConvId(id);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.conversation) {
          setWithMemory(data.conversation.memoryEnabled ?? true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Debug Session", domain: selectedDomain }),
      });
      if (res.ok) {
        const data = await res.json();
        setConversations([data.conversation, ...conversations]);
        setActiveConvId(data.conversation.id);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConv = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this conversation history?")) {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (activeConvId === id) {
        if (updated.length > 0) selectConversation(updated[0].id);
        else {
          setActiveConvId(null);
          setMessages([]);
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type,
            content: evt.target?.result as string,
          },
        ]);
      };
      reader.readAsText(file);
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() && attachments.length === 0) return;
    if (loading) return;

    let targetConvId = activeConvId;
    if (!targetConvId) {
      // Auto-create new conversation
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: inputQuery.slice(0, 30), domain: selectedDomain }),
      });
      const data = await res.json();
      targetConvId = data.conversation.id;
      setConversations([data.conversation, ...conversations]);
      setActiveConvId(targetConvId);
    }

    const currentQuery = inputQuery;
    const currentAttachments = [...attachments];

    // Optimistic UI insert user message
    const tempUserMsg = {
      id: "temp_usr_" + Date.now(),
      role: "user",
      content: currentQuery,
      attachments: currentAttachments,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputQuery("");
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch(`/api/conversations/${targetConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: currentQuery + (currentAttachments.length > 0 ? `\n\n[Attached Files]:\n` + currentAttachments.map(a => `--- ${a.name} ---\n${a.content}`).join("\n") : ""),
          domain: selectedDomain,
          withMemory,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process query");

      // Replace optimistic messages with confirmed backend message state
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        data.userMessage,
        data.assistantMessage,
      ]);

      if (data.incidentsUsed && data.incidentsUsed.length > 0) {
        setActiveIncidentForSolve(data.incidentsUsed[0]);
      }
    } catch (err: any) {
      alert("Error processing query: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchSidebar.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#07070F] text-gray-200 overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR (ChatGPT / Claude Style) */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        } transition-all duration-300 bg-[#0C0C16] border-r border-surface-border flex flex-col justify-between overflow-hidden shrink-0 z-20`}
      >
        <div className="p-3 space-y-3">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white text-xs font-bold shadow-glow-indigo hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {sidebarOpen && <span>New Debug Session</span>}
          </button>

          {/* Search Bar */}
          {sidebarOpen && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchSidebar}
                onChange={(e) => setSearchSidebar(e.target.value)}
                placeholder="Search sessions..."
                className="w-full bg-surface border border-surface-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-indigo font-mono"
              />
            </div>
          )}

          {/* Conversation History List */}
          {sidebarOpen && (
            <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              <div className="text-[10px] font-mono uppercase text-gray-500 px-2 py-1 font-bold">
                Recent Debug History
              </div>
              {filteredConvs.length === 0 ? (
                <div className="text-[11px] text-gray-500 px-2 py-3 text-center">No debug sessions yet</div>
              ) : (
                filteredConvs.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand-indigo/30 text-white border border-brand-indigo/50"
                          : "text-gray-400 hover:text-white hover:bg-surface/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-brand-cyan" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConv(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Bottom User Profile Section */}
        {sidebarOpen && user && (
          <div className="p-3 border-t border-surface-border bg-[#090912] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan flex items-center justify-center font-bold text-[11px] text-white">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="truncate">
                <div className="text-white font-bold truncate text-[11px]">{user.name}</div>
                <div className="text-gray-500 text-[10px] truncate">{user.email}</div>
              </div>
            </div>
            <Link href="/settings" className="p-1.5 text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>

      {/* 2. MAIN CHAT PANEL */}
      <main className="flex-1 flex flex-col justify-between h-full relative overflow-hidden bg-[#0A0A10]">
        {/* Top Control Bar */}
        <div className="bg-[#12121E] px-4 py-3 border-b border-surface-border flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-surface border border-surface-border text-gray-400 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>Flashback Memory Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                PROD AGENT
              </span>
            </span>
          </div>

          {/* Domain Chips */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-surface-border text-xs font-mono">
            {["Auto-detect", "Hardware", "Firmware", "Software"].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedDomain === dom
                    ? "bg-brand-indigo text-white font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Hindsight Memory Toggle & Memory Panel Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWithMemory(!withMemory)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                withMemory
                  ? "bg-brand-indigo/30 text-brand-cyan border border-brand-cyan/40"
                  : "bg-red-950/30 text-red-400 border border-red-800/40"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{withMemory ? "MEMORY ON" : "MEMORY OFF"}</span>
            </button>

            <button
              onClick={() => setMemoryPanelOpen(!memoryPanelOpen)}
              className="p-1.5 rounded-lg bg-surface border border-surface-border text-gray-400 hover:text-white"
              title="Toggle Memory Recall Panel"
            >
              <Sparkles className="w-4 h-4 text-brand-cyan" />
            </button>
          </div>
        </div>

        {/* Messages Body Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto py-12">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center shadow-glow-indigo">
                <Logo size={42} showWordmark={false} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">How can Flashback help you debug today?</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ask any Hardware, Embedded Firmware, or Software question. Past team incident records in your Hindsight bank will be recalled to ground the solution.
                </p>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-2 gap-3 w-full text-left font-mono text-xs">
                <button
                  onClick={() => setInputQuery("I2C bus hangs returning HAL_BUSY. SDA line stuck LOW after soft reset.")}
                  className="p-3 rounded-xl bg-surface border border-surface-border hover:border-brand-cyan text-gray-300 hover:text-white transition-all space-y-1"
                >
                  <div className="font-bold text-brand-cyan">⚡ Hardware / Firmware</div>
                  <div className="text-[11px] text-gray-400">STM32 I2C SDA Bus Lockup Fix</div>
                </button>
                <button
                  onClick={() => setInputQuery("Python asyncio event loop deadlocks when handling telemetry HTTP POST requests.")}
                  className="p-3 rounded-xl bg-surface border border-surface-border hover:border-brand-indigo text-gray-300 hover:text-white transition-all space-y-1"
                >
                  <div className="font-bold text-brand-indigo">⚡ Software Stack</div>
                  <div className="text-[11px] text-gray-400">Python Asyncio Deadlock Diagnostic</div>
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex flex-col space-y-2 max-w-4xl mx-auto ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm shadow-xl space-y-3 ${
                    msg.role === "user"
                      ? "bg-brand-indigo/30 border border-brand-indigo/50 text-white max-w-[85%]"
                      : "bg-[#10101C] border border-surface-border text-gray-200 w-full"
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border/50 text-xs font-mono">
                    <span className="font-bold text-brand-cyan flex items-center gap-1.5">
                      {msg.role === "user" ? (
                        <span>ENGINEER PROMPT</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                          <span>FLASHBACK AGENT</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="prose prose-invert prose-xs leading-relaxed whitespace-pre-wrap font-mono text-xs">
                    {msg.content}
                  </div>

                  {/* Attachments rendering */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {msg.attachments.map((att: any, aIdx: number) => (
                        <div key={aIdx} className="px-2.5 py-1 rounded bg-surface border border-surface-border text-[11px] font-mono text-brand-cyan flex items-center gap-1">
                          <FileCode className="w-3 h-3" />
                          <span>{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assistant Message Actions Footer */}
                  {msg.role === "assistant" && (
                    <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleCopy(msg.content)} className="hover:text-white flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                        <button
                          onClick={() => setMarkSolvedOpen(true)}
                          className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Solved
                        </button>
                      </div>

                      {msg.incidentsUsed && msg.incidentsUsed.length > 0 && (
                        <div className="text-brand-cyan text-[10px]">
                          Recalled Ticket {msg.incidentsUsed[0].id}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/60 border border-surface-border max-w-xl mx-auto text-xs font-mono text-brand-cyan">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Hindsight Vector Search &amp; Groq LPU Streaming...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer Input Bar */}
        <div className="p-4 bg-[#0E0E18] border-t border-surface-border">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Attachment preview chips */}
            {attachments.length > 0 && (
              <div className="flex items-center gap-2">
                {attachments.map((att, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded bg-surface border border-surface-border text-xs text-brand-cyan flex items-center gap-1 font-mono">
                    <FileText className="w-3 h-3" />
                    <span>{att.name}</span>
                    <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}>
                      <X className="w-3 h-3 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-end gap-2">
              <div className="flex-1 bg-[#05050A] border border-surface-border focus-within:border-brand-indigo rounded-2xl p-2 relative">
                <textarea
                  rows={2}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe bug symptom, paste log snippet, or ask a question (Enter to send, Shift+Enter for new line)..."
                  className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none resize-none font-mono p-1"
                />

                <div className="flex items-center justify-between pt-1 border-t border-surface-border/40 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-surface"
                      title="Attach code or log file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".txt,.log,.c,.cpp,.py,.js,.ts"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setCalculatorOpen(true)}
                      className="p-1 rounded text-gray-400 hover:text-brand-cyan hover:bg-surface flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Calculator className="w-4 h-4 text-brand-cyan" />
                      <span>Calculators</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-gray-500 font-mono">Shift+Enter = Newline</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (!inputQuery.trim() && attachments.length === 0)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white shadow-glow-indigo disabled:opacity-50 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR (Collapsible Memory Panel) */}
      {memoryPanelOpen && (
        <aside className="w-80 bg-[#0C0C16] border-l border-surface-border p-4 flex flex-col justify-between shrink-0 overflow-y-auto z-20 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-xs font-bold font-mono text-white">Hindsight Memory Recall</h3>
              </div>
              <button onClick={() => setMemoryPanelOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeIncidentForSolve ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[10px]">
                  <span className="text-brand-cyan font-bold">{activeIncidentForSolve.id}</span>
                  <span className="text-emerald-400">{activeIncidentForSolve.confidence || 96}% Match</span>
                </div>

                <h4 className="font-bold text-white leading-snug">{activeIncidentForSolve.title}</h4>

                <div className="p-2.5 rounded-lg bg-[#05050A] border border-surface-border space-y-1 text-[11px]">
                  <div className="text-gray-500 text-[10px]">ROOT CAUSE</div>
                  <div className="text-gray-300">{activeIncidentForSolve.rootCause}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 space-y-1 text-[11px]">
                  <div className="text-emerald-400 text-[10px] font-bold">PROVEN FIX</div>
                  <div className="text-emerald-200">{activeIncidentForSolve.fixDetails}</div>
                </div>

                <button
                  onClick={() => setMarkSolvedOpen(true)}
                  className="w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30 text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Solved &amp; Retain</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-8 font-mono">
                Ask a debugging question to trigger Hindsight vector recall from your memory bank.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-surface-border">
            <Link
              href="/memory"
              className="w-full py-2 rounded-xl bg-surface border border-surface-border text-gray-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              <span>Manage Memory Bank</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      )}

      {/* Embedded Calculators Modal */}
      <EmbeddedCalculatorsModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        onInsertCode={(snippet) => setInputQuery((prev) => prev + "\n" + snippet)}
      />

      {/* Mark as Solved Modal */}
      <MarkAsSolvedModal
        isOpen={markSolvedOpen}
        onClose={() => setMarkSolvedOpen(false)}
        initialSymptom={messages.slice(-2)[0]?.content || ""}
        initialRootCause={activeIncidentForSolve?.rootCause || ""}
        initialFixDetails={activeIncidentForSolve?.fixDetails || ""}
        conversationId={activeConvId || undefined}
        onSuccess={() => alert("Memory successfully retained into Hindsight Bank!")}
      />
    </div>
  );
}
