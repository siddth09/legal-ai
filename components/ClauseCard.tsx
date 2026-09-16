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

const riskIcon = (r: string) =>
  r === "high" ? "⚠️" : r === "medium" ? "🟡" : r === "low" ? "✅" : "📄";

export default function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const id = `clause-${index}`;
  const contentId = `clause-content-${index}`;

  return (
    <div
      className="card fade-in"
      style={{ overflow: "hidden", animationDelay: `${index * 40}ms` }}
    >
      <button
        id={id}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          padding: "12px 16px", textAlign: "left",
          background: "none", border: "none", cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <RiskBadge risk={clause.risk} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {clause.title}
          </span>
        </div>
        {expanded
          ? <ChevronUp size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} aria-hidden="true" />
          : <ChevronDown size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} aria-hidden="true" />}
      </button>

      {expanded && (
        <div id={contentId} role="region" aria-labelledby={id}
          style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}
          className="fade-in"
        >
          {/* Plain English */}
          <div>
            <p className="section-label" style={{ marginBottom: 6 }}>Plain English</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{clause.plainEnglish}</p>
          </div>

          {/* Risk explanation */}
          {clause.riskExplanation && (
            <div style={{
              display: "flex", gap: 10, padding: "10px 12px", borderRadius: 9,
              background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
            }}>
              <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 13 }}>{riskIcon(clause.risk)}</span>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{clause.riskExplanation}</p>
            </div>
          )}

          {/* Original text */}
          {clause.originalText && (
            <div>
              <p className="section-label" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <Quote size={10} aria-hidden="true" />
                Original text
              </p>
              <blockquote style={{
                borderLeft: "2px solid rgba(255,255,255,0.1)",
                paddingLeft: 12, fontSize: 12,
                color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.65,
              }}>
                {clause.originalText}
              </blockquote>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
