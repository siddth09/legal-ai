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
  analysis: AnalysisData;
}

type Tab = "overview" | "clauses" | "obligations" | "lawyer";

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  const riskCounts = {
    high:   analysis.clauses.filter((c) => c.risk === "high").length,
    medium: analysis.clauses.filter((c) => c.risk === "medium").length,
    low:    analysis.clauses.filter((c) => c.risk === "low").length,
  };

  const copyChecklist = async () => {
    const text = analysis.checklist.map((item, i) => `${i + 1}. ${item}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview",    label: "Overview" },
    { id: "clauses",     label: "Clauses",     count: analysis.clauses.length },
    { id: "obligations", label: "Obligations" },
    { id: "lawyer",      label: "Lawyer Prep" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in" role="region" aria-label="Document analysis results">

      {/* Header card */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
          }}>
            <Scale size={20} color="#fff" aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--text-primary)" }}>
              {analysis.documentType}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{analysis.summary}</p>
          </div>
        </div>

        {/* Risk summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }} role="list" aria-label="Risk summary">
          {([["high", "High Risk", "#f87171"], ["medium", "Med Risk", "#fbbf24"], ["low", "Low Risk", "#34d399"]] as const).map(([level, label, color]) => (
            <div key={level} style={{
              borderRadius: 10, background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)", padding: "10px 12px", textAlign: "center"
            }} role="listitem">
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{riskCounts[level]}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Parties */}
        {analysis.parties?.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
            <p className="section-label" style={{ marginBottom: 8 }}>Parties</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {analysis.parties.map((p, i) => (
                <span key={i} style={{
                  fontSize: 12, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                  borderRadius: 99, padding: "3px 12px", color: "var(--text-secondary)"
                }}>
                  <span style={{ color: "#60a5fa" }}>{p.role}:</span> {p.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Red flags */}
        {analysis.redFlags?.length > 0 && (
          <div style={{
            marginTop: 14, padding: "12px 14px", borderRadius: 10,
            background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)"
          }} role="alert">
            <p style={{ fontSize: 12, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>
              ⚠️ Red Flags ({analysis.redFlags.length})
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 4 }} aria-label="Red flags list">
              {analysis.redFlags.map((flag, i) => (
                <li key={i} style={{ fontSize: 12, color: "#fca5a5", display: "flex", gap: 8 }}>
                  <span aria-hidden="true" style={{ flexShrink: 0 }}>•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tab strip */}
      <div className="tab-strip" role="tablist" aria-label="Analysis sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`tab-btn${tab === t.id ? " active" : ""}`}
          >
            {t.label}
            {t.count !== undefined && (
              <span style={{ marginLeft: 4, opacity: 0.6 }}>({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>

        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Key dates */}
            {analysis.keyDates?.length > 0 && (
              <div className="card" style={{ padding: "14px 16px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📅 Key Dates</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {analysis.keyDates.map((d, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      fontSize: 13, padding: "8px 0",
                      borderBottom: i < analysis.keyDates.length - 1 ? "1px solid var(--border)" : "none"
                    }}>
                      <span style={{ color: "var(--text-secondary)" }}>{d.label}</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist */}
            <div className="card" style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckSquare size={14} aria-hidden="true" style={{ color: "#60a5fa" }} />
                  Next Steps Checklist
                </h3>
                <button
                  onClick={copyChecklist}
                  className="btn-ghost"
                  style={{ fontSize: 12 }}
                  aria-label={copied ? "Copied!" : "Copy checklist to clipboard"}
                >
                  {copied
                    ? <><Check size={12} style={{ color: "#34d399" }} aria-hidden="true" /> Copied!</>
                    : <><Copy size={12} aria-hidden="true" /> Copy</>}
                </button>
              </div>
              <ol style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0, margin: 0 }} aria-label="Action checklist">
                {analysis.checklist.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                    <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 11, marginTop: 2, flexShrink: 0 }}>{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {tab === "clauses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {analysis.clauses.map((clause, i) => (
              <ClauseCard key={i} clause={clause} index={i} />
            ))}
          </div>
        )}

        {tab === "obligations" && (
          <div className="card" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
            {analysis.obligations?.party1?.length > 0 && (
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
                  {analysis.parties?.[0]?.name ?? "Party 1"} — Obligations
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
                  {analysis.obligations.party1.map((ob, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                      <span style={{ color: "#60a5fa", flexShrink: 0 }} aria-hidden="true">→</span>
                      {ob}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.obligations?.party2?.length > 0 && (
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
                  {analysis.parties?.[1]?.name ?? "Party 2"} — Obligations
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
                  {analysis.obligations.party2.map((ob, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                      <span style={{ color: "#a855f7", flexShrink: 0 }} aria-hidden="true">→</span>
                      {ob}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "lawyer" && (
          <div className="card" style={{ padding: "16px 20px" }}>
            <div style={{
              display: "flex", gap: 10, padding: "10px 14px", borderRadius: 10, marginBottom: 16,
              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)"
            }}>
              <span aria-hidden="true" style={{ flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 12, color: "#fde68a", lineHeight: 1.65 }}>
                These questions were generated based on your specific document. Bring them to your attorney to get the most out of your consultation.
              </p>
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Questions to ask your lawyer</h3>
            <ol style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", padding: 0, margin: 0 }} aria-label="Lawyer preparation questions">
              {analysis.lawyerQuestions?.map((q, i) => (
                <li key={i} style={{
                  display: "flex", gap: 12, fontSize: 13, color: "var(--text-secondary)",
                  padding: "10px 12px", background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)", borderRadius: 9
                }}>
                  <span style={{ color: "#60a5fa", fontWeight: 700, flexShrink: 0, minWidth: 18, textAlign: "center" }}>{i + 1}</span>
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
