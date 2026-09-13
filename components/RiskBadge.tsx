"use client";

import { riskColor, riskIcon } from "@/lib/utils";

interface RiskBadgeProps {
  risk: "high" | "medium" | "low" | "neutral";
  showIcon?: boolean;
  size?: "sm" | "md";
}

export default function RiskBadge({ risk, showIcon = true, size = "sm" }: RiskBadgeProps) {
  const labels: Record<string, string> = {
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk",
    neutral: "Neutral",
  };

  const sizeClass = size === "sm"
    ? "px-2 py-0.5 text-xs"
    : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${riskColor(risk)} ${sizeClass}`}
      role="img"
      aria-label={`Risk level: ${labels[risk]}`}
    >
      {showIcon && <span aria-hidden="true">{riskIcon(risk)}</span>}
      {labels[risk]}
    </span>
  );
}
