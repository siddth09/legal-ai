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
  comparison: ComparisonData;
  nameA?: string;
  nameB?: string;
}

const riskStyle = {
  higher:  { bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.2)",  color: "#fca5a5", icon: "⚠️" },
  lower:   { bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.2)",   color: "#6ee7b7", icon: "✅" },
  similar: { bg: "rgba(148,163,184,0.07)", border: "rgba(148,163,184,0.15)", color: "#94a3b8", icon: "ℹ️" },
};

export default function CompareView({ comparison, nameA = "Document A", nameB = "Document B" }: CompareViewProps) {
  const high     = comparison.changes.filter((c) => c.significance === "high").length;
  const medium   = comparison.changes.filter((c) => c.significance === "medium").length;
  const added    = comparison.changes.filter((c) => c.type === "added").length;
  const removed  = comparison.changes.filter((c) => c.type === "removed").length;
  const modified = comparison.changes.filter((c) => c.type === "modified").length;

  const rs = riskStyle[comparison.overallRisk];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-in" role="region" aria-label="Comparison results">

      {/* Header */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
            {nameA}
          </span>
          <ArrowRight size={13} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "rgba(124,58,237,0.12)", color: "#a78bfa" }}>
            {nameB}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 14 }}>{comparison.summary}</p>

        {/* Overall risk */}
        <div style={{
          padding: "10px 14px", borderRadius: 10, border: `1px solid ${rs.border}`,
          background: rs.bg, display: "flex", gap: 10, alignItems: "flex-start"
        }} role="note">
          <span aria-hidden="true" style={{ flexShrink: 0 }}>{rs.icon}</span>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: rs.color }}>
              Risk in {nameB}: {comparison.overallRisk}
            </span>
            <p style={{ fontSize: 12, marginTop: 4, color: rs.color, opacity: 0.8, lineHeight: 1.55 }}>
              {comparison.overallRiskExplanation}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginTop: 14 }} role="list" aria-label="Change statistics">
          {[
            { label: "High Impact", value: high,     color: "#f87171" },
            { label: "Med Impact",  value: medium,   color: "#fbbf24" },
            { label: "Added",       value: added,    color: "#34d399" },
            { label: "Removed",     value: removed,  color: "#f87171" },
            { label: "Modified",    value: modified, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} style={{
              borderRadius: 9, background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)", padding: "8px 4px", textAlign: "center"
            }} role="listitem">
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Changes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", paddingLeft: 2 }}>
          All changes ({comparison.changes.length})
        </h2>
        {comparison.changes.map((change, i) => (
          <div key={i} className="card fade-in" style={{ overflow: "hidden", animationDelay: `${i * 35}ms` }}>
            {/* Change header */}
            <div style={{
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
              flexWrap: "wrap", borderBottom: "1px solid var(--border)"
            }}>
              <span style={{ fontSize: 10, fontWeight: 700 }} className={changeTypeColor(change.type)}>
                {change.type.toUpperCase()}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{change.section}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{significanceLabel(change.significance)}</span>
              {change.favoredParty !== "neutral" && (
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Favors:{" "}
                  <span style={{ color: change.favoredParty === "A" ? "#60a5fa" : "#a78bfa" }}>
                    {change.favoredParty === "A" ? nameA : nameB}
                  </span>
                </span>
              )}
            </div>

            {/* Plain English */}
            <div style={{ padding: "10px 14px" }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{change.plainEnglish}</p>
            </div>

            {/* Diff view */}
            {(change.documentA || change.documentB) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)" }}>
                <div style={{ padding: "10px 14px", borderRight: "1px solid var(--border)", background: "rgba(248,113,113,0.04)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>{nameA}</p>
                  <p style={{ fontSize: 11, fontFamily: "monospace", color: "#fca5a5", lineHeight: 1.6, opacity: 0.85 }}>
                    {change.documentA ?? <span style={{ fontStyle: "italic", color: "var(--text-muted)" }}>Not present</span>}
                  </p>
                </div>
                <div style={{ padding: "10px 14px", background: "rgba(52,211,153,0.04)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>{nameB}</p>
                  <p style={{ fontSize: 11, fontFamily: "monospace", color: "#6ee7b7", lineHeight: 1.6, opacity: 0.85 }}>
                    {change.documentB ?? <span style={{ fontStyle: "italic", color: "var(--text-muted)" }}>Not present</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {comparison.recommendations?.length > 0 && (
        <div className="card" style={{ padding: "16px 20px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>💡 Recommendations</h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
            {comparison.recommendations.map((rec, i) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                <span style={{ color: "#60a5fa", flexShrink: 0 }} aria-hidden="true">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
