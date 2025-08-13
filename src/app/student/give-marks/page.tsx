"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Me = { name: string; rollNo: string; className: string; totalScore: number };
type Classmate = { rollNo: string; name: string };

export default function GiveMarksPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [entries, setEntries] = useState<{ recipientRollNo: string; marks: number }[]>([
    { recipientRollNo: "", marks: 0 },
  ]);
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/student/me");
      if (!res.ok) {
        router.replace("/student/login");
        return;
      }
      const json: Me = await res.json();
      setMe(json);
      // load classmates for dropdown
      const clsRes = await fetch("/api/student/classmates");
      if (clsRes.ok) {
        const { classmates } = (await clsRes.json()) as { classmates: Classmate[] };
        setClassmates(classmates);
      }
      setLoading(false);
    })();
  }, [router]);

  function updateEntry(idx: number, field: "recipientRollNo" | "marks", value: string) {
    setEntries((prev) => {
      const copy = [...prev];
      const item = { ...copy[idx] };
      if (field === "recipientRollNo") item.recipientRollNo = value;
      else item.marks = Number(value);
      copy[idx] = item;
      return copy;
    });
  }

  function addRow() {
    setEntries((p) => [...p, { recipientRollNo: "", marks: 0 }]);
  }
  function removeRow(i: number) {
    setEntries((p) => p.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const filtered = entries.filter((e) => e.recipientRollNo.trim() !== "");
    if (filtered.length === 0) {
      setError("Please add at least one recipient");
      return;
    }
    const res = await fetch("/api/student/give-marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: filtered }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Submission failed");
      return;
    }
    router.push("/student/dashboard");
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 card">
      <div className="p-4">
        <h1 className="card-header">Give Marks - Class {me?.className}</h1>
        <p className="card-subtle mt-1">Select from classmates or type roll no. You cannot rate yourself. Range 0-100.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3 p-4">
        {entries.map((entry, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-7">
              <label className="block text-sm font-medium">Recipient</label>
              <div className="mt-1 flex gap-2">
                <select
                  className="w-full input"
                  value={entry.recipientRollNo}
                  onChange={(e) => updateEntry(idx, "recipientRollNo", e.target.value)}
                >
                  <option value="">Select classmate</option>
                  {classmates.map((c) => (
                    <option key={c.rollNo} value={c.rollNo}>
                      {c.rollNo} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-gray-500 mt-1">Or type roll no directly:</div>
              <input
                className="mt-1 input"
                placeholder="240050__"
                value={entry.recipientRollNo}
                onChange={(e) => updateEntry(idx, "recipientRollNo", e.target.value)}
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium">Marks</label>
              <input
                type="number"
                min={0}
                max={100}
                className="mt-1 input"
                value={entry.marks}
                onChange={(e) => updateEntry(idx, "marks", e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <button type="button" className="w-full button-outline" onClick={() => removeRow(idx)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" className="button-outline" onClick={addRow}>Add Row</button>
          <button className="button-primary" type="submit">Submit Marks</button>
        </div>
      </form>
    </div>
  );
}


