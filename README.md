# Flashback — Persistent Memory AI Agent for Embedded Engineering

> **"The debugging assistant that never forgets a fix."**

Flashback is a production-ready web platform and interactive debugging assistant that gives firmware and embedded engineering teams persistent memory of past hardware, protocol, and driver bug fixes. Powered by **Hindsight** (Vector Memory API by Vectorize) and **Groq**, Flashback eliminates duplicate debugging cycles by retrieving team incident records, register configurations, and board revision notes.

---

## ⚡ Tech Stack & Architecture

- **Framework**: Next.js (App Router, Server Actions, TypeScript)
- **Styling**: Tailwind CSS + Framer Motion
- **Backend API**: Next.js Serverless API Routes (`/api/chat`)
- **LLM Engine**: Groq API (`openai/gpt-oss-120b` or `llama-3.3-70b-versatile`)
- **Vector Memory**: Hindsight Cloud API (`https://ui.hindsight.vectorize.io`)
- **Deployment**: Vercel Serverless Platform (Continuous 24/7 Deployment)

---

## 🚀 Live Public Deployment

The application is deployed live on Vercel:
👉 **[https://flashback-memory.vercel.app](https://flashback-memory.vercel.app)** *(or your connected Vercel URL)*

---

## 🛠️ Step-by-Step Vercel Deployment Instructions

### Method 1: Deploying via Vercel CLI (Recommended)

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/Kowshik-11/Flashback.git
   cd Flashback
   npm install
   ```

2. **Login to Vercel CLI**:
   ```bash
   npx vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

4. **Set Production Environment Variables**:
   In your Vercel Project Dashboard under **Settings → Environment Variables**, add:
   - `GROQ_API_KEY`: Your Groq API secret key
   - `HINDSIGHT_API_KEY`: Your Vectorize Hindsight API key
   - `HINDSIGHT_PROJECT_ID`: Your Vectorize Project ID

5. **Redeploy**:
   ```bash
   npx vercel --prod
   ```

---

### Method 2: Connect GitHub Repository to Vercel (Continuous Deployment)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Flashback web platform"
   git remote add origin https://github.com/<your-username>/flashback.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
3. Import your `flashback` GitHub repository.
4. Set the **Framework Preset** to `Next.js`.
5. Under **Environment Variables**, configure `GROQ_API_KEY`, `HINDSIGHT_API_KEY`, and `HINDSIGHT_PROJECT_ID`.
6. Click **Deploy**. Vercel will automatically build and deploy every new commit pushed to `main`.

---

### Method 3: Custom Domain Instructions

1. Navigate to your project in the Vercel Dashboard.
2. Go to **Settings → Domains**.
3. Enter your custom domain (e.g., `flashback.yourdomain.com` or `flashback.ai`).
4. Add the generated `CNAME` or `A` records to your DNS provider (Cloudflare, Namecheap, Route53).
5. Vercel will automatically issue an SSL/TLS certificate for continuous HTTPS access.

---

## 🔒 Security & Key Protection

All API calls to Groq and Hindsight are routed strictly through Next.js serverless functions (`/api/chat`). API keys are stored in server-side environment variables and are **never exposed to the browser client**.

---

## 🧪 Local Development

To run Flashback locally on your workstation:

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 License & Attribution

- Powered by [Hindsight Memory API](https://hindsight.vectorize.io/) by Vectorize.
- Powered by [Groq LPU](https://groq.com).
- Developed for embedded and firmware software engineering teams.
