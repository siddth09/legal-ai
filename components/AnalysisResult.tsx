// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState } from "react";
import { CheckSquare, Copy, Check, Scale } from "lucide-react";
import RiskBadge from "./RiskBadge";
import ClauseCard from "./ClauseCard";

interface AnalysisData {
  documentType: string;
  summary: string;
  parties: { name: string; role: string }[];
  keyDates: { label: string; date: string }[];
  clauses: {
    title: string;
    plainEnglish: string;
    originalText: string;
    risk: "high" | "medium" | "low" | "neutral";
    riskExplanation: string;
  }[];
  obligations: { party1: string[]; party2: string[] };
  redFlags: string[];
  lawyerQuestions: string[];
  checklist: string[];
}

interface AnalysisResultProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysis: Record<string, any>;
}

type Tab = "overview" | "clauses" | "obligations" | "lawyer";

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  const riskCounts = {
    high: analysis.clauses.filter((c) => c.risk === "high").length,
    medium: analysis.clauses.filter((c) => c.risk === "medium").length,
    low: analysis.clauses.filter((c) => c.risk === "low").length,
  };

  const copyChecklist = async () => {
    const text = analysis.checklist.map((item, i) => `${i + 1}. ${item}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "clauses", label: "Clauses", count: analysis.clauses.length },
    { id: "obligations", label: "Obligations" },
    { id: "lawyer", label: "Lawyer Prep" },
  ];

  return (
    <div className="space-y-6 fade-in" role="region" aria-label="Document analysis results">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Scale size={22} className="text-white" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-bold text-lg text-slate-100">{analysis.documentType}</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{analysis.summary}</p>
          </div>
        </div>

        {/* Risk summary */}
        <div className="grid grid-cols-3 gap-3 mt-5" role="list" aria-label="Risk summary">
          {([["high", "High Risk"], ["medium", "Med Risk"], ["low", "Low Risk"]] as const).map(([level, label]) => (
            <div key={level} className="rounded-lg bg-slate-800/60 p-3 text-center" role="listitem">
              <div className={`text-2xl font-bold ${level === "high" ? "text-red-400" : level === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                {riskCounts[level]}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Parties */}
        {analysis.parties?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Parties</p>
            <div className="flex flex-wrap gap-2">
              {analysis.parties.map((p, i) => (
                <span key={i} className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-slate-300">
                  <span className="text-blue-400">{p.role}:</span> {p.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Red flags */}
        {analysis.redFlags?.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/20 border border-red-800/40" role="alert">
            <p className="text-xs font-semibold text-red-400 mb-2">⚠️ Red Flags ({analysis.redFlags.length})</p>
            <ul className="space-y-1" aria-label="Red flags list">
              {analysis.redFlags.map((flag, i) => (
                <li key={i} className="text-xs text-red-300 flex gap-2">
                  <span aria-hidden="true" className="flex-shrink-0">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Analysis sections" className="flex gap-1 glass rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-blue-600/20 text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1 opacity-60">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "overview" && (
          <div className="space-y-4">
            {/* Key dates */}
            {analysis.keyDates?.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">📅 Key Dates</h3>
                <div className="space-y-2">
                  {analysis.keyDates.map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800/60 last:border-0">
                      <span className="text-slate-400">{d.label}</span>
                      <span className="text-slate-200 font-medium">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <CheckSquare size={15} aria-hidden="true" /> Next Steps Checklist
                </h3>
                <button
                  onClick={copyChecklist}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  aria-label={copied ? "Copied!" : "Copy checklist to clipboard"}
                >
                  {copied ? <Check size={13} className="text-emerald-400" aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <ul className="space-y-2" aria-label="Action checklist">
                {analysis.checklist.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-blue-500 flex-shrink-0 font-bold text-xs mt-0.5">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "clauses" && (
          <div className="space-y-2">
            {analysis.clauses.map((clause, i) => (
              <ClauseCard key={i} clause={clause} index={i} />
            ))}
          </div>
        )}

        {tab === "obligations" && (
          <div className="glass rounded-xl p-5 space-y-5">
            {analysis.obligations?.party1?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  {analysis.parties?.[0]?.name ?? "Party 1"} Obligations
                </h3>
                <ul className="space-y-2">
                  {analysis.obligations.party1.map((ob, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-400">
                      <span className="text-blue-500 flex-shrink-0" aria-hidden="true">→</span>
                      {ob}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.obligations?.party2?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  {analysis.parties?.[1]?.name ?? "Party 2"} Obligations
                </h3>
                <ul className="space-y-2">
                  {analysis.obligations.party2.map((ob, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-400">
                      <span className="text-violet-400 flex-shrink-0" aria-hidden="true">→</span>
                      {ob}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "lawyer" && (
          <div className="glass rounded-xl p-5">
            <div className="flex items-start gap-3 mb-5 p-3 rounded-lg bg-amber-950/20 border border-amber-800/30">
              <span aria-hidden="true" className="text-amber-400 flex-shrink-0">💡</span>
              <p className="text-xs text-amber-300 leading-relaxed">
                These questions were generated based on your specific document. Bring them to your attorney to get the most out of your consultation.
              </p>
            </div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Questions to ask your lawyer</h3>
            <ol className="space-y-3" aria-label="Lawyer preparation questions">
              {analysis.lawyerQuestions?.map((q, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300 p-3 bg-slate-800/40 rounded-lg">
                  <span className="text-blue-400 font-bold flex-shrink-0 w-5 text-center">{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
