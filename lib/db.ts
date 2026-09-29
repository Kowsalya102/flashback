import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  hindsightBankId: string;
  memoryEnabled: boolean;
  userProfile: {
    boards: string[];
    mcus: string[];
    tools: string[];
    languages: string[];
    os: string;
    skillLevel: "Junior" | "Mid" | "Senior" | "Principal";
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  domain: "Auto-detect" | "Hardware" | "Firmware" | "Software";
  pinned: boolean;
  memoryEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  incidentsUsed?: any[];
  attachments?: { name: string; size: number; type: string; url?: string }[];
  toolCalls?: any[];
  feedback?: "up" | "down";
  createdAt: string;
}

export interface MemoryEvent {
  id: string;
  userId: string;
  conversationId?: string;
  eventType: "recall" | "retain" | "reflect" | "user_correction" | "mark_solved";
  title: string;
  symptom: string;
  domain: string;
  rootCause: string;
  fixDetails: string;
  tags: string[];
  createdAt: string;
}

export interface UsageLimit {
  userId: string;
  dailyCount: number;
  lastResetDate: string;
}

interface DBStructure {
  users: User[];
  conversations: Conversation[];
  messages: Message[];
  memoryEvents: MemoryEvent[];
  usageLimits: UsageLimit[];
}

// Data Directory & File Paths
const SEED_DATA_DIR = path.join(process.cwd(), ".data");
const SEED_DB_FILE = path.join(SEED_DATA_DIR, "db.json");

/**
 * Determines a writable file path for runtime database persistence.
 * On Vercel / serverless (read-only /var/task), returns os.tmpdir() path.
 * In local development, returns process.cwd()/.data/db.json.
 */
function getWritableDbPath(): string {
  try {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return path.join(os.tmpdir(), "flashback-db.json");
    }

    if (!fs.existsSync(SEED_DATA_DIR)) {
      fs.mkdirSync(SEED_DATA_DIR, { recursive: true });
    }
    const testFile = path.join(SEED_DATA_DIR, ".writable_test");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    return SEED_DB_FILE;
  } catch {
    return path.join(os.tmpdir(), "flashback-db.json");
  }
}

/**
 * Initializes and retrieves database structure with in-memory caching
 * and seamless fallback across local files, Vercel /tmp, and seed defaults.
 */
function initDB(): DBStructure {
  if ((globalThis as any)._flashback_db_cache) {
    return (globalThis as any)._flashback_db_cache;
  }

  const dbPath = getWritableDbPath();
  let dbData: DBStructure | null = null;

  // 1. Try reading existing writable runtime database file
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, "utf-8");
      dbData = JSON.parse(raw);
    } catch {
      dbData = null;
    }
  }

  // 2. Fallback to seed db.json if available
  if (!dbData && fs.existsSync(SEED_DB_FILE)) {
    try {
      const rawSeed = fs.readFileSync(SEED_DB_FILE, "utf-8");
      dbData = JSON.parse(rawSeed);
    } catch {
      dbData = null;
    }
  }

  // 3. Default empty database structure
  if (!dbData) {
    dbData = {
      users: [],
      conversations: [],
      messages: [],
      memoryEvents: [],
      usageLimits: [],
    };
  }

  dbData.users = dbData.users || [];
  dbData.conversations = dbData.conversations || [];
  dbData.messages = dbData.messages || [];
  dbData.memoryEvents = dbData.memoryEvents || [];
  dbData.usageLimits = dbData.usageLimits || [];

  (globalThis as any)._flashback_db_cache = dbData;
  return dbData;
}

/**
 * Persists database structure to in-memory cache and writable file storage.
 * Prevents EROFS read-only filesystem errors on Vercel deployment.
 */
function saveDB(db: DBStructure) {
  (globalThis as any)._flashback_db_cache = db;

  const dbPath = getWritableDbPath();
  try {
    const parentDir = path.dirname(dbPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.warn("Primary saveDB write failed, falling back to emergency /tmp storage:", err);
    try {
      const emergencyPath = path.join(os.tmpdir(), "flashback-db.json");
      fs.writeFileSync(emergencyPath, JSON.stringify(db, null, 2));
    } catch (fallbackErr) {
      console.error("Failed emergency database write to /tmp:", fallbackErr);
    }
  }
}

// --- USER OPERATIONS ---
export function getUserByEmail(email: string): User | undefined {
  const db = initDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const db = initDB();
  return db.users.find((u) => u.id === id);
}

export function createUser(email: string, passwordHash: string, name: string): User {
  const db = initDB();
  const newUser: User = {
    id: "usr_" + crypto.randomBytes(8).toString("hex"),
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    passwordHash,
    emailVerified: true, // Auto-verified for seamless UX
    hindsightBankId: "bank_" + crypto.randomBytes(8).toString("hex"),
    memoryEnabled: true,
    userProfile: {
      boards: ["Custom PCB", "STM32F4 Discovery", "ESP32-S3 DevKit"],
      mcus: ["STM32F4", "ESP32-S3", "nRF52840"],
      tools: ["Logic Analyzer", "Oscilloscope", "VS Code", "GDB"],
      languages: ["C", "C++", "Python", "TypeScript"],
      os: "Linux / macOS",
      skillLevel: "Senior",
    },
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = initDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...updates };
  saveDB(db);
  return db.users[idx];
}

export function deleteUser(id: string): boolean {
  const db = initDB();
  db.users = db.users.filter((u) => u.id !== id);
  db.conversations = db.conversations.filter((c) => c.userId !== id);
  db.memoryEvents = db.memoryEvents.filter((m) => m.userId !== id);
  saveDB(db);
  return true;
}

// --- CONVERSATION OPERATIONS ---
export function getUserConversations(userId: string): Conversation[] {
  const db = initDB();
  return db.conversations
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getConversation(id: string): Conversation | undefined {
  const db = initDB();
  return db.conversations.find((c) => c.id === id);
}

export function createConversation(
  userId: string,
  title: string,
  domain: Conversation["domain"] = "Auto-detect"
): Conversation {
  const db = initDB();
  const newConv: Conversation = {
    id: "conv_" + crypto.randomBytes(8).toString("hex"),
    userId,
    title: title || "New Debug Session",
    domain,
    pinned: false,
    memoryEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.conversations.push(newConv);
  saveDB(db);
  return newConv;
}

export function updateConversation(id: string, updates: Partial<Conversation>): Conversation | null {
  const db = initDB();
  const idx = db.conversations.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.conversations[idx] = { ...db.conversations[idx], ...updates, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.conversations[idx];
}

export function deleteConversation(id: string): boolean {
  const db = initDB();
  db.conversations = db.conversations.filter((c) => c.id !== id);
  db.messages = db.messages.filter((m) => m.conversationId !== id);
  saveDB(db);
  return true;
}

// --- MESSAGE OPERATIONS ---
export function getConversationMessages(conversationId: string): Message[] {
  const db = initDB();
  return db.messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string,
  incidentsUsed?: any[],
  attachments?: any[],
  toolCalls?: any[]
): Message {
  const db = initDB();
  const newMsg: Message = {
    id: "msg_" + crypto.randomBytes(8).toString("hex"),
    conversationId,
    role,
    content,
    incidentsUsed,
    attachments,
    toolCalls,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(newMsg);

  const convIdx = db.conversations.findIndex((c) => c.id === conversationId);
  if (convIdx !== -1) {
    db.conversations[convIdx].updatedAt = new Date().toISOString();
  }

  saveDB(db);
  return newMsg;
}

// --- MEMORY EVENT OPERATIONS ---
export function getUserMemoryEvents(userId: string): MemoryEvent[] {
  const db = initDB();
  return db.memoryEvents
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addMemoryEvent(
  userId: string,
  eventType: MemoryEvent["eventType"],
  data: {
    conversationId?: string;
    title: string;
    symptom: string;
    domain: string;
    rootCause: string;
    fixDetails: string;
    tags: string[];
  }
): MemoryEvent {
  const db = initDB();
  const newMem: MemoryEvent = {
    id: "mem_" + crypto.randomBytes(8).toString("hex"),
    userId,
    conversationId: data.conversationId,
    eventType,
    title: data.title,
    symptom: data.symptom,
    domain: data.domain,
    rootCause: data.rootCause,
    fixDetails: data.fixDetails,
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
  };
  db.memoryEvents.push(newMem);
  saveDB(db);
  return newMem;
}

export function deleteMemoryEvent(id: string, userId: string): boolean {
  const db = initDB();
  db.memoryEvents = db.memoryEvents.filter((m) => m.id !== id || m.userId !== userId);
  saveDB(db);
  return true;
}

export function deleteAllUserMemories(userId: string): boolean {
  const db = initDB();
  db.memoryEvents = db.memoryEvents.filter((m) => m.userId !== userId);
  saveDB(db);
  return true;
}
