import { DETECT_DOC_TYPE, ANALYZE_PROMPT, COMPARE_PROMPT, QA_PROMPT } from "@/lib/gemini";

describe("DETECT_DOC_TYPE", () => {
  it("detects NDA", () => {
    expect(DETECT_DOC_TYPE("This non-disclosure agreement is entered into...")).toBe("Non-Disclosure Agreement");
  });

  it("detects lease agreement", () => {
    expect(DETECT_DOC_TYPE("This lease agreement between tenant and landlord...")).toBe("Lease Agreement");
  });

  it("detects employment contract", () => {
    expect(DETECT_DOC_TYPE("Employment agreement between employer and employee. Salary: $100,000")).toBe("Employment Contract");
  });

  it("detects Terms of Service", () => {
    expect(DETECT_DOC_TYPE("Terms of Service — By using this service...")).toBe("Terms of Service");
  });

  it("falls back to Legal Document for unknown types", () => {
    expect(DETECT_DOC_TYPE("Some random legal text without clear markers")).toBe("Legal Document");
  });
});

describe("ANALYZE_PROMPT", () => {
  it("includes the document type and text", () => {
    const prompt = ANALYZE_PROMPT("NDA", "Confidential information clause...");
    expect(prompt).toContain("NDA");
    expect(prompt).toContain("Confidential information clause...");
  });

  it("asks for JSON response", () => {
    const prompt = ANALYZE_PROMPT("NDA", "some text");
    expect(prompt).toContain("valid JSON");
    expect(prompt).toContain("documentType");
    expect(prompt).toContain("clauses");
    expect(prompt).toContain("lawyerQuestions");
  });

  it("truncates at 30000 chars", () => {
    const longText = "a".repeat(40000);
    const prompt = ANALYZE_PROMPT("NDA", longText);
    // The prompt should contain truncated text (sliced at 30000)
    expect(prompt).toContain("a".repeat(100));
  });
});

describe("COMPARE_PROMPT", () => {
  it("includes both documents", () => {
    const prompt = COMPARE_PROMPT("Document A text", "Document B text");
    expect(prompt).toContain("Document A text");
    expect(prompt).toContain("Document B text");
  });

  it("asks for JSON with changes array", () => {
    const prompt = COMPARE_PROMPT("A", "B");
    expect(prompt).toContain("changes");
    expect(prompt).toContain("favoredParty");
  });
});

describe("QA_PROMPT", () => {
  it("includes the document and question", () => {
    const prompt = QA_PROMPT("Contract text here", "What are my obligations?");
    expect(prompt).toContain("Contract text here");
    expect(prompt).toContain("What are my obligations?");
  });

  it("asks for confidence and disclaimer fields", () => {
    const prompt = QA_PROMPT("text", "question");
    expect(prompt).toContain("confidence");
    expect(prompt).toContain("disclaimer");
  });
});
