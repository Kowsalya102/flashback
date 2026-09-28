"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AppTopBar } from "./AppTopBar";
import { AppComposer } from "./AppComposer";
import { ChatMessageList } from "./ChatMessageList";
import { RightMemoryPanel } from "./RightMemoryPanel";
import { AppSettingsModal } from "./AppSettingsModal";
import { CommandPaletteModal } from "./CommandPaletteModal";
import { EmbeddedCalculatorsModal } from "./EmbeddedCalculatorsModal";
import { MarkAsSolvedModal } from "./MarkAsSolvedModal";
import { Logo } from "./Logo";
import {
  Plus,
  MessageSquare,
  Search,
  Pin,
  Trash2,
  Database,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Command,
  Sun,
  Moon
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "./ThemeProvider";

interface Props {
  initialConvId?: string;
}

function AppShellContent({ initialConvId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams ? searchParams.get("mode") === "guest" : false;

  const { theme, setTheme } = useTheme();

  // State
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("Auto-detect");
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recalledIncidents, setRecalledIncidents] = useState<any[]>([]);

  // Modals
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
  const [calculatorsOpen, setCalculatorsOpen] = useState<boolean>(false);
  const [markSolvedOpen, setMarkSolvedOpen] = useState<boolean>(false);
  const [msgForSolve, setMsgForSolve] = useState<any>(null);

  // Load User & Conversations
  useEffect(() => {
    if (isGuestMode) {
      setUser({ id: "guest", name: "Guest Engineer", email: "guest@sandbox.internal", hindsightBankId: "guest_sandbox" });
      setConversations([
        { id: "guest_conv_1", title: "STM32 & I2C Bus Lockup Diagnosis", domain: "Firmware", memoryEnabled: true },
        { id: "guest_conv_2", title: "Python Asyncio Telemetry Deadlock", domain: "Software", memoryEnabled: true },
      ]);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          loadConversations();
        } else {
          setUser(null);
        }
      });
  }, [isGuestMode]);

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
          setMemoryEnabled(data.conversation.memoryEnabled ?? true);
          setSelectedDomain(data.conversation.domain || "Auto-detect");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewChat = async () => {
    if (isGuestMode) {
      const newConv = {
        id: "guest_conv_" + Date.now(),
        title: "New Debug Session",
        domain: selectedDomain,
        memoryEnabled: true,
      };
      setConversations([newConv, ...conversations]);
      setActiveConvId(newConv.id);
      setMessages([]);
      return;
    }

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
    if (confirm("Delete this session?")) {
      if (!isGuestMode) {
        await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      }
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

  const handleSendMessage = async (queryText: string, domainText: string, attachments: any[]) => {
    let convId = activeConvId;
    if (!convId) {
      await handleNewChat();
      convId = activeConvId;
    }

    const tempMsg = {
      id: "usr_" + Date.now(),
      role: "user",
      content: queryText,
      attachments,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setIsGenerating(true);

    try {
      const res = await fetch(convId ? `/api/conversations/${convId}/messages` : "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          content: queryText,
          domain: domainText,
          withMemory: memoryEnabled,
        }),
      });

      const data = await res.json();

      const assistantMsg = data.assistantMessage || {
        id: "ast_" + Date.now(),
        role: "assistant",
        content: data.answer,
        incidentsUsed: data.incidentsUsed || [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.incidentsUsed) setRecalledIncidents(data.incidentsUsed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="flex h-screen h-[100dvh] bg-[#09090D] text-gray-200 overflow-hidden font-sans select-none">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-14"
        } transition-all duration-300 bg-[#0F0F17] border-r border-[#232332] flex flex-col justify-between overflow-hidden shrink-0 z-30`}
      >
        <div className="p-3 space-y-3 flex-1 min-h-0 flex flex-col">
          {/* Header & Logo */}
          <div className="flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={28} showWordmark={sidebarOpen} />
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#181824]"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-bold shadow-glow-indigo flex items-center justify-center gap-2 transition-all shrink-0 ${
              !sidebarOpen && "px-0"
            }`}
          >
            <Plus className="w-4 h-4" />
            {sidebarOpen && <span>New Chat</span>}
          </button>

          {/* Search Trigger */}
          {sidebarOpen && (
            <button
              onClick={() => setPaletteOpen(true)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#181824] border border-[#232332] text-xs font-mono text-gray-400 flex items-center justify-between hover:text-white shrink-0"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#06B6D4]" /> Search chats...
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#232332] text-[10px]">Ctrl+K</kbd>
            </button>
          )}

          {/* Conversations List */}
          {sidebarOpen && (
            <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="text-[10px] font-mono uppercase text-gray-500 px-2 py-1 font-bold">
                Recents
              </div>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`group flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    conv.id === activeConvId ? "bg-[#6366F1]/20 text-white border border-[#6366F1]/40 font-bold" : "text-gray-400 hover:text-white hover:bg-[#181824]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConv(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Account Block */}
        {sidebarOpen && (
          <div className="p-3 border-t border-[#232332] bg-[#0B0B12] flex items-center justify-between text-xs font-mono shrink-0">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4] flex items-center justify-center font-bold text-white text-[11px]">
                {user?.name ? user.name[0].toUpperCase() : "G"}
              </div>
              <div className="truncate">
                <div className="text-white font-bold truncate">{user?.name || "Guest User"}</div>
                <div className="text-gray-500 text-[10px] truncate">{user?.email || "sandbox mode"}</div>
              </div>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="p-1.5 text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* 2. MAIN AREA */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0 min-h-0 relative overflow-hidden bg-[#09090D]">
        {/* Slim Top Bar */}
        <AppTopBar
          title={currentConv?.title || "New Debug Session"}
          memoryEnabled={memoryEnabled}
          onToggleMemory={() => setMemoryEnabled(!memoryEnabled)}
          onOpenMarkSolved={() => setMarkSolvedOpen(true)}
          onToggleMemoryPanel={() => setMemoryPanelOpen(!memoryPanelOpen)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Messages List Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6">
          {messages.length === 0 ? (
            /* EMPTY STATE: Greeting & Suggested Prompts */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto py-12">
              <Logo size={48} showWordmark={false} />
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0] || "Engineer"}
                </h1>
                <p className="text-xs text-gray-400">
                  Ask any Hardware, Firmware, or Software question. Flashback will recall your team's past incident tickets.
                </p>
              </div>

              {/* 4 Suggested Prompt Cards */}
              <div className="grid grid-cols-2 gap-3 w-full text-left font-mono text-xs">
                <button
                  onClick={() => handleSendMessage("STM32 I2C1 bus hangs returning HAL_BUSY. SDA line stuck LOW.", "Firmware", [])}
                  className="p-3 rounded-xl bg-[#11111A] border border-[#232332] hover:border-[#06B6D4] text-gray-300 hover:text-white transition-all space-y-1"
                >
                  <div className="font-bold text-[#06B6D4]">⚡ Firmware</div>
                  <div className="text-[11px] text-gray-400">STM32 I2C SDA Bus Lockup</div>
                </button>
                <button
                  onClick={() => handleSendMessage("I2C bus fails at 400kHz Fast Mode with 10k pull-up resistors.", "Hardware", [])}
                  className="p-3 rounded-xl bg-[#11111A] border border-[#232332] hover:border-amber-400 text-gray-300 hover:text-white transition-all space-y-1"
                >
                  <div className="font-bold text-amber-400">⚡ Hardware</div>
                  <div className="text-[11px] text-gray-400">I2C Rise-Time Violation</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Python asyncio event loop deadlocks in MQTT telemetry handler.", "Software", [])}
                  className="p-3 rounded-xl bg-[#11111A] border border-[#232332] hover:border-[#6366F1] text-gray-300 hover:text-white transition-all space-y-1"
                >
                  <div className="font-bold text-[#6366F1]">⚡ Software</div>
                  <div className="text-[11px] text-gray-400">Python Asyncio Deadlock</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Recall all past brown-out reset incidents for STM32H7.", "Auto-detect", [])}
                  className="p-3 rounded-xl bg-[#11111A] border border-[#232332] hover:border-emerald-400 text-gray-300 hover:text-white transition-all space-y-1"
                >
                  <div className="font-bold text-emerald-400">⚡ History Recall</div>
                  <div className="text-[11px] text-gray-400">Recall Past BOR Incidents</div>
                </button>
              </div>
            </div>
          ) : (
            <ChatMessageList
              messages={messages}
              isGenerating={isGenerating}
              onCopyMsg={(text) => navigator.clipboard.writeText(text)}
              onRegenerateMsg={() => messages.length > 0 && handleSendMessage(messages[messages.length - 2]?.content || "", selectedDomain, [])}
              onSelectPromptSuggestion={(p) => handleSendMessage(p, selectedDomain, [])}
              onOpenMarkSolved={(msg) => { setMsgForSolve(msg); setMarkSolvedOpen(true); }}
            />
          )}
        </div>

        {/* Floating Composer */}
        <AppComposer
          onSend={handleSendMessage}
          isGenerating={isGenerating}
          memoryEnabled={memoryEnabled}
          onToggleMemory={() => setMemoryEnabled(!memoryEnabled)}
          selectedDomain={selectedDomain}
          onChangeDomain={setSelectedDomain}
          onOpenCalculators={() => setCalculatorsOpen(true)}
        />
      </div>

      {/* 3. RIGHT MEMORY PANEL */}
      <RightMemoryPanel
        isOpen={memoryPanelOpen}
        onClose={() => setMemoryPanelOpen(false)}
        recalledIncidents={recalledIncidents}
        userProfile={user?.userProfile}
        onOpenMarkSolved={() => setMarkSolvedOpen(true)}
      />

      {/* MODALS */}
      <AppSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUpdateUser={setUser}
      />

      <CommandPaletteModal
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        conversations={conversations}
        onSelectConv={selectConversation}
        onNewChat={handleNewChat}
        onOpenMemory={() => router.push("/memory")}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <EmbeddedCalculatorsModal
        isOpen={calculatorsOpen}
        onClose={() => setCalculatorsOpen(false)}
      />

      <MarkAsSolvedModal
        isOpen={markSolvedOpen}
        onClose={() => setMarkSolvedOpen(false)}
        initialSymptom={msgForSolve?.content || ""}
      />
    </div>
  );
}

export function AppShell(props: Props) {
  return (
    <Suspense fallback={<div className="h-screen bg-[#09090D] flex items-center justify-center font-mono text-xs text-[#06B6D4]">Loading App Shell...</div>}>
      <AppShellContent {...props} />
    </Suspense>
  );
}
