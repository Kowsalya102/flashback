"use client";

import React, { useState } from "react";
import { Database, CheckCircle2, Sparkles, Menu, Edit2, Check, MoreVertical } from "lucide-react";

interface Props {
  title: string;
  onRenameTitle?: (newTitle: string) => void;
  memoryEnabled: boolean;
  onToggleMemory: () => void;
  onOpenMarkSolved: () => void;
  onToggleMemoryPanel: () => void;
  onToggleSidebar: () => void;
}

export const AppTopBar: React.FC<Props> = ({
  title,
  onRenameTitle,
  memoryEnabled,
  onToggleMemory,
  onOpenMarkSolved,
  onToggleMemoryPanel,
  onToggleSidebar,
}) => {
  const [editing, setEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(title);

  const handleSaveTitle = () => {
    setEditing(false);
    if (onRenameTitle && titleInput.trim()) {
      onRenameTitle(titleInput);
    }
  };

  return (
    <div className="h-12 border-b border-[#232332] px-4 flex items-center justify-between bg-[#11111A]/80 backdrop-blur-md shrink-0 z-20 font-mono text-xs text-gray-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-lg bg-[#181824] border border-[#232332] text-gray-400 hover:text-white"
          title="Toggle Sidebar (Ctrl+B)"
        >
          <Menu className="w-4 h-4" />
        </button>

        {editing ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              className="bg-[#181824] border border-[#06B6D4] rounded px-2 py-0.5 text-white focus:outline-none"
            />
            <button onClick={handleSaveTitle} className="p-1 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 font-bold text-white hover:text-[#06B6D4] transition-colors truncate max-w-[280px] sm:max-w-md"
            title="Click to rename"
          >
            <span className="truncate">{title || "New Debug Session"}</span>
            <Edit2 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Memory Toggle */}
        <button
          onClick={onToggleMemory}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            memoryEnabled
              ? "bg-[#6366F1]/20 text-[#06B6D4] border border-[#06B6D4]/40"
              : "bg-red-950/20 text-red-400 border border-red-800/40"
          }`}
          title="Toggle Hindsight vector memory recall"
        >
          <span className={`w-2 h-2 rounded-full ${memoryEnabled ? "bg-[#06B6D4] animate-pulse" : "bg-red-500"}`} />
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{memoryEnabled ? "MEMORY ON" : "MEMORY OFF"}</span>
        </button>

        {/* Mark as Solved Button */}
        <button
          onClick={onOpenMarkSolved}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mark Solved</span>
        </button>

        {/* Toggle Right Memory Panel */}
        <button
          onClick={onToggleMemoryPanel}
          className="p-1.5 rounded-lg bg-[#181824] border border-[#232332] text-gray-400 hover:text-white"
          title="Toggle Right Memory Panel"
        >
          <Sparkles className="w-4 h-4 text-[#06B6D4]" />
        </button>
      </div>
    </div>
  );
};
