"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Database, X, ChevronRight, User, CheckCircle2, FileCode, Tag } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recalledIncidents: any[];
  userProfile?: any;
  onOpenMarkSolved: () => void;
}

export const RightMemoryPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  recalledIncidents = [],
  userProfile,
  onOpenMarkSolved,
}) => {
  const [activeTab, setActiveTab] = useState<"recalled" | "profile" | "session">("recalled");

  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-[#0C0C14] border-l border-[#232332] flex flex-col justify-between shrink-0 h-full overflow-hidden z-20 font-mono text-xs text-gray-200">
      <div className="space-y-4 p-4 flex-1 min-h-0 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232332]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#06B6D4]" />
            <h3 className="font-bold text-white">Hindsight Memory</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-[#11111A] p-1 rounded-xl border border-[#232332] text-[11px]">
          <button
            onClick={() => setActiveTab("recalled")}
            className={`flex-1 py-1 rounded-lg text-center transition-all ${
              activeTab === "recalled" ? "bg-[#6366F1] text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Recalled ({recalledIncidents.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-1 rounded-lg text-center transition-all ${
              activeTab === "profile" ? "bg-[#6366F1] text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Profile
          </button>
        </div>

        {/* TAB 1: RECALLED MEMORIES */}
        {activeTab === "recalled" && (
          <div className="space-y-3">
            {recalledIncidents.length > 0 ? (
              recalledIncidents.map((inc: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-[#11111A] border border-[#232332] space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#06B6D4] font-bold">{inc.id}</span>
                    <span className="text-emerald-400 font-bold">{inc.confidence || 96}% Match</span>
                  </div>

                  <div className="font-bold text-white leading-snug">{inc.title}</div>

                  <div className="p-2 rounded bg-[#070712] border border-[#232332] text-[11px] text-gray-300">
                    <span className="text-[10px] text-gray-500 block">ROOT CAUSE</span>
                    <p>{inc.rootCause}</p>
                  </div>

                  <div className="p-2 rounded bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-200">
                    <span className="text-[10px] text-emerald-400 font-bold block">PROVEN FIX</span>
                    <p>{inc.fixDetails}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-[11px]">
                No vector memories recalled for current message turn yet.
              </div>
            )}

            <button
              onClick={onOpenMarkSolved}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30 text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Solved &amp; Retain</span>
            </button>
          </div>
        )}

        {/* TAB 2: LEARNED USER PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#11111A] border border-[#232332] space-y-2">
              <div className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#06B6D4]" /> Learned Hardware &amp; MCUs
              </div>
              <div className="flex flex-wrap gap-1">
                {(userProfile?.mcus || ["STM32F4", "ESP32-S3", "nRF52840"]).map((mcu: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#181824] border border-[#232332] text-white text-[10px]">
                    {mcu}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#11111A] border border-[#232332] space-y-2">
              <div className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-[#06B6D4]" /> Learned Stack &amp; Tools
              </div>
              <div className="flex flex-wrap gap-1">
                {(userProfile?.tools || ["Logic Analyzer", "Oscilloscope", "FreeRTOS", "Python"]).map((tool: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#181824] border border-[#232332] text-gray-300 text-[10px]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#232332] shrink-0">
        <Link
          href="/memory"
          className="w-full py-2.5 rounded-xl bg-[#151522] border border-[#232332] text-gray-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <span>Open Full Memory Bank</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
};
