"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ArrowRight, Lock, Mail, AlertTriangle, Github } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      const urlError = searchParams.get("error");
      if (urlError) {
        setError(urlError);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/app");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border-surface-border shadow-2xl relative">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size={42} showWordmark={false} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome back to Flashback</h2>
          <p className="text-xs text-gray-400">
            Sign in to access your persistent Hindsight memory bank.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@firmware-co.com"
                className="w-full bg-[#0B0B14] border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-indigo font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-gray-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-brand-cyan hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B0B14] border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-indigo font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo hover:shadow-glow-cyan disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Signing in..." : "Sign In to Flashback"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OAuth Dividers */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-border" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-[#12121A] px-2 text-gray-500">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = "/api/auth/google")}
            className="py-2.5 px-3 rounded-xl bg-surface border border-surface-border text-xs text-gray-300 hover:text-white hover:bg-surface-hover flex items-center justify-center gap-2 font-mono"
          >
            <span>🌐 Google OAuth</span>
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = "/api/auth/github")}
            className="py-2.5 px-3 rounded-xl bg-surface border border-surface-border text-xs text-gray-300 hover:text-white hover:bg-surface-hover flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" /> GitHub OAuth
          </button>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-surface-border">
          <Link href="/app?mode=guest" className="text-brand-cyan hover:underline font-mono">
            ⚡ Try without an account
          </Link>
          <button
            type="button"
            onClick={() => {
              setEmail("engineer@demo.internal");
              setPassword("demo123456");
            }}
            className="text-gray-400 hover:text-white underline font-mono text-[11px]"
          >
            Quick Demo Fill
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-brand-cyan hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs font-mono text-brand-cyan">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
