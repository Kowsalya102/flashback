"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border-surface-border shadow-2xl relative">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size={42} showWordmark={false} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset your password</h2>
          <p className="text-xs text-gray-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs space-y-2 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="font-bold">Password Reset Dispatched</div>
            <p className="text-gray-300 text-[11px]">
              If an account with {email} exists, check your inbox for reset instructions.
            </p>
            <Link href="/login" className="inline-block mt-2 text-brand-cyan hover:underline font-bold">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300">Account Email</label>
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

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
