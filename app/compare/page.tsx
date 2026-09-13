"use client";

import { useState, useCallback } from "react";
import { Loader2, GitCompare, AlertCircle } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import CompareView from "@/components/CompareView";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComparisonData = Record<string, any>;

type Status = "idle" | "loading" | "success" | "error";

export default function ComparePage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearAll = () => {
    setFileA(null);
    setFileB(null);
    setStatus("idle");
    setComparison(null);
    setError(null);
  };

  const compare = async () => {
    if (!fileA || !fileB) return;
    setStatus("loading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fileA", fileA);
      formData.append("fileB", fileB);

      const res = await fetch("/api/compare", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error ?? "Comparison failed");

      setComparison(data.comparison);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const canCompare = !!fileA && !!fileB;

  return (
    <div className="bg-mesh min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg mb-4">
            <GitCompare size={26} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Contract Comparator</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload two versions of a document. LexAI will identify every meaningful change and explain what each one means for you.
          </p>
        </div>

        {/* Upload area */}
        {status !== "success" && (
          <div className="glass rounded-2xl p-6 mb-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <DocumentUploader
                  id="file-a"
                  label="Document A (Original)"
                  onFile={setFileA}
                  currentFile={fileA}
                  onClear={() => setFileA(null)}
                />
              </div>
              <div>
                <DocumentUploader
                  id="file-b"
                  label="Document B (Revised)"
                  onFile={setFileB}
                  currentFile={fileB}
                  onClear={() => setFileB(null)}
                />
              </div>
            </div>

            {canCompare && (
              <button
                onClick={compare}
                disabled={status === "loading"}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-100"
                aria-busy={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="spinner" aria-hidden="true" />
                    Comparing documents…
                  </>
                ) : (
                  <>
                    <GitCompare size={18} aria-hidden="true" />
                    Compare Documents
                  </>
                )}
              </button>
            )}

            {!canCompare && (
              <p className="text-center text-sm text-slate-500">
                Upload both documents to enable comparison
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="glass rounded-xl p-4 flex gap-3 items-start mb-6 border-red-800/40 bg-red-950/10" role="alert">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-red-400">Comparison failed</p>
              <p className="text-xs text-red-300/80 mt-1">{error}</p>
              <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-200 mt-2 underline">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {status === "success" && comparison && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-emerald-400 font-medium">✅ Comparison complete</p>
              <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-200 underline">
                Compare different documents
              </button>
            </div>
            <CompareView
              comparison={comparison as ComparisonData}
              nameA={fileA?.name ?? "Document A"}
              nameB={fileB?.name ?? "Document B"}
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
