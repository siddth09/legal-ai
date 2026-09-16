"use client";

import { useState, useCallback } from "react";
import { MessageSquare, Loader2, AlertCircle, FileText } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import ChatInterface from "@/components/ChatInterface";

type Status = "idle" | "loading" | "ready" | "error";

export default function QAPage() {
  const [file,         setFile]         = useState<File | null>(null);
  const [rawText,      setRawText]      = useState<string | null>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [status,       setStatus]       = useState<Status>("idle");
  const [error,        setError]        = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setRawText(null); setDocumentText(null); setStatus("idle"); setError(null);
  }, []);

  const handleText = useCallback((t: string) => {
    setRawText(t); setFile(null); setDocumentText(null); setStatus("idle"); setError(null);
  }, []);

  const loadDocument = async () => {
    if (!file && !rawText) return;
    setStatus("loading"); setError(null);
    try {
      if (rawText) { setDocumentText(rawText); setStatus("ready"); return; }
      const fd = new FormData();
      if (file) fd.append("file", file);
      const res  = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to load document");
      setDocumentText(data.documentText); setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document."); setStatus("error");
    }
  };

  const clearAll = () => { setFile(null); setRawText(null); setDocumentText(null); setStatus("idle"); setError(null); };
  const hasDocument = !!file || !!rawText;

  return (
    <div className="hero-glow" style={{ minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #059669, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(16,185,129,0.3)",
          }}>
            <MessageSquare size={26} color="#fff" aria-hidden="true" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Ask LexAI</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
            Upload a document, then ask any question about it. LexAI answers based only on what your document says.
          </p>
        </div>

        {/* Step 1: Upload */}
        {status === "idle" && (
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <p className="section-label" style={{ color: "#34d399", marginBottom: 12 }}>Step 1 — Upload your document</p>
            {!hasDocument ? (
              <DocumentUploader
                id="qa-doc-upload"
                label="Your legal document"
                onFile={handleFile}
                onText={handleText}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {file ? (
                  <DocumentUploader
                    id="qa-doc-upload"
                    label="Document ready"
                    onFile={handleFile}
                    currentFile={file}
                    onClear={clearAll}
                  />
                ) : (
                  <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <FileText size={16} style={{ color: "#34d399" }} aria-hidden="true" />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Sample NDA loaded</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Ready to chat</p>
                      </div>
                    </div>
                    <button onClick={clearAll} className="btn-ghost" style={{ fontSize: 12 }}>Clear</button>
                  </div>
                )}
                <button
                  onClick={loadDocument}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15, background: "#059669", boxShadow: "0 2px 12px rgba(5,150,105,0.35)" }}
                >
                  <MessageSquare size={17} aria-hidden="true" /> Start Chatting
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="card" style={{ padding: 48, textAlign: "center", marginBottom: 16 }} aria-live="polite" aria-busy="true">
            <Loader2 size={30} className="spinner" style={{ color: "#34d399", margin: "0 auto 12px" }} aria-hidden="true" />
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Loading your document…</p>
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
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>Failed to load document</p>
              <p style={{ fontSize: 12, color: "#fca5a5", marginTop: 4 }}>{error}</p>
              <button onClick={clearAll} className="btn-ghost" style={{ fontSize: 12, marginTop: 8, padding: "2px 0" }}>Try again</button>
            </div>
          </div>
        )}

        {/* Step 2: Chat */}
        {status === "ready" && documentText && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={13} aria-hidden="true" />
                {file?.name ?? "Sample document"} · Ready
              </p>
              <button onClick={clearAll} className="btn-ghost" style={{ fontSize: 12 }}>
                Load different document
              </button>
            </div>
            <ChatInterface documentText={documentText} documentName={file?.name} />
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 32 }}>
          LexAI provides legal information only — not legal advice. Always consult a qualified attorney.
        </p>
      </div>
    </div>
  );
}
