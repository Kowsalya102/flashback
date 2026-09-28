"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Send, Square, Paperclip, Calculator, Database, X, FileText, ChevronUp, Image as ImageIcon } from "lucide-react";

interface Props {
  onSend: (query: string, domain: string, attachments: any[]) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  memoryEnabled: boolean;
  onToggleMemory: () => void;
  selectedDomain: string;
  onChangeDomain: (domain: string) => void;
  onOpenCalculators: () => void;
  onEditLastMessage?: () => void;
}

export const AppComposer: React.FC<Props> = ({
  onSend,
  onStop,
  isGenerating = false,
  memoryEnabled,
  onToggleMemory,
  selectedDomain,
  onChangeDomain,
  onOpenCalculators,
  onEditLastMessage,
}) => {
  const [query, setQuery] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [domainMenuOpen, setDomainMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [query]);

  // Handle Pasting Large Logs (Auto-convert to attachment chip)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (text && text.length > 800) {
      e.preventDefault();
      setAttachments((prev) => [
        ...prev,
        {
          name: `Pasted_Log_${new Date().toLocaleTimeString().replace(/:/g, "-")}.log`,
          size: text.length,
          type: "text/plain",
          content: text,
        },
      ]);
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

  const handleSubmit = () => {
    if (!query.trim() && attachments.length === 0) return;
    if (isGenerating) {
      if (onStop) onStop();
      return;
    }

    onSend(query, selectedDomain, attachments);
    setQuery("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
          handleFileUpload({ target: { files: e.dataTransfer.files } } as any);
        }
      }}
      className="p-3 sm:p-4 bg-transparent border-t-0 shrink-0 relative max-w-3xl mx-auto w-full z-10"
    >
      {/* Drag & Drop Full Area Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#6366F1]/20 border-2 border-dashed border-[#06B6D4] rounded-2xl flex items-center justify-center backdrop-blur-md z-30 font-mono text-xs text-white">
          Drop log files, schematics, or source code here to attach
        </div>
      )}

      <div className="bg-[#11111A] border border-[#232332] focus-within:border-[#6366F1] rounded-2xl shadow-2xl p-3 space-y-2 relative transition-all">
        {/* Attachments Preview Chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-1 border-b border-[#232332]">
            {attachments.map((att, idx) => (
              <div key={idx} className="px-2.5 py-1 rounded-lg bg-[#181824] border border-[#232332] text-xs font-mono text-[#06B6D4] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">{att.name}</span>
                <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}>
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            } else if (e.key === "ArrowUp" && !query && onEditLastMessage) {
              onEditLastMessage();
            }
          }}
          placeholder="Ask a debug question or paste logs (Enter to send, Shift+Enter for newline)..."
          className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none resize-none font-mono py-1 max-h-48"
        />

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1C1C29] text-xs font-mono">
          <div className="flex items-center gap-2">
            {/* File Attachment (+) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#181824] transition-colors"
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

            {/* Domain Selector Popover Chip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDomainMenuOpen(!domainMenuOpen)}
                className="px-2.5 py-1 rounded-lg bg-[#181824] border border-[#232332] text-[11px] text-gray-300 hover:text-white flex items-center gap-1 font-bold"
              >
                <span>{selectedDomain}</span>
                <ChevronUp className="w-3 h-3 text-gray-400" />
              </button>

              {domainMenuOpen && (
                <div className="absolute bottom-8 left-0 w-36 rounded-xl bg-[#151522] border border-[#232332] shadow-2xl p-1 z-30 space-y-0.5">
                  {["Auto-detect", "Hardware", "Firmware", "Software"].map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => {
                        onChangeDomain(dom);
                        setDomainMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                        selectedDomain === dom ? "bg-[#6366F1] text-white font-bold" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {dom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Engineering Calculators Trigger */}
            <button
              type="button"
              onClick={onOpenCalculators}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#06B6D4] hover:bg-[#181824] transition-colors flex items-center gap-1 text-[11px]"
              title="Embedded Calculators & Log Analyzer"
            >
              <Calculator className="w-4 h-4 text-[#06B6D4]" />
              <span className="hidden sm:inline">Calculators</span>
            </button>
          </div>

          {/* Right Controls: Memory Pill + Circular Send/Stop Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleMemory}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                memoryEnabled ? "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30" : "bg-red-950/20 text-red-400 border-red-800/30"
              }`}
              title="Memory recall toggle"
            >
              {memoryEnabled ? "Mem ON" : "Mem OFF"}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className={`p-2 rounded-full text-white shadow-glow-indigo transition-all ${
                isGenerating ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:scale-105"
              }`}
            >
              {isGenerating ? <Square className="w-3.5 h-3.5 fill-white" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Helper Disclaimer Text */}
      <div className="text-center text-[10px] text-gray-500 font-mono mt-2">
        Flashback can make mistakes. Verify against datasheets, and be careful with mains voltage and batteries.
      </div>
    </div>
  );
};
