"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="hero-glow" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <AlertTriangle size={24} style={{ color: "#f87171" }} aria-hidden="true" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 24 }}>
          {error.message ?? "An unexpected error occurred. Please try again."}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            className="btn-primary"
            style={{ padding: "10px 20px" }}
          >
            <RefreshCw size={15} aria-hidden="true" />
            Try again
          </button>
          <Link href="/" className="btn-secondary" style={{ padding: "10px 20px" }}>
            <ArrowLeft size={15} aria-hidden="true" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
