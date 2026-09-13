"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Quote } from "lucide-react";
import RiskBadge from "./RiskBadge";

interface Clause {
  title: string;
  plainEnglish: string;
  originalText: string;
  risk: "high" | "medium" | "low" | "neutral";
  riskExplanation: string;
}

interface ClauseCardProps {
  clause: Clause;
  index: number;
}

export default function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const id = `clause-${index}`;
  const contentId = `clause-content-${index}`;

  return (
    <div
      className="glass rounded-xl overflow-hidden fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        id={id}
        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-800/40 text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-3 min-w-0">
          <RiskBadge risk={clause.risk} />
          <span className="font-medium text-sm text-slate-200 truncate">{clause.title}</span>
        </div>
        {expanded
          ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
          : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" aria-hidden="true" />}
      </button>

      {expanded && (
        <div id={contentId} role="region" aria-labelledby={id} className="px-4 pb-4 space-y-3 fade-in">
          {/* Plain English */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Plain English</p>
            <p className="text-sm text-slate-300 leading-relaxed">{clause.plainEnglish}</p>
          </div>

          {/* Risk explanation */}
          {clause.riskExplanation && (
            <div className="flex gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span aria-hidden="true" className="text-sm flex-shrink-0">
                {clause.risk === "high" ? "⚠️" : clause.risk === "medium" ? "🟡" : clause.risk === "low" ? "✅" : "📄"}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">{clause.riskExplanation}</p>
            </div>
          )}

          {/* Original text */}
          {clause.originalText && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Quote size={11} aria-hidden="true" /> Original text
              </p>
              <blockquote className="border-l-2 border-slate-600 pl-3 text-xs text-slate-500 italic leading-relaxed">
                {clause.originalText}
              </blockquote>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
