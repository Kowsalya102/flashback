"use client";

import React, { useState, useRef } from "react";
import { Logo } from "./Logo";
import {
  Copy,
  Check,
  RefreshCw,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  Database,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode,
  ArrowDown,
  Sparkles,
  Zap,
  ShieldAlert
} from "lucide-react";

interface Props {
  messages: any[];
  isGenerating?: boolean;
  onCopyMsg: (text: string) => void;
  onRegenerateMsg?: () => void;
  onEditMsg?: (msg: any) => void;
  onSelectPromptSuggestion?: (prompt: string) => void;
  onOpenMarkSolved?: (msg: any) => void;
}

export const ChatMessageList: React.FC<Props> = ({
  messages,
  isGenerating = false,
  onCopyMsg,
  onRegenerateMsg,
  onEditMsg,
  onSelectPromptSuggestion,
  onOpenMarkSolved,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRecalls, setExpandedRecalls] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});

  const handleCopy = (id: string, text: string) => {
    onCopyMsg(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRecallExpand = (id: string) => {
    setExpandedRecalls((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-[760px] mx-auto w-full font-sans text-sm text-gray-200 py-4">
      {messages.map((msg, idx) => {
        const isUser = msg.role === "user";
        const isLastAssistant = !isUser && idx === messages.length - 1;

        return (
          <div key={msg.id || idx} className="space-y-3 group">
            {/* User Message */}
            {isUser ? (
              <div className="flex justify-end">
                <div className="bg-[#181824] border border-[#232332] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] text-xs sm:text-sm font-mono shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="text-[#06B6D4] font-bold">YOU</span>
                    <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}</span>
                  </div>

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.attachments.map((att: any, aIdx: number) => (
                        <div key={aIdx} className="px-2 py-0.5 rounded bg-[#232332] text-[10px] text-[#06B6D4] flex items-center gap-1 font-mono">
                          <FileCode className="w-3 h-3" />
                          <span>{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center justify-end gap-2 text-[11px] pt-1 text-gray-400">
                    <button onClick={() => onEditMsg && onEditMsg(msg)} className="hover:text-white flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleCopy(msg.id, msg.content)} className="hover:text-white flex items-center gap-1">
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Assistant Message: Plain Rich Text (No Bubble, Claude Style) */
              <div className="flex items-start gap-3 w-full">
                {/* Flashback Avatar Mark */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center shrink-0 mt-1 shadow-glow-indigo">
                  <Logo size={20} showWordmark={false} />
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  {/* Tool Step Rows & Inline Memory Recall Chip */}
                  {msg.incidentsUsed && msg.incidentsUsed.length > 0 && (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleRecallExpand(msg.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] text-xs font-mono font-bold hover:bg-[#06B6D4]/20 transition-all"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Recalled {msg.incidentsUsed.length} Memories</span>
                        {expandedRecalls[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {/* Expanded Recalled Items */}
                      {expandedRecalls[msg.id] && (
                        <div className="p-3 rounded-xl bg-[#11111A] border border-[#232332] space-y-2 text-xs font-mono animate-in fade-in duration-150">
                          {msg.incidentsUsed.map((inc: any, iIdx: number) => (
                            <div key={iIdx} className="p-2 rounded bg-[#181824] border border-[#232332] space-y-1">
                              <div className="flex justify-between text-[#06B6D4] font-bold text-[11px]">
                                <span>{inc.id}: {inc.title}</span>
                                <span>{inc.confidence || 96}% Match</span>
                              </div>
                              <div className="text-[11px] text-gray-400">{inc.rootCause}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Rich Text Content */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap text-gray-200">
                    {msg.content}
                  </div>

                  {/* Message Action Footer Toolbar */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center justify-between text-xs font-mono text-gray-400 pt-1 border-t border-[#1C1C29]">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleCopy(msg.id, msg.content)} className="hover:text-white flex items-center gap-1">
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>

                      {onRegenerateMsg && (
                        <button onClick={onRegenerateMsg} className="hover:text-white flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" /> Regenerate
                        </button>
                      )}

                      {onOpenMarkSolved && (
                        <button onClick={() => onOpenMarkSolved(msg)} className="text-emerald-400 hover:underline font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Solved
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFeedback({ ...feedback, [msg.id]: "up" })}
                        className={`p-1 hover:text-white ${feedback[msg.id] === "up" ? "text-emerald-400" : ""}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFeedback({ ...feedback, [msg.id]: "down" })}
                        className={`p-1 hover:text-white ${feedback[msg.id] === "down" ? "text-red-400" : ""}`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Follow-Up Prompt Suggestions */}
                  {isLastAssistant && !isGenerating && (
                    <div className="pt-3 flex flex-wrap gap-2 text-xs font-mono">
                      {[
                        "How do I test this fix step-by-step?",
                        "What datasheet registers should I check?",
                        "How can I prevent this in CI testing?",
                      ].map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => onSelectPromptSuggestion && onSelectPromptSuggestion(prompt)}
                          className="px-3 py-1.5 rounded-xl bg-[#151522] border border-[#232332] text-gray-300 hover:text-white hover:border-[#6366F1] transition-all text-left"
                        >
                          💡 {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Streaming Shimmer Indicator */}
      {isGenerating && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#11111A] border border-[#232332] text-xs font-mono text-[#06B6D4] animate-pulse">
          <Logo size={20} showWordmark={false} />
          <span>Recalling memories &amp; generating grounded diagnostic...</span>
        </div>
      )}
    </div>
  );
};
