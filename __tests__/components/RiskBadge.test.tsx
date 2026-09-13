import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RiskBadge from "@/components/RiskBadge";

describe("RiskBadge", () => {
  it("renders High Risk label", () => {
    render(<RiskBadge risk="high" />);
    expect(screen.getByRole("img", { name: /risk level: high risk/i })).toBeInTheDocument();
  });

  it("renders Medium Risk label", () => {
    render(<RiskBadge risk="medium" />);
    expect(screen.getByRole("img", { name: /risk level: medium risk/i })).toBeInTheDocument();
  });

  it("renders Low Risk label", () => {
    render(<RiskBadge risk="low" />);
    expect(screen.getByRole("img", { name: /risk level: low risk/i })).toBeInTheDocument();
  });

  it("renders Neutral label", () => {
    render(<RiskBadge risk="neutral" />);
    expect(screen.getByRole("img", { name: /risk level: neutral/i })).toBeInTheDocument();
  });

  it("applies correct color classes for high risk", () => {
    const { container } = render(<RiskBadge risk="high" />);
    expect(container.firstChild).toHaveClass("text-red-400");
  });

  it("applies correct color classes for low risk", () => {
    const { container } = render(<RiskBadge risk="low" />);
    expect(container.firstChild).toHaveClass("text-emerald-400");
  });

  it("hides icon when showIcon=false", () => {
    render(<RiskBadge risk="high" showIcon={false} />);
    // Emoji should not be present (showIcon=false)
    const badge = screen.getByRole("img");
    expect(badge.textContent).not.toContain("⚠️");
  });
});
