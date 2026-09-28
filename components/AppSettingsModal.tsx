"use client";

import React, { useState } from "react";
import { X, User, Database, ShieldCheck, Activity, Trash2, Key, Sun, Moon, Laptop, CheckCircle2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdateUser?: (updated: any) => void;
}

export const AppSettingsModal: React.FC<Props> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"general" | "memory" | "privacy" | "usage" | "account" | "shortcuts">("general");
  const [name, setName] = useState(user?.name || "");
  const [memoryEnabled, setMemoryEnabled] = useState(user?.memoryEnabled ?? true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memoryEnabled }),
      });
      if (res.ok) {
        setSaved(true);
        if (onUpdateUser) onUpdateUser({ ...user, name, memoryEnabled });
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account and clear all stored conversation history?")) {
      await fetch("/api/user/account", { method: "DELETE" });
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#11111A] border border-[#232332] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[540px]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#232332] flex items-center justify-between bg-[#151522]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#06B6D4]" /> Settings
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout: Left Tab Sidebar + Right Tab Body */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-48 border-r border-[#232332] p-3 space-y-1 bg-[#0D0D14] text-xs font-mono">
            {[
              { id: "general", label: "General", icon: User },
              { id: "memory", label: "Hindsight Memory", icon: Database },
              { id: "usage", label: "Usage Limits", icon: Activity },
              { id: "shortcuts", label: "Keyboard Shortcuts", icon: Key },
              { id: "account", label: "Account & Security", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                    activeTab === tab.id ? "bg-[#6366F1]/20 text-white font-bold border border-[#6366F1]/40" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#06B6D4]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-6 text-gray-200">
            {saved && (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Settings updated successfully.</span>
              </div>
            )}

            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">General Preferences</h3>
                <div className="space-y-1">
                  <label className="text-gray-400 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181824] border border-[#232332] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 block">Appearance Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dark", label: "Dark (Default)", icon: Moon },
                      { id: "light", label: "Light", icon: Sun },
                      { id: "system", label: "System", icon: Laptop },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as any)}
                          className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                            theme === t.id ? "border-[#06B6D4] bg-[#06B6D4]/10 text-white font-bold" : "border-[#232332] text-gray-400"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-[11px]">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-[#6366F1] text-white font-bold shadow-glow-indigo">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === "memory" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Hindsight Vector Memory</h3>
                <div className="p-4 rounded-xl bg-[#181824] border border-[#232332] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Global Memory Retention</div>
                    <div className="text-[11px] text-gray-400">Automatically recall past tickets &amp; retain resolved solutions</div>
                  </div>
                  <button
                    onClick={() => setMemoryEnabled(!memoryEnabled)}
                    className={`px-3 py-1.5 rounded-lg font-bold ${memoryEnabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400"}`}
                  >
                    {memoryEnabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
                <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-[#6366F1] text-white font-bold">
                  Save Memory Preference
                </button>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Daily Usage &amp; Rate Limits</h3>
                <div className="p-4 rounded-xl bg-[#181824] border border-[#232332] space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Groq LLM Queries Today:</span>
                    <span className="text-white font-bold">14 / 500 Queries</span>
                  </div>
                  <div className="w-full bg-[#232332] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] h-full w-[3%]" />
                  </div>
                  <div className="text-[10px] text-gray-500">Resets daily at 00:00 UTC</div>
                </div>
              </div>
            )}

            {activeTab === "shortcuts" && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between p-2 rounded bg-[#181824]">
                    <span>Open Command Palette</span>
                    <kbd className="px-2 py-0.5 rounded bg-[#232332] text-gray-300">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#181824]">
                    <span>New Debug Session</span>
                    <kbd className="px-2 py-0.5 rounded bg-[#232332] text-gray-300">Ctrl + Shift + O</kbd>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#181824]">
                    <span>Toggle Left Sidebar</span>
                    <kbd className="px-2 py-0.5 rounded bg-[#232332] text-gray-300">Ctrl + B</kbd>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Account Security</h3>
                <div className="p-4 rounded-xl bg-[#181824] border border-[#232332] space-y-1">
                  <div className="text-gray-400">Account Email:</div>
                  <div className="text-white font-bold">{user?.email || "Guest User"}</div>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl bg-red-950/30 border border-red-800/50 text-red-400 font-bold hover:bg-red-900/40"
                >
                  Delete Account &amp; Wipe History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
