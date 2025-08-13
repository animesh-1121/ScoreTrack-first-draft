import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";
import { createSession, generateUserId, hashPassword } from "@/lib/auth";

// Ensure there is a default admin with username: admin, password: admin123 (file-based)
async function ensureDefaultAdmin() {
  const data = await readData();
  if (!data.admins.some((a) => a.username === "admin")) {
    const { hash, salt } = hashPassword("admin123");
    const id = generateUserId("admin");
    await writeData((d) => {
      d.admins.push({ id, username: "admin", passwordHash: hash, salt, createdAt: new Date().toISOString() });
    });
  }
}

export async function POST(req: NextRequest) {
  await ensureDefaultAdmin();
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { username, password } = body as { username?: string; password?: string };
  if (!username || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const data = await readData();
  const admin = data.admins.find((a) => a.username === username);
  if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const { hash } = hashPassword(password, admin.salt);
  if (hash !== admin.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await createSession({ userId: null, role: "admin" });
  return NextResponse.json({ success: true });
}


