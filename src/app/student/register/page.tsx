"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rollNo, className, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Registration failed");
      return;
    }
    router.push("/student/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 card p-6">
        <h1 className="card-header">Student Registration</h1>
        <p className="card-subtle">Register to start giving marks to your classmates.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
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
          <button className="w-full button-primary">Register</button>
        </form>
        <p className="text-sm card-subtle">
          Already have an account? <Link className="text-blue-700 underline" href="/student/login">Login</Link>
        </p>
      </div>
    </div>
  );
}


