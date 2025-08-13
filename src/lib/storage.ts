import { promises as fs } from "fs";
import path from "path";

export type StudentUser = {
  id: string;
  name: string;
  rollNo: string; // format 240050__
  className: string; // e.g. "Class-A", free text
  passwordHash: string;
  salt: string;
  createdAt: string; // ISO
};

export type AdminUser = {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export type SessionRecord = {
  token: string;
  userId: string | null; // for student
  role: "student" | "admin";
  createdAt: string;
  expiresAt: string; // ISO
};

export type MarksEntry = {
  recipientRollNo: string;
  marks: number; // 0-100
};

export type MarksSubmission = {
  id: string;
  className: string;
  giverUserId: string;
  giverRollNo: string;
  entries: MarksEntry[];
  createdAt: string; // ISO
};

type DataShape = {
  students: StudentUser[];
  admins: AdminUser[];
  sessions: SessionRecord[];
  submissions: MarksSubmission[];
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "store.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    const initial: DataShape = {
      students: [],
      admins: [],
      sessions: [],
      submissions: [],
    };
    await fs.writeFile(dataFile, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readData(): Promise<DataShape> {
  await ensureDataFile();
  const content = await fs.readFile(dataFile, "utf8");
  try {
    return JSON.parse(content) as DataShape;
  } catch {
    const fallback: DataShape = {
      students: [],
      admins: [],
      sessions: [],
      submissions: [],
    };
    return fallback;
  }
}

export async function writeData(update: (data: DataShape) => void | Promise<void>): Promise<DataShape> {
  const data = await readData();
  await update(data);
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export function isValidRollNo(rollNo: string): boolean {
  // Must start with 240050 and have total length 8 (two more digits/letters)
  // Allow digits only for the last two by default; loosen to alnum if needed.
  return /^240050[0-9A-Za-z]{2}$/.test(rollNo);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}


