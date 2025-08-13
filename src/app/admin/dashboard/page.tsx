"use client";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  className: string;
  giverRollNo: string;
  createdAt: string;
  entries: { recipientRollNo: string; marks: number }[];
};

type Overview = {
  submissions: Submission[];
  scoreByRoll: Record<string, number>;
  averageByRoll: Record<string, number>;
  countByRoll: Record<string, number>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [className, setClassName] = useState<string>("");
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortRollAsc, setSortRollAsc] = useState<boolean>(true);
  const [minMarks, setMinMarks] = useState<string>("");
  const [maxMarks, setMaxMarks] = useState<string>("");

  async function load() {
    setError(null);
    const params = new URLSearchParams();
    if (className) params.set("className", className);
    const res = await fetch(`/api/admin/overview?${params.toString()}`);
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to load");
      return;
    }
    setData(json);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreRows = useMemo(() => {
    if (!data) return [];
    let rows = Object.entries(data.scoreByRoll).map(([roll, score]) => ({ roll, score, avg: data.averageByRoll[roll] ?? 0, cnt: data.countByRoll[roll] ?? 0 }));
    const min = minMarks ? Number(minMarks) : -Infinity;
    const max = maxMarks ? Number(maxMarks) : Infinity;
    rows = rows.filter((r) => r.score >= min && r.score <= max);
    rows.sort((a, b) => {
      if (sortRollAsc) return a.roll.localeCompare(b.roll);
      return b.roll.localeCompare(a.roll);
    });
    return rows;
  }, [data, sortRollAsc, minMarks, maxMarks]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="grow">
          <label className="block text-sm font-medium">Filter by Class Name</label>
          <input className="mt-1 input" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Class-A" />
        </div>
        <div>
          <label className="block text-sm font-medium">Sort by Roll No</label>
          <select className="mt-1 input" value={sortRollAsc ? "asc" : "desc"} onChange={(e) => setSortRollAsc(e.target.value === "asc")}> 
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Min Total</label>
          <input className="mt-1 input" value={minMarks} onChange={(e) => setMinMarks(e.target.value)} placeholder="e.g. 50" />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Total</label>
          <input className="mt-1 input" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} placeholder="e.g. 300" />
        </div>
        <div className="md:col-span-4">
          <button className="button-primary" onClick={load}>Apply</button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="card-header mb-3">Scores by Roll No</h2>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {scoreRows.length === 0 && <div className="text-sm text-gray-600">No data</div>}
            {scoreRows.map((r) => (
              <div key={r.roll} className="grid grid-cols-12 items-center gap-2 card p-2">
                <span className="col-span-4 font-mono text-blue-700">{r.roll}</span>
                <span className="col-span-3 font-semibold">Total: {r.score}</span>
                <span className="col-span-3">Avg: {r.avg}</span>
                <span className="col-span-2 text-xs text-gray-500">n={r.cnt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="card-header mb-3">Submissions</h2>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {data?.submissions.length === 0 && <div className="text-sm text-gray-600">No submissions</div>}
            {data?.submissions.map((s) => (
              <div key={s.id} className="card p-2">
                <div className="text-sm text-gray-600">{new Date(s.createdAt).toLocaleString()} • {s.className}</div>
                <div className="font-medium text-blue-700">Giver: {s.giverRollNo}</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {s.entries.map((e, idx) => (
                    <div key={idx} className="flex justify-between card p-2">
                      <span className="font-mono text-blue-700">{e.recipientRollNo}</span>
                      <span className="font-semibold">{e.marks}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LogoutButton redirectTo="/admin/login" />
    </div>
  );
}


