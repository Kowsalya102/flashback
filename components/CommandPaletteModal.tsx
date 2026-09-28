"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Database, Settings, Moon, Sun, X, MessageSquare } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  conversations: any[];
  onSelectConv: (id: string) => void;
  onNewChat: () => void;
  onOpenMemory: () => void;
  onOpenSettings: () => void;
}

export const CommandPaletteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  conversations,
  onSelectConv,
  onNewChat,
  onOpenMemory,
  onOpenSettings,
}) => {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#11111A] border border-[#232332] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-gray-200 animate-in fade-in duration-150">
        {/* Search Bar */}
        <div className="p-3 border-b border-[#232332] flex items-center gap-2 bg-[#151522]">
          <Search className="w-4 h-4 text-[#06B6D4]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search debug sessions (e.g., I2C, new chat)..."
            className="flex-1 bg-transparent border-0 text-xs text-white placeholder-gray-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="text-[10px] text-gray-500 px-2 py-1 uppercase font-bold">Quick Actions</div>
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full text-left p-2 rounded-xl hover:bg-[#181824] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2 text-white">
              <Plus className="w-4 h-4 text-[#6366F1]" />
              <span>Start New Debug Session</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#232332] text-[10px] text-gray-400">Ctrl+Shift+O</kbd>
          </button>

          <button
            onClick={() => {
              onOpenMemory();
              onClose();
            }}
            className="w-full text-left p-2 rounded-xl hover:bg-[#181824] flex items-center gap-2 text-white transition-colors"
          >
            <Database className="w-4 h-4 text-[#06B6D4]" />
            <span>Open Hindsight Memory Bank</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full text-left p-2 rounded-xl hover:bg-[#181824] flex items-center gap-2 text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Open App Settings</span>
          </button>

          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              onClose();
            }}
            className="w-full text-left p-2 rounded-xl hover:bg-[#181824] flex items-center gap-2 text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#6366F1]" />}
            <span>Toggle Theme ({theme === "dark" ? "Switch to Light" : "Switch to Dark"})</span>
          </button>

          {/* Conversations Matching Query */}
          {filteredConvs.length > 0 && (
            <>
              <div className="text-[10px] text-gray-500 px-2 pt-2 uppercase font-bold">Matching Sessions</div>
              {filteredConvs.slice(0, 5).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    onSelectConv(conv.id);
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#181824] flex items-center gap-2 text-gray-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#06B6D4]" />
                  <span className="truncate">{conv.title}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
