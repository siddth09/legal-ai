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

  it("uses red color for high risk (inline style)", () => {
    const { container } = render(<RiskBadge risk="high" />);
    const el = container.firstChild as HTMLElement;
    // Component uses inline styles — check for red color value
    expect(el.style.color).toBe("rgb(248, 113, 113)");
  });

  it("uses green color for low risk (inline style)", () => {
    const { container } = render(<RiskBadge risk="low" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.color).toBe("rgb(52, 211, 153)");
  });

  it("hides icon when showIcon=false", () => {
    render(<RiskBadge risk="high" showIcon={false} />);
    // Emoji should not be present (showIcon=false)
    const badge = screen.getByRole("img");
    expect(badge.textContent).not.toContain("⚠");
  });
});
