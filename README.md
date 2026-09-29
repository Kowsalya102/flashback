# Flashback — Persistent Memory AI Agent for General Engineering Debugging

> **"The debugging assistant that never forgets a fix."**

Flashback is a production-ready web platform and interactive debugging assistant that gives engineering teams persistent memory across **Hardware**, **Embedded/Firmware**, and **Software** debugging incidents. Powered by **Hindsight** (Vector Memory API by Vectorize) and **Groq**, Flashback eliminates duplicate debugging cycles by retrieving team incident records, register configurations, board revision notes, and stack trace solutions.
🌐 **Live Demo:** https://flashback-mu.vercel.app/

---

## ⚡ Tech Stack & Architecture

- **Framework**: Next.js (App Router, Server Actions, TypeScript)
- **Styling**: Tailwind CSS + Framer Motion + Lucide React
- **Backend API**: Next.js Serverless API Routes (`/api/chat`, `/api/auth/*`, `/api/memory/*`, `/api/conversations/*`)
- **LLM Engine**: Groq API (`openai/gpt-oss-120b` or `llama-3.3-70b-versatile`)
- **Vector Memory**: Hindsight Cloud API (`https://api.hindsight.vectorize.io`)
- **Deployment**: Vercel Serverless Platform (Continuous 24/7 Deployment)

---

## 🛠️ Key Capabilities & Enhancements

1. **Cross-Disciplinary Debugging**:
   - **HARDWARE**: Power supply ripple, I2C pull-up sizing, ADC noise, motor back-EMF, BLE antenna tuning, MOSFET thermal dissipation.
   - **EMBEDDED/FIRMWARE**: STM32, ESP32, nRF52, AVR, RP2040, FreeRTOS, Zephyr, EasyDMA, watchdogs, low-power modes.
   - **SOFTWARE**: Python asyncio deadlocks, C++ use-after-free, Go race conditions, Docker cache invalidations, PostgreSQL N+1 queries.

2. **Per-User Hindsight Memory Engine**:
   - Every registered user gets a dedicated Hindsight memory bank (`bank_id`).
   - Automatic **Recall** per query, grounded answers, and structured **Retain** on "Mark as Solved".
   - **Reflect Insights**: Automated pattern analysis across past incident history.

3. **ChatGPT/Claude-Style Chat Interface at `/app`**:
   - Multi-turn conversation sidebar grouped by date with rename/delete/pin options.
   - Domain selector chips (`Auto-detect`, `Hardware`, `Firmware`, `Software`).
   - File attachment dropzone for text/log/code files (`.txt`, `.log`, `.c`, `.cpp`, `.py`, `.js`, `.ts`).
   - Embedded engineering calculators & log diagnostic analyzer.

---

## 🚀 Environment Variables

Copy `.env.example` to `.env.local` or set in your Vercel Dashboard:

```env
# GROQ API Key (Groq LPU LLM inference)
GROQ_API_KEY=your_groq_api_key_here

# Hindsight Vector Memory API Credentials (by Vectorize)
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=flashback

# Optional: Override Groq Model Name (defaults to openai/gpt-oss-120b)
GROQ_MODEL=openai/gpt-oss-120b

# JWT Secret for Auth Sessions
JWT_SECRET=your_jwt_secret_key
```

---

## 📜 How Hindsight Retain, Recall, and Reflect are Used

- **Recall**: Executed prior to generating each response. Queries the user's vector memory index using semantic similarity search to retrieve relevant past incident tickets.
- **Retain**: Triggered when a user clicks "Mark as Solved" or confirms a resolution. Formats the incident into structured metadata (symptom, domain, root cause, fix, tags) and indexes it into Hindsight.
- **Reflect**: Periodically scans stored memory vectors to identify recurring root causes, most troublesome subsystems, and recommended preventive checks.

---

## 🔒 Security & Data Isolation

All API keys are held server-side and never exposed to the client. Each user's memory events are isolated to their personal account and authenticated session token.
