"use client";

import React, { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { AppShell } from "@/components/AppShell";

export default function RootPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#09090D] flex items-center justify-center font-mono text-xs text-[#06B6D4]">
        Loading Flashback...
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  return <AppShell />;
}
