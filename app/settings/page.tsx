"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Database,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Save,
  Key
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [skillLevel, setSkillLevel] = useState<string>("Senior");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setMemoryEnabled(data.user.memoryEnabled ?? true);
          if (data.user.userProfile) {
            setSkillLevel(data.user.userProfile.skillLevel || "Senior");
          }
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          memoryEnabled,
          skillLevel,
        }),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? All stored conversation history and memories will be permanently wiped.")) {
      await fetch("/api/user/account", { method: "DELETE" });
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs font-mono text-brand-cyan">
        Loading user profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass-panel rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-gray-400">Please sign in to manage your profile and memory retention settings.</p>
        <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl bg-brand-indigo text-white text-xs font-bold shadow-glow-indigo">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Account &amp; Memory Settings</h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your personal profile, Hindsight memory retention preferences, and account privacy.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-brand-cyan" />
            Engineer Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-gray-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0B0B14] border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <label className="text-gray-300">Experience Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full bg-[#0B0B14] border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-indigo"
            >
              <option value="Junior">Junior Engineer (0-2 yrs)</option>
              <option value="Mid">Mid-Level Engineer (3-5 yrs)</option>
              <option value="Senior">Senior Engineer (6-10 yrs)</option>
              <option value="Principal">Principal / Tech Lead (10+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Hindsight Memory Preferences Card */}
        <div className="glass-panel p-6 rounded-2xl border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-cyan" />
              Hindsight Vector Memory Settings
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
              Bank ID: {user.hindsightBankId}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0B14] border border-surface-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Global Memory Retention</div>
              <p className="text-[11px] text-gray-400">
                Automatically vector recall and store resolved debug sessions in your personal Hindsight memory bank.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMemoryEnabled(!memoryEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                memoryEnabled
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {memoryEnabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
              <span>{memoryEnabled ? "ENABLED" : "DISABLED"}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl text-xs font-medium text-red-400 bg-red-950/20 border border-red-800/40 hover:bg-red-900/30 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </form>
    </div>
  );
}
