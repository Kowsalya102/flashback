"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Github, Menu, X, Sparkles, User, Settings, Database, LogOut, Code } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "App", href: "/app", badge: "Live" },
    { name: "Public Sandbox", href: "/demo" },
    { name: "Timeline", href: "/timeline" },
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
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-white bg-brand-indigo/30 border border-brand-indigo/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs / User Auth Menu */}
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

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:border-brand-indigo text-xs text-white transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan flex items-center justify-center font-bold text-[10px]">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0E0E18] border border-surface-border shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-surface-border font-mono text-[11px] text-gray-400">
                      <div className="text-white font-bold truncate">{user.name}</div>
                      <div className="text-gray-500 truncate">{user.email}</div>
                    </div>

                    <Link
                      href="/app"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Flashback App</span>
                    </Link>

                    <Link
                      href="/memory"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-brand-indigo" />
                      <span>Memory Bank</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-surface-hover transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-400" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg font-medium text-xs text-white bg-gradient-to-r from-brand-indigo to-brand-cyan shadow-glow-indigo hover:shadow-glow-cyan transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

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
              {user ? (
                <>
                  <Link
                    href="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-lg font-medium text-white bg-gradient-to-r from-brand-indigo to-brand-cyan flex items-center justify-center gap-2"
                  >
                    <span>Launch Flashback App</span>
                  </Link>
                  <Link
                    href="/memory"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm text-gray-300 bg-surface border border-surface-border"
                  >
                    Memory Bank
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-lg font-medium text-white bg-gradient-to-r from-brand-indigo to-brand-cyan flex items-center justify-center gap-2"
                  >
                    <span>Sign Up Free</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm text-gray-300 bg-surface border border-surface-border"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
