// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { changeTypeColor, significanceLabel } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Change {
  type: "added" | "removed" | "modified";
  section: string;
  documentA: string | null;
  documentB: string | null;
  plainEnglish: string;
  significance: "high" | "medium" | "low";
  favoredParty: "A" | "B" | "neutral";
}

interface ComparisonData {
  summary: string;
  overallRisk: "higher" | "lower" | "similar";
  overallRiskExplanation: string;
  changes: Change[];
  recommendations: string[];
}

interface CompareViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparison: Record<string, any>;
  nameA?: string;
  nameB?: string;
}

export default function CompareView({ comparison, nameA = "Document A", nameB = "Document B" }: CompareViewProps) {
  const high   = comparison.changes.filter((c) => c.significance === "high").length;
  const medium = comparison.changes.filter((c) => c.significance === "medium").length;
  const added   = comparison.changes.filter((c) => c.type === "added").length;
  const removed = comparison.changes.filter((c) => c.type === "removed").length;
  const modified = comparison.changes.filter((c) => c.type === "modified").length;

  const riskBg = {
    higher: "bg-red-950/20 border-red-800/40 text-red-400",
    lower:  "bg-emerald-950/20 border-emerald-800/40 text-emerald-400",
    similar: "bg-slate-800/40 border-slate-700/40 text-slate-400",
  }[comparison.overallRisk];

  return (
    <div className="space-y-5 fade-in" role="region" aria-label="Comparison results">
      {/* Summary header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">{nameA}</span>
            <ArrowRight size={14} className="text-slate-500" aria-hidden="true" />
            <span className="px-2 py-0.5 bg-violet-600/20 text-violet-400 rounded text-xs">{nameB}</span>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{comparison.summary}</p>

        {/* Overall risk */}
        <div className={`rounded-xl p-3 border flex gap-2 items-start ${riskBg}`} role="note">
          <span aria-hidden="true" className="flex-shrink-0">
            {comparison.overallRisk === "higher" ? "⚠️" : comparison.overallRisk === "lower" ? "✅" : "ℹ️"}
          </span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Risk in {nameB}: {comparison.overallRisk}
            </span>
            <p className="text-xs mt-1 opacity-80">{comparison.overallRiskExplanation}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2 mt-4" role="list" aria-label="Change statistics">
          {[
            { label: "High Impact", value: high, color: "text-red-400" },
            { label: "Med Impact", value: medium, color: "text-amber-400" },
            { label: "Added", value: added, color: "text-emerald-400" },
            { label: "Removed", value: removed, color: "text-red-400" },
            { label: "Modified", value: modified, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-slate-800/50 p-2.5 text-center" role="listitem">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Changes list */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-300 text-sm px-1">
          All changes ({comparison.changes.length})
        </h2>
        {comparison.changes.map((change, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            {/* Change header */}
            <div className="px-4 py-3 flex items-center gap-2 flex-wrap border-b border-slate-800/50">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${changeTypeColor(change.type)}`}>
                {change.type.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-slate-200">{change.section}</span>
              <span className="ml-auto text-xs text-slate-500">{significanceLabel(change.significance)}</span>
              {change.favoredParty !== "neutral" && (
                <span className="text-xs text-slate-500">
                  Favors: <span className={change.favoredParty === "A" ? "text-blue-400" : "text-violet-400"}>
                    {change.favoredParty === "A" ? nameA : nameB}
                  </span>
                </span>
              )}
            </div>

            {/* Plain English */}
            <div className="px-4 py-3">
              <p className="text-sm text-slate-300">{change.plainEnglish}</p>
            </div>

            {/* Diff view */}
            {(change.documentA || change.documentB) && (
              <div className="grid grid-cols-2 gap-0 border-t border-slate-800/50">
                <div className="p-3 border-r border-slate-800/50 bg-red-950/10">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">{nameA}</p>
                  <p className="text-xs text-red-300/80 font-mono leading-relaxed">
                    {change.documentA ?? <span className="italic text-slate-600">Not present</span>}
                  </p>
                </div>
                <div className="p-3 bg-emerald-950/10">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">{nameB}</p>
                  <p className="text-xs text-emerald-300/80 font-mono leading-relaxed">
                    {change.documentB ?? <span className="italic text-slate-600">Not present</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {comparison.recommendations?.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">💡 Recommendations</h3>
          <ul className="space-y-2">
            {comparison.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-400">
                <span className="text-blue-400 flex-shrink-0" aria-hidden="true">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
