import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompareView from "@/components/CompareView";
import type { ComparisonData } from "@/lib/types";

const mockComparison: ComparisonData = {
  summary: "Document B significantly changes the liability terms.",
  overallRisk: "higher",
  overallRiskExplanation: "Several clauses now expose you to greater legal risk.",
  changes: [
    {
      type: "modified",
      section: "Liability Cap",
      documentA: "Liability capped at $10,000.",
      documentB: "Liability uncapped.",
      plainEnglish: "Your financial exposure has been removed from this agreement.",
      significance: "high",
      favoredParty: "B",
    },
    {
      type: "added",
      section: "Arbitration Clause",
      documentA: null,
      documentB: "All disputes shall be resolved by binding arbitration.",
      plainEnglish: "You can no longer sue in court — must use arbitration instead.",
      significance: "high",
      favoredParty: "B",
    },
    {
      type: "removed",
      section: "Termination Notice",
      documentA: "30 days written notice required.",
      documentB: null,
      plainEnglish: "The termination notice requirement has been removed.",
      significance: "medium",
      favoredParty: "B",
    },
  ],
  recommendations: ["Consult your attorney before signing.", "Negotiate the liability cap back in."],
};

describe("CompareView", () => {
  it("renders null when comparison is null", () => {
    const { container } = render(<CompareView comparison={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the comparison summary", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByText(mockComparison.summary)).toBeInTheDocument();
  });

  it("shows the overall risk level", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByText(/higher/i)).toBeInTheDocument();
  });

  it("shows the overall risk explanation", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByText(mockComparison.overallRiskExplanation)).toBeInTheDocument();
  });

  it("renders correct change count stats", () => {
    render(<CompareView comparison={mockComparison} />);
    // 2 high impact changes
    expect(screen.getByText("2")).toBeInTheDocument();
    // medium=1, added=1, removed=1, modified=1 — 4 cells with "1"
    const ones = screen.getAllByText("1");
    expect(ones.length).toBe(4);
  });

  it("shows all 3 changes", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByText("Liability Cap")).toBeInTheDocument();
    expect(screen.getByText("Arbitration Clause")).toBeInTheDocument();
    expect(screen.getByText("Termination Notice")).toBeInTheDocument();
  });

  it("renders plain English description for each change", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByText(/Your financial exposure/i)).toBeInTheDocument();
    expect(screen.getByText(/no longer sue in court/i)).toBeInTheDocument();
  });

  it("renders recommendations section", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByText("💡 Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Consult your attorney before signing.")).toBeInTheDocument();
  });

  it("uses custom document names", () => {
    render(<CompareView comparison={mockComparison} nameA="Original.pdf" nameB="Revised.pdf" />);
    expect(screen.getAllByText("Original.pdf").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Revised.pdf").length).toBeGreaterThan(0);
  });

  it("has accessible region label", () => {
    render(<CompareView comparison={mockComparison} />);
    expect(screen.getByRole("region", { name: /Comparison results/i })).toBeInTheDocument();
  });
});
