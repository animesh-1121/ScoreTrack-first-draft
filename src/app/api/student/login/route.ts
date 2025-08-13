import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/storage";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { rollNo, className, password } = body as { rollNo?: string; className?: string; password?: string };
  if (!rollNo || !className || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const data = await readData();
  const student = data.students.find(
    (s) => s.rollNo === rollNo && s.className.toLowerCase() === className.toLowerCase()
  );
  if (!student) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const { hash } = hashPassword(password, student.salt);
  if (hash !== student.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await createSession({ userId: student.id, role: "student" });
  return NextResponse.json({ success: true });
}


