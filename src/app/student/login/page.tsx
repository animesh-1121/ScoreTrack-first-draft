"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentLoginPage() {
  const router = useRouter();
  const [rollNo, setRollNo] = useState("");
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/student/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo, className, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Login failed");
      return;
    }
    router.push("/student/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 card p-6">
        <h1 className="card-header">Student Login</h1>
        <p className="card-subtle">Enter your roll no, class name and password to continue.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Roll No (format 240050__)</label>
            <input className="mt-1 input" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Class Name</label>
            <input className="mt-1 input" value={className} onChange={(e) => setClassName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="mt-1 input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full button-primary">Login</button>
        </form>
        <p className="text-sm card-subtle">
          No account? <Link className="text-blue-700 underline" href="/student/register">Register</Link>
        </p>
      </div>
    </div>
  );
}


