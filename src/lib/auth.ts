import crypto from "crypto";
import { cookies } from "next/headers";
import { readData, writeData, generateId, nowIso } from "./storage";

const SESSION_COOKIE = "session_token";

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, useSalt, 150000, 32, "sha256").toString("hex");
  return { hash, salt: useSalt };
}

export async function createSession(params: { userId: string | null; role: "student" | "admin" }): Promise<string> {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  await writeData((d) => {
    d.sessions.push({ token, userId: params.userId, role: params.role, createdAt: nowIso(), expiresAt: expiresAt.toISOString() });
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", expires: expiresAt });
  return token;
}

export async function getSession(): Promise<{ role: "student" | "admin"; userId: string | null } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const data = await readData();
  const session = data.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  return { role: session.role, userId: session.userId };
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return;
  await writeData((d) => {
    d.sessions = d.sessions.filter((s) => s.token !== token);
  });
  jar.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", expires: new Date(0) });
}

export function generateUserId(role: "student" | "admin"): string {
  return generateId(role === "student" ? "stu" : "adm");
}


