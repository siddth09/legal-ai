/**
 * @fileoverview Tests for lib/validators.ts
 *
 * Verifies that all validation functions correctly accept valid inputs,
 * reject invalid inputs with descriptive error messages, and sanitize
 * user-supplied strings.
 */

import { validateQABody, validateTextField, MAX_QUESTION_CHARS, MAX_TEXT_CHARS } from "@/lib/validators";

// ─── validateQABody ───────────────────────────────────────────────────────────

describe("validateQABody", () => {
  const validBody = {
    documentText: "This is a valid NDA agreement between Party A and Party B.",
    question:     "What are my confidentiality obligations?",
  };

  it("returns ok:true for a valid body", () => {
    const result = validateQABody(validBody);
    expect(result.ok).toBe(true);
  });

  it("returns sanitized data on success", () => {
    const body = {
      documentText: "<b>Bold</b> legal text.",
      question:     "What does <em>this</em> mean?",
    };
    const result = validateQABody(body);
    if (!result.ok) throw new Error(result.error);
    expect(result.data.documentText).not.toContain("<b>");
    expect(result.data.question).not.toContain("<em>");
  });

  it("fails for null body", () => {
    const result = validateQABody(null);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.status).toBe(400);
  });

  it("fails for non-object body", () => {
    const result = validateQABody("just a string");
    expect(result.ok).toBe(false);
  });

  it("fails when documentText is missing", () => {
    const result = validateQABody({ question: "What is this?" });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.error).toMatch(/documentText/i);
  });

  it("fails when question is missing", () => {
    const result = validateQABody({ documentText: "Some legal text." });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.error).toMatch(/question/i);
  });

  it("fails when question is empty string", () => {
    const result = validateQABody({ documentText: "Some legal text.", question: "   " });
    expect(result.ok).toBe(false);
  });

  it(`fails when question exceeds ${MAX_QUESTION_CHARS} characters`, () => {
    const result = validateQABody({
      documentText: validBody.documentText,
      question:     "q".repeat(MAX_QUESTION_CHARS + 1),
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.error).toContain(String(MAX_QUESTION_CHARS));
    expect(result.status).toBe(400);
  });

  it(`fails when documentText exceeds ${MAX_TEXT_CHARS} characters`, () => {
    const result = validateQABody({
      documentText: "x".repeat(MAX_TEXT_CHARS + 1),
      question:     validBody.question,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.status).toBe(400);
  });

  it("fails when documentText is not a string", () => {
    const result = validateQABody({ documentText: 12345, question: "What?" });
    expect(result.ok).toBe(false);
  });

  it("fails when question is not a string", () => {
    const result = validateQABody({ documentText: "Legal text.", question: ["array"] });
    expect(result.ok).toBe(false);
  });
});

// ─── validateTextField ────────────────────────────────────────────────────────

describe("validateTextField", () => {
  it("returns ok:true for valid text", () => {
    const result = validateTextField("Hello world", "myField");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success");
    expect(result.data).toBe("Hello world");
  });

  it("sanitizes HTML in the text", () => {
    const result = validateTextField("<script>xss</script>Clean text", "myField");
    if (!result.ok) throw new Error(result.error);
    expect(result.data).not.toContain("<script>");
    expect(result.data).toBe("Clean text");
  });

  it("fails for empty string", () => {
    const result = validateTextField("", "myField");
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.error).toContain("myField");
  });

  it("fails for whitespace-only string", () => {
    const result = validateTextField("   ", "myField");
    expect(result.ok).toBe(false);
  });

  it("fails when text exceeds the max length", () => {
    const result = validateTextField("a".repeat(101), "myField", 100);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failure");
    expect(result.error).toContain("101");
    expect(result.status).toBe(400);
  });

  it("accepts text at exactly the max length", () => {
    const result = validateTextField("a".repeat(100), "myField", 100);
    expect(result.ok).toBe(true);
  });

  it("fails for non-string input", () => {
    const result = validateTextField(42, "myField");
    expect(result.ok).toBe(false);
  });
});
