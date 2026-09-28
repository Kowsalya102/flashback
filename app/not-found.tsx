import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-mono text-xs text-gray-200">
      <div className="bg-[#11111A] border border-[#232332] p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center mx-auto text-[#06B6D4]">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white">404 — Page Not Found</h1>
          <p className="text-xs text-gray-400">
            The page you requested could not be located.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-2">
          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white font-bold text-xs shadow-glow-indigo flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Go to Flashback Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
