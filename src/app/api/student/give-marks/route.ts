import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData, generateId } from "@/lib/storage";

type Body = {
  entries: { recipientRollNo: string; marks: number }[]; // marks 0-100
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "student" || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || !Array.isArray(body.entries) || body.entries.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = await readData();
  const student = data.students.find((s) => s.id === session.userId);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ensure student submits only once per class (one submission per giver per class)
  const alreadySubmitted = data.submissions.some(
    (s) => s.giverUserId === student.id && s.className.toLowerCase() === student.className.toLowerCase()
  );
  if (alreadySubmitted) {
    return NextResponse.json({ error: "You have already submitted marks for your class" }, { status: 409 });
  }

  // Validate entries: recipients exist in same class (and not self), marks 0-100
  const recipientsSet = new Set<string>();
  for (const e of body.entries) {
    if (typeof e.marks !== "number" || e.marks < 0 || e.marks > 100) {
      return NextResponse.json({ error: "Marks must be between 0 and 100" }, { status: 400 });
    }
    const r = data.students.find(
      (s) => s.rollNo === e.recipientRollNo && s.className.toLowerCase() === student.className.toLowerCase()
    );
    if (!r) {
      return NextResponse.json({ error: `Recipient ${e.recipientRollNo} not found in your class` }, { status: 404 });
    }
    if (r.rollNo === student.rollNo) {
      return NextResponse.json({ error: "You cannot give marks to yourself" }, { status: 400 });
    }
    const key = e.recipientRollNo.toUpperCase();
    if (recipientsSet.has(key)) {
      return NextResponse.json({ error: "Duplicate recipient in entries" }, { status: 400 });
    }
    recipientsSet.add(key);
  }

  const submissionId = generateId("sub");
  await writeData((d) => {
    d.submissions.push({
      id: submissionId,
      className: student.className,
      giverUserId: student.id,
      giverRollNo: student.rollNo,
      entries: body.entries.map((e) => ({ recipientRollNo: e.recipientRollNo, marks: e.marks })),
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({ success: true, submissionId });
}


