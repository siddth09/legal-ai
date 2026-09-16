import Link from "next/link";
import { FileSearch, GitCompare, MessageSquare, ArrowRight, Shield } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Document Analyzer",
    desc: "Upload any legal document and get a plain-English breakdown — summary, risk flags, key clauses, and your action checklist.",
    href: "/analyze",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    shadow: "rgba(59,130,246,0.25)",
    badge: "Most Popular",
  },
  {
    icon: GitCompare,
    title: "Contract Comparator",
    desc: "Upload two document versions and see every meaningful change — what shifted, who benefits, and what it means.",
    href: "/compare",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    shadow: "rgba(124,58,237,0.25)",
    badge: null,
  },
  {
    icon: MessageSquare,
    title: "Ask LexAI",
    desc: "Chat with your document. Ask anything in plain English and get grounded answers with direct quotes.",
    href: "/qa",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    shadow: "rgba(16,185,129,0.25)",
    badge: null,
  },
];

const stats = [
  { value: "5+",    label: "Document types" },
  { value: "Free",  label: "No sign-up" },
  { value: "AI",    label: "Gemini powered" },
  { value: "100%",  label: "Privacy-first" },
];

const useCases = ["Lease Agreements", "Employment Contracts", "NDAs", "Terms of Service", "Loan Agreements", "Purchase Agreements", "Service Contracts", "Privacy Policies"];

const steps = [
  { icon: "📄", step: "01", title: "Upload your document", desc: "PDF or plain text — any legal document works." },
  { icon: "⚡", step: "02", title: "AI reads everything",  desc: "Gemini extracts clauses, parties, dates, and risks." },
  { icon: "✅", step: "03", title: "Act with confidence",  desc: "Get a plain-English summary and your next-step checklist." },
];

export default function HomePage() {
  return (
    <div className="hero-glow">
      {/* ── Hero ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
          color: "#60a5fa", fontSize: 12, fontWeight: 600,
          padding: "5px 14px", borderRadius: 99, marginBottom: 28,
        }}>
          <Shield size={11} aria-hidden="true" />
          AI-powered · Not legal advice · Privacy-first
        </div>

        <h1 style={{ fontSize: "clamp(34px,6vw,62px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
          Understand Any Legal<br />
          <span className="gradient-text">Document in Seconds</span>
        </h1>

        <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>
          LexAI uses AI to decode contracts, flag risks, compare agreements, and help you
          ask the right questions — so you&apos;re never lost in legal language again.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
          <Link href="/analyze" className="btn-primary" style={{ padding: "12px 22px", fontSize: 15 }}>
            <FileSearch size={17} aria-hidden="true" />
            Analyze a Document
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/compare" className="btn-secondary" style={{ padding: "12px 22px", fontSize: 15 }}>
            <GitCompare size={17} aria-hidden="true" />
            Compare Contracts
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, maxWidth: 400, margin: "0 auto" }}
          role="list" aria-label="LexAI statistics">
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ padding: "14px 8px", textAlign: "center" }} role="listitem">
              <div style={{ fontSize: 20, fontWeight: 800, color: "#60a5fa" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 72px" }} aria-labelledby="features-heading">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p className="section-label" style={{ marginBottom: 10 }}>What you can do</p>
          <h2 id="features-heading" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Three tools. Zero legal expertise required.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link key={f.href} href={f.href} className="card card-hover"
                style={{ padding: 22, display: "block", textDecoration: "none", position: "relative", overflow: "hidden", transition: "all 0.2s" }}
                aria-label={`Go to ${f.title}`}>
                {f.badge && (
                  <span style={{
                    position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700,
                    background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                    border: "1px solid rgba(59,130,246,0.25)", borderRadius: 99, padding: "2px 8px"
                  }}>{f.badge}</span>
                )}
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: f.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14, boxShadow: `0 4px 14px ${f.shadow}`
                }}>
                  <Icon size={19} color="#fff" aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 7, color: "var(--text-primary)" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16, fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>
                  Try it <ArrowRight size={12} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Use cases ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 32px" }}>
        <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
          Works with
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {useCases.map((uc) => (
            <span key={uc} className="card" style={{ padding: "5px 14px", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
              {uc}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 72px" }} aria-labelledby="how-heading">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="section-label" style={{ marginBottom: 10 }}>Simple workflow</p>
          <h2 id="how-heading" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>How it works</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: "var(--bg-card)",
                border: "1px solid var(--border)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, margin: "0 auto 12px"
              }} aria-hidden="true">{s.icon}</div>
              <p className="section-label" style={{ marginBottom: 5 }}>Step {s.step}</p>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 72px" }}>
        <div className="card" style={{ padding: 18, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Shield size={15} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
            <strong style={{ color: "#fbbf24" }}>Important:</strong>{" "}
            LexAI provides legal <strong style={{ color: "var(--text-primary)" }}>information</strong> only — not legal advice.
            AI-generated analysis may contain errors. Always consult a qualified attorney before making decisions based on any legal document.
          </p>
        </div>
      </section>
    </div>
  );
}
