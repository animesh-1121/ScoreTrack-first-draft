import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData } from "@/lib/storage";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "student" || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readData();
  const student = data.students.find((s) => s.id === session.userId);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Calculate total score for this student across all submissions for same class
  const relevant = data.submissions.filter((sub) => sub.className.toLowerCase() === student.className.toLowerCase());
  let total = 0;
  let count = 0;
  for (const sub of relevant) {
    const toSelf = sub.entries.find((e) => e.recipientRollNo === student.rollNo);
    if (toSelf) {
      total += toSelf.marks;
      count += 1;
    }
  }
  const average = count > 0 ? total / count : 0;

  return NextResponse.json({
    name: student.name,
    rollNo: student.rollNo,
    className: student.className,
    totalScore: total,
    averageScore: Number(average.toFixed(2)),
    receivedCount: count,
  });
}


