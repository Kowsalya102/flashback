"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Github, ExternalLink, Cpu, Database, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/app") || pathname?.startsWith("/chat")) {
    return null;
  }

  return (
    <footer className="border-t border-surface-border bg-[#07070B] text-gray-400 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-indigo/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-surface-border">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Logo size={36} />
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              "The debugging assistant that never forgets a fix."
            </p>
            <p className="text-xs text-gray-500 max-w-md">
              Flashback provides embedded and firmware engineering teams with persistent vector memory of every past hardware, protocol, and driver bug incident ever solved.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home / Overview
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Live Demo</span>
                  <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-mono">PROD</span>
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-white transition-colors">
                  Memory Timeline
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Team & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology & Attribution */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Powered By
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://hindsight.vectorize.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-brand-cyan hover:text-white transition-colors font-medium"
                >
                  <Database className="w-4 h-4" />
                  <span>Hindsight Memory API</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>
                <p className="text-[11px] text-gray-500 mt-0.5">Persistent Vector Memory by Vectorize</p>
              </li>
              <li>
                <a
                  href="https://groq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Cpu className="w-4 h-4 text-brand-indigo" />
                  <span>Groq LPU Engine</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Kowsalya102/Flashback"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Flashback Systems. Built for embedded engineers.
          </div>
          <div className="flex items-center gap-4">
            <span>Core Team: Elena Vance, Marcus Brody, Liam O'Connor, Siddharth Nair</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
