"use client";

import Link from "next/link";
import { FileSearch, GitCompare, MessageSquare, ArrowRight } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Document Analyzer",
    desc: "Upload any legal document and get a plain-English breakdown — summary, risk flags, key clauses, and your action checklist.",
    href: "/analyze",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    shadow: "rgba(59,130,246,0.2)",
    badge: "Most Popular",
  },
  {
    icon: GitCompare,
    title: "Contract Comparator",
    desc: "Upload two document versions and see every meaningful change — what shifted, who benefits, and what it means.",
    href: "/compare",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    shadow: "rgba(124,58,237,0.2)",
    badge: null,
  },
  {
    icon: MessageSquare,
    title: "Ask LexAI",
    desc: "Chat with your document. Ask anything in plain English and get grounded answers with direct quotes.",
    href: "/qa",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    shadow: "rgba(16,185,129,0.2)",
    badge: null,
  },
];

export default function FeatureCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      {features.map((f) => {
        const Icon = f.icon;
        return (
          <Link
            key={f.href}
            href={f.href}
            className="card card-hover"
            style={{
              padding: 24, display: "block", textDecoration: "none",
              position: "relative", overflow: "hidden",
              transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 30px ${f.shadow}`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
            aria-label={`Go to ${f.title}`}
          >
            {f.badge && (
              <span style={{
                position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700,
                background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.25)", borderRadius: 99, padding: "2px 8px"
              }}>
                {f.badge}
              </span>
            )}
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: f.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, boxShadow: `0 4px 16px ${f.shadow}`
            }}>
              <Icon size={20} color="#fff" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 18, fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>
              Try it <ArrowRight size={12} aria-hidden="true" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
