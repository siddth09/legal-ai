export default function QALoading() {
  return (
    <div className="hero-glow" style={{ minHeight: "100vh", padding: "48px 0" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border)", margin: "0 auto 16px" }} aria-hidden="true" />
          <div style={{ height: 32, width: 180, background: "var(--bg-card)", borderRadius: 8, margin: "0 auto 12px" }} aria-hidden="true" />
        </div>
        <div className="card" style={{ padding: 24, height: 240 }} aria-busy="true" aria-label="Loading Ask LexAI" />
      </div>
    </div>
  );
}
