"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Database, Tag, Sparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSymptom?: string;
  initialRootCause?: string;
  initialFixDetails?: string;
  conversationId?: string;
  onSuccess?: () => void;
}

export const MarkAsSolvedModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialSymptom = "",
  initialRootCause = "",
  initialFixDetails = "",
  conversationId,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialSymptom.slice(0, 40) || "Resolved Debug Incident");
  const [symptom, setSymptom] = useState(initialSymptom);
  const [domain, setDomain] = useState("Firmware");
  const [rootCause, setRootCause] = useState(initialRootCause);
  const [fixDetails, setFixDetails] = useState(initialFixDetails);
  const [tagsInput, setTagsInput] = useState("Resolved, Production-Fix");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          symptom,
          domain,
          rootCause,
          fixDetails,
          tags,
          conversationId,
        }),
      });

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D0D16] border border-surface-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Bar */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-[#12121E]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Mark Incident as Solved &amp; Retain</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs text-gray-200">
          <div className="p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 text-[11px] text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan shrink-0" />
            <span>Pre-filled from AI diagnosis. Confirm or edit details before vector indexing into Hindsight memory.</span>
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-bold">Incident Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#07070F] border border-surface-border rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-300 font-bold">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-[#07070F] border border-surface-border rounded-xl px-3 py-2 text-white"
              >
                <option value="Hardware">Hardware</option>
                <option value="Firmware">Firmware</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-bold">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-[#07070F] border border-surface-border rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-bold">Symptom Description</label>
            <textarea
              rows={2}
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full bg-[#07070F] border border-surface-border rounded-xl p-3 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-brand-cyan font-bold">Confirmed Root Cause</label>
            <textarea
              rows={2}
              required
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full bg-[#07070F] border border-brand-cyan/30 rounded-xl p-3 text-cyan-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-emerald-400 font-bold">Proven Solution &amp; Fix</label>
            <textarea
              rows={3}
              required
              value={fixDetails}
              onChange={(e) => setFixDetails(e.target.value)}
              className="w-full bg-[#07070F] border border-emerald-800/40 rounded-xl p-3 text-emerald-200"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold shadow-glow-indigo flex items-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              <span>{loading ? "Retaining Memory..." : "Confirm & Save Memory"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
