import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData } from "@/lib/storage";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "student" || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readData();
  const me = data.students.find((s) => s.id === session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const classmates = data.students
    .filter((s) => s.className.toLowerCase() === me.className.toLowerCase() && s.rollNo !== me.rollNo)
    .map((s) => ({ rollNo: s.rollNo, name: s.name }))
    .sort((a, b) => a.rollNo.localeCompare(b.rollNo));
  return NextResponse.json({ classmates });
}


