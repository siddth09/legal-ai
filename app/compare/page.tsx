"use client";

import { useState } from "react";
import { Loader2, GitCompare, AlertCircle } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import CompareView from "@/components/CompareView";

type Status = "idle" | "loading" | "success" | "error";

export default function ComparePage() {
  const [fileA,      setFileA]      = useState<File | null>(null);
  const [fileB,      setFileB]      = useState<File | null>(null);
  const [status,     setStatus]     = useState<Status>("idle");
  const [comparison, setComparison] = useState<unknown>(null);
  const [error,      setError]      = useState<string | null>(null);

  const clearAll = () => { setFileA(null); setFileB(null); setStatus("idle"); setComparison(null); setError(null); };
  const clearA   = () => setFileA(null);
  const clearB   = () => setFileB(null);

  const compare = async () => {
    if (!fileA || !fileB) return;
    setStatus("loading"); setError(null);
    try {
      const fd = new FormData();
      fd.append("fileA", fileA); fd.append("fileB", fileB);
      const res  = await fetch("/api/compare", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Comparison failed");
      setComparison(data.comparison); setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong."); setStatus("error");
    }
  };

  const canCompare = !!fileA && !!fileB;

  return (
    <div className="hero-glow" style={{ minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(124,58,237,0.3)",
          }}>
            <GitCompare size={26} color="#fff" aria-hidden="true" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Contract Comparator
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            Upload two document versions. LexAI identifies every meaningful change and explains what each one means for you.
          </p>
        </div>

        {/* Upload panel */}
        {status !== "success" && (
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <DocumentUploader
                id="file-a"
                label="Document A — Original"
                onFile={setFileA}
                currentFile={fileA}
                onClear={clearA}
              />
              <DocumentUploader
                id="file-b"
                label="Document B — Revised"
                onFile={setFileB}
                currentFile={fileB}
                onClear={clearB}
              />
            </div>

            {canCompare ? (
              <button
                onClick={compare}
                disabled={status === "loading"}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15, background: "#7c3aed", boxShadow: "0 2px 12px rgba(124,58,237,0.35)" }}
                aria-busy={status === "loading"}
              >
                {status === "loading" ? (
                  <><Loader2 size={17} className="spinner" aria-hidden="true" /> Comparing documents…</>
                ) : (
                  <><GitCompare size={17} aria-hidden="true" /> Compare Documents</>
                )}
              </button>
            ) : (
              <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
                Upload both documents to start comparing
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="card" style={{
            padding: "14px 16px", marginBottom: 16,
            background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)",
            display: "flex", gap: 12, alignItems: "flex-start"
          }} role="alert">
            <AlertCircle size={17} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>Comparison failed</p>
              <p style={{ fontSize: 12, color: "#fca5a5", marginTop: 4 }}>{error}</p>
              <button onClick={clearAll} className="btn-ghost" style={{ fontSize: 12, marginTop: 8, padding: "2px 0" }}>
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {status === "success" && comparison && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>✅ Comparison complete</p>
              <button onClick={clearAll} className="btn-ghost" style={{ fontSize: 12 }}>
                Compare different documents
              </button>
            </div>
            <CompareView
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              comparison={comparison as any}
              nameA={fileA?.name ?? "Document A"}
              nameB={fileB?.name ?? "Document B"}
            />
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 32 }}>
          LexAI provides legal information only — not legal advice. Always consult a qualified attorney.
        </p>
      </div>
    </div>
  );
}
