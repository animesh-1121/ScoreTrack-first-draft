import { NextRequest, NextResponse } from "next/server";
import { isValidRollNo, writeData, readData } from "@/lib/storage";
import { generateUserId } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, rollNo, className, password } = body as {
    name?: string;
    rollNo?: string;
    className?: string;
    password?: string;
  };

  if (!name || !rollNo || !className || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!isValidRollNo(rollNo)) {
    return NextResponse.json({ error: "Invalid roll number format (expected 240050__)" }, { status: 400 });
  }

  const data = await readData();
  if (data.students.some((s) => s.rollNo === rollNo && s.className.toLowerCase() === className.toLowerCase())) {
    return NextResponse.json({ error: "Student already exists in this class" }, { status: 409 });
  }

  const { hash, salt } = hashPassword(password);
  const id = generateUserId("student");

  await writeData((d) => {
    d.students.push({ id, name, rollNo, className, passwordHash: hash, salt, createdAt: new Date().toISOString() });
  });

  return NextResponse.json({ success: true });
}


