"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Github, Menu, X, Cpu, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Live Demo", href: "/demo", badge: "Interactive" },
    { name: "Memory Timeline", href: "/timeline" },
    { name: "Team", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0F]/85 backdrop-blur-md border-b border-surface-border py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <Logo size={36} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface/60 backdrop-blur-md border border-surface-border px-4 py-1.5 rounded-full shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-white bg-brand-indigo/30 border border-brand-indigo/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/Kowshik-11/Flashback"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover border border-transparent hover:border-surface-border transition-all"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            <Link
              href="/demo"
              className="relative group overflow-hidden px-4 py-2 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Try Live Demo</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white bg-surface border border-surface-border"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-surface-border px-4 pt-4 pb-6 mt-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? "text-white bg-brand-indigo/20 border border-brand-indigo/40"
                      : "text-gray-300 hover:bg-surface-hover"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-surface-border flex flex-col gap-3">
              <Link
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-lg font-medium text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch Interactive Demo</span>
              </Link>

              <a
                href="https://github.com/Kowshik-11/Flashback"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-gray-300 bg-surface border border-surface-border flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
