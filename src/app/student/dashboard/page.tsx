import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import { readData } from "@/lib/storage";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session || session.role !== "student" || !session.userId) redirect("/student/login");
  const data = await readData();
  const student = data.students.find((s) => s.id === session.userId);
  if (!student) redirect("/student/login");

  // compute total and average
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
  const average = count > 0 ? Number((total / count).toFixed(2)) : 0;

  const hasSubmitted = data.submissions.some(
    (s) => s.giverUserId === student.id && s.className.toLowerCase() === student.className.toLowerCase()
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="card p-5">
        <h1 className="card-header">Welcome, {student.name}</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="card p-4">
            <div className="card-subtle">Roll No</div>
            <div className="font-medium">{student.rollNo}</div>
          </div>
          <div className="card p-4">
            <div className="card-subtle">Class</div>
            <div className="font-medium">{student.className}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="card p-4">
            <div className="card-subtle">Your Total Score</div>
            <div className="text-3xl font-bold text-blue-700">{total}</div>
          </div>
          <div className="card p-4">
            <div className="card-subtle">Average Marks Received</div>
            <div className="text-3xl font-bold text-blue-700">{average}</div>
            <div className="text-xs text-gray-500">based on {count} classmates</div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
        {!hasSubmitted && (
          <Link href="/student/give-marks" className="button-primary">Give Marks</Link>
        )}
          <LogoutButton redirectTo="/student/login" />
        </div>
      </div>
    </div>
  );
}


