import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const classNameFilter = searchParams.get("className");

  const data = await readData();
  const submissions = data.submissions
    .filter((s) => (classNameFilter ? s.className.toLowerCase() === classNameFilter.toLowerCase() : true))
    .map((s) => ({
      id: s.id,
      className: s.className,
      giverRollNo: s.giverRollNo,
      entries: s.entries,
      createdAt: s.createdAt,
    }));

  // Score summaries by recipient within class
  const scoreByRoll: Record<string, number> = {};
  const countByRoll: Record<string, number> = {};
  for (const s of submissions) {
    for (const e of s.entries) {
      scoreByRoll[e.recipientRollNo] = (scoreByRoll[e.recipientRollNo] ?? 0) + e.marks;
      countByRoll[e.recipientRollNo] = (countByRoll[e.recipientRollNo] ?? 0) + 1;
    }
  }

  const averageByRoll: Record<string, number> = {};
  for (const roll of Object.keys(scoreByRoll)) {
    const total = scoreByRoll[roll];
    const c = countByRoll[roll] ?? 0;
    averageByRoll[roll] = c > 0 ? Number((total / c).toFixed(2)) : 0;
  }

  return NextResponse.json({ submissions, scoreByRoll, averageByRoll, countByRoll });
}


