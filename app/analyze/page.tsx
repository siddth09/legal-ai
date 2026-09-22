"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { Loader2, FileSearch, AlertCircle } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import type { AnalysisData } from "@/lib/types";

// Lazy-load the heavy result component — it's only needed after analysis completes
const AnalysisResult = lazy(() => import("@/components/AnalysisResult"));

type Status = "idle" | "loading" | "success" | "error";

export default function AnalyzePage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [rawText,  setRawText]  = useState<string | null>(null);
  const [status,   setStatus]   = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setRawText(null); setStatus("idle"); setAnalysis(null); setError(null);
  }, []);

  const handleText = useCallback((t: string) => {
    setRawText(t); setFile(null); setStatus("idle"); setAnalysis(null); setError(null);
  }, []);

  const handleClear = () => {
    setFile(null); setRawText(null); setStatus("idle"); setAnalysis(null); setError(null);
  };

  const analyze = async () => {
    if (!file && !rawText) return;
    setStatus("loading"); setError(null);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      else if (rawText) fd.append("text", rawText);
      const res  = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Analysis failed");
      setAnalysis(data.analysis); setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong."); setStatus("error");
    }
  };

  const hasDocument = !!file || !!rawText;

  return (
    <div className="hero-glow" style={{ minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(59,130,246,0.3)",
          }}>
            <FileSearch size={26} color="#fff" aria-hidden="true" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Document Analyzer
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
            Upload any legal document and get a plain-English breakdown with risk flags, key clauses, and an action checklist.
          </p>
        </div>

        {/* Upload panel */}
        {status !== "success" && (
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            {!hasDocument ? (
              <DocumentUploader
                id="doc-upload"
                label="Your legal document"
                onFile={handleFile}
                onText={handleText}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {file ? (
                  <DocumentUploader
                    id="doc-upload"
                    label="Document ready"
                    onFile={handleFile}
                    currentFile={file}
                    onClear={handleClear}
                  />
                ) : (
                  <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Sample NDA loaded</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Ready to analyze</p>
                    </div>
                    <button onClick={handleClear} className="btn-ghost" style={{ fontSize: 12 }} aria-label="Clear document">
                      Clear
                    </button>
                  </div>
                )}
                <button
                  onClick={analyze}
                  disabled={status === "loading"}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15 }}
                  aria-busy={status === "loading"}
                >
                  {status === "loading" ? (
                    <><Loader2 size={17} className="spinner" aria-hidden="true" /> Analyzing document…</>
                  ) : (
                    <><FileSearch size={17} aria-hidden="true" /> Analyze Document</>
                  )}
                </button>
              </div>
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
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>Analysis failed</p>
              <p style={{ fontSize: 12, color: "#fca5a5", marginTop: 4 }}>{error}</p>
              <button onClick={handleClear} className="btn-ghost" style={{ fontSize: 12, marginTop: 8, padding: "2px 0" }}>
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {status === "success" && !!analysis && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>✅ Analysis complete</p>
              <button onClick={handleClear} className="btn-ghost" style={{ fontSize: 12 }}>
                Analyze another
              </button>
            </div>
            <Suspense fallback={<div style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Loading results…</div>}>
              <AnalysisResult analysis={analysis} />
            </Suspense>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 32 }}>
          LexAI provides legal information only — not legal advice. Always consult a qualified attorney.
        </p>
      </div>
    </div>
  );
}
