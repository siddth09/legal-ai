"use client";

import { useState, useCallback } from "react";
import { Loader2, FileSearch, AlertCircle } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import AnalysisResult from "@/components/AnalysisResult";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnalysisData = Record<string, any>;

type Status = "idle" | "loading" | "success" | "error";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setRawText(null);
    setStatus("idle");
    setAnalysis(null);
    setError(null);
  }, []);

  const handleText = useCallback((t: string) => {
    setRawText(t);
    setFile(null);
    setStatus("idle");
    setAnalysis(null);
    setError(null);
  }, []);

  const handleClear = () => {
    setFile(null);
    setRawText(null);
    setStatus("idle");
    setAnalysis(null);
    setError(null);
  };

  const analyze = async () => {
    if (!file && !rawText) return;

    setStatus("loading");
    setError(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      else if (rawText) formData.append("text", rawText);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error ?? "Analysis failed");

      setAnalysis(data.analysis);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const hasDocument = !!file || !!rawText;

  return (
    <div className="bg-mesh min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg mb-4">
            <FileSearch size={26} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Document Analyzer</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload any legal document and get a plain-English breakdown with risk flags, key clauses, and an action checklist.
          </p>
        </div>

        {/* Upload */}
        {status !== "success" && (
          <div className="glass rounded-2xl p-6 mb-6">
            {!hasDocument ? (
              <DocumentUploader
                id="doc-upload"
                label="Upload your legal document"
                onFile={handleFile}
                onText={handleText}
              />
            ) : (
              <div className="space-y-4">
                {file ? (
                  <DocumentUploader
                    id="doc-upload"
                    label="Document ready"
                    onFile={handleFile}
                    currentFile={file}
                    onClear={handleClear}
                  />
                ) : (
                  <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Sample NDA loaded</p>
                      <p className="text-xs text-slate-500">Ready to analyze</p>
                    </div>
                    <button
                      onClick={handleClear}
                      className="text-xs text-slate-400 hover:text-slate-200"
                      aria-label="Clear document"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <button
                  onClick={analyze}
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-100"
                  aria-busy={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="spinner" aria-hidden="true" />
                      Analyzing document…
                    </>
                  ) : (
                    <>
                      <FileSearch size={18} aria-hidden="true" />
                      Analyze Document
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div
            className="glass rounded-xl p-4 flex gap-3 items-start mb-6 border-red-800/40 bg-red-950/10"
            role="alert"
          >
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-red-400">Analysis failed</p>
              <p className="text-xs text-red-300/80 mt-1">{error}</p>
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-200 mt-2 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {status === "success" && analysis && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-emerald-400 font-medium">✅ Analysis complete</p>
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Analyze another document
              </button>
            </div>
            <AnalysisResult analysis={analysis as AnalysisData} />
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-600 mt-8">
          LexAI provides legal information only — not legal advice. Always consult a qualified attorney.
        </p>
      </div>
    </div>
  );
}
