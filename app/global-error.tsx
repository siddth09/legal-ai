"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#07090f", color: "#f1f5f9", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ maxWidth: 480, padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <AlertTriangle size={24} style={{ color: "#f87171" }} aria-hidden="true" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#8b98b0", lineHeight: 1.65, marginBottom: 24 }}>
            An unexpected error occurred. Your data was not affected.
          </p>
          <button
            onClick={reset}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            <RefreshCw size={15} aria-hidden="true" />
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
