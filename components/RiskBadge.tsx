"use client";

interface RiskBadgeProps {
  risk: "high" | "medium" | "low" | "neutral";
  showIcon?: boolean;
}

const config: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  high:    { label: "High Risk",   color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)", icon: "⚠" },
  medium:  { label: "Medium Risk", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.25)",  icon: "⚡" },
  low:     { label: "Low Risk",    color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)",  icon: "✓" },
  neutral: { label: "Neutral",     color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.15)", icon: "·" },
};

export default function RiskBadge({ risk, showIcon = true }: RiskBadgeProps) {
  const c = config[risk] ?? config.neutral;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 11, fontWeight: 700, lineHeight: 1,
        color: c.color, background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 99, padding: "3px 9px",
        whiteSpace: "nowrap",
      }}
      role="img"
      aria-label={`Risk level: ${c.label}`}
    >
      {showIcon && <span aria-hidden="true">{c.icon}</span>}
      {c.label}
    </span>
  );
}
