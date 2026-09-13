"use client";

import { useState, useCallback } from "react";
import { MessageSquare, Loader2, AlertCircle, FileText } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import ChatInterface from "@/components/ChatInterface";

type Status = "idle" | "loading" | "ready" | "error";

export default function QAPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setRawText(null);
    setDocumentText(null);
    setStatus("idle");
    setError(null);
  }, []);

  const handleText = useCallback((t: string) => {
    setRawText(t);
    setFile(null);
    setDocumentText(null);
    setStatus("idle");
    setError(null);
  }, []);

  const loadDocument = async () => {
    if (!file && !rawText) return;
    setStatus("loading");
    setError(null);

    try {
      if (rawText) {
        // Text is already available
        setDocumentText(rawText);
        setStatus("ready");
        return;
      }

      // For PDF files, extract text via analyze endpoint (reuses our extraction logic)
      const formData = new FormData();
      if (file) formData.append("file", file);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to load document");

      setDocumentText(data.documentText);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document.");
      setStatus("error");
    }
  };

  const clearAll = () => {
    setFile(null);
    setRawText(null);
    setDocumentText(null);
    setStatus("idle");
    setError(null);
  };

  const hasDocument = !!file || !!rawText;

  return (
    <div className="bg-mesh min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-4">
            <MessageSquare size={26} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Ask LexAI</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload a document, then ask any question about it. LexAI answers based only on what your document says.
          </p>
        </div>

        {/* Step 1: Upload */}
        {status === "idle" && (
          <div className="glass rounded-2xl p-6 mb-6">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Step 1 — Upload your document</p>

            {!hasDocument ? (
              <DocumentUploader
                id="qa-doc-upload"
                label="Upload your legal document"
                onFile={handleFile}
                onText={handleText}
              />
            ) : (
              <div className="space-y-4">
                {file ? (
                  <DocumentUploader
                    id="qa-doc-upload"
                    label="Document ready"
                    onFile={handleFile}
                    currentFile={file}
                    onClear={clearAll}
                  />
                ) : (
                  <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-emerald-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">Sample NDA loaded</p>
                        <p className="text-xs text-slate-500">Ready to chat</p>
                      </div>
                    </div>
                    <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-200">Clear</button>
                  </div>
                )}

                <button
                  onClick={loadDocument}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-100"
                >
                  <MessageSquare size={18} aria-hidden="true" />
                  Start Chatting
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="glass rounded-2xl p-8 text-center mb-6" aria-live="polite" aria-busy="true">
            <Loader2 size={32} className="spinner text-emerald-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-slate-400 text-sm">Loading your document…</p>
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="glass rounded-xl p-4 flex gap-3 items-start mb-6 border-red-800/40 bg-red-950/10" role="alert">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-red-400">Failed to load document</p>
              <p className="text-xs text-red-300/80 mt-1">{error}</p>
              <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-200 mt-2 underline">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Chat */}
        {status === "ready" && documentText && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                <FileText size={14} aria-hidden="true" />
                {file?.name ?? "Sample document"} · Ready
              </p>
              <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-200 underline">
                Load different document
              </button>
            </div>
            <ChatInterface
              documentText={documentText}
              documentName={file?.name}
            />
          </div>
        )}

        <p className="text-center text-xs text-slate-600 mt-8">
          LexAI provides legal information only — not legal advice. Always consult a qualified attorney.
        </p>
      </div>
    </div>
  );
}
