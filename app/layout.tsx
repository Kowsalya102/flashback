import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Flashback — The Debugging Assistant That Never Forgets a Fix",
  description: "Flashback gives firmware and embedded engineering teams persistent vector memory of past debugging incidents, powered by Hindsight Cloud and Groq.",
  keywords: [
    "Firmware Debugging",
    "Embedded Systems",
    "AI Agent Memory",
    "Hindsight Vectorize",
    "STM32 Debug",
    "ESP32 Bugs",
    "nRF52 Hardware Fixes",
    "Vector Memory API"
  ],
  authors: [{ name: "Flashback Team" }],
  openGraph: {
    title: "Flashback — Persistent Memory AI Agent for Embedded Engineering",
    description: "Never re-solve the same firmware bug twice. Powered by Hindsight Memory API.",
    url: "https://flashback-memory.vercel.app",
    siteName: "Flashback",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flashback — Persistent Firmware Debug Memory",
    description: "The AI agent that gives embedded engineering teams persistent memory of past bug fixes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col justify-between selection:bg-brand-indigo selection:text-white">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
