"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="border rounded px-4 py-2 disabled:opacity-60"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await fetch("/api/session/logout", { method: "POST" });
        } catch {}
        router.replace(redirectTo);
      }}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}


