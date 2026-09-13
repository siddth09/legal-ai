import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY && process.env.NODE_ENV !== "test") {
  console.warn(
    "GEMINI_API_KEY is not set. AI features will not work. " +
      "Copy .env.example to .env.local and add your key."
  );
}

export const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export function getModel() {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// ─── Prompt Templates ────────────────────────────────────────────────────────

export const ANALYZE_PROMPT = (docType: string, text: string) => `
You are an expert legal document analyst. Your job is to help everyday people understand their legal documents clearly and plainly. You do NOT provide legal advice — you provide information and explanations.

Document type detected: ${docType}

DOCUMENT TEXT:
"""
${text.slice(0, 30000)}
"""

Analyze this document and respond in valid JSON only, with this exact structure:
{
  "documentType": "string (e.g. Employment Contract, NDA, Lease Agreement, Terms of Service, etc.)",
  "summary": "string (2-4 sentences in plain English, no legal jargon)",
  "parties": [{ "name": "string", "role": "string" }],
  "keyDates": [{ "label": "string", "date": "string" }],
  "clauses": [
    {
      "title": "string",
      "plainEnglish": "string (plain-language explanation)",
      "originalText": "string (exact quote from document)",
      "risk": "high" | "medium" | "low" | "neutral",
      "riskExplanation": "string (why this risk level)"
    }
  ],
  "obligations": {
    "party1": ["string"],
    "party2": ["string"]
  },
  "redFlags": ["string"],
  "lawyerQuestions": ["string (question to ask a lawyer)"],
  "checklist": ["string (action item)"]
}

Rules:
- Extract 5-10 most important clauses
- Be honest about risks — flag unusual or one-sided terms
- Plain English only in explanations
- lawyerQuestions: 5-7 smart questions to bring to an attorney
- checklist: 3-6 actionable next steps
`;

export const COMPARE_PROMPT = (textA: string, textB: string) => `
You are an expert legal document analyst. Compare these two versions of a legal document and identify ALL meaningful differences.

DOCUMENT A:
"""
${textA.slice(0, 15000)}
"""

DOCUMENT B:
"""
${textB.slice(0, 15000)}
"""

Respond in valid JSON only, with this exact structure:
{
  "summary": "string (2-3 sentence overview of the key differences)",
  "overallRisk": "higher" | "lower" | "similar",
  "overallRiskExplanation": "string",
  "changes": [
    {
      "type": "added" | "removed" | "modified",
      "section": "string (section/clause name)",
      "documentA": "string (text from doc A, or null if added)",
      "documentB": "string (text from doc B, or null if removed)",
      "plainEnglish": "string (what this change means in plain English)",
      "significance": "high" | "medium" | "low",
      "favoredParty": "A" | "B" | "neutral"
    }
  ],
  "recommendations": ["string"]
}

Rules:
- Focus on substantive changes, not formatting
- Flag any changes that significantly alter rights, obligations, or liability
- Be specific about which party benefits from each change
`;

export const QA_PROMPT = (documentText: string, question: string) => `
You are a helpful legal document assistant. A user has uploaded a legal document and is asking a question about it. Answer ONLY based on what the document says — do not make up information not in the document.

DOCUMENT TEXT:
"""
${documentText.slice(0, 30000)}
"""

USER QUESTION: ${question}

Respond in valid JSON only:
{
  "answer": "string (clear, plain-English answer based on the document)",
  "relevantText": "string (exact quote from document that supports your answer, or null if not found)",
  "confidence": "high" | "medium" | "low",
  "disclaimer": "string (brief note if the question needs professional legal advice)",
  "followUpQuestions": ["string (2-3 related questions the user might want to ask)"]
}

If the document does not contain information to answer the question, say so clearly.
`;

export const DETECT_DOC_TYPE = (text: string): string => {
  const lower = text.toLowerCase().slice(0, 2000);
  if (lower.includes("lease") || lower.includes("tenant") || lower.includes("landlord")) return "Lease Agreement";
  if (lower.includes("employment") || lower.includes("employee") || lower.includes("salary")) return "Employment Contract";
  if (lower.includes("non-disclosure") || lower.includes("confidential") || lower.includes("nda")) return "Non-Disclosure Agreement";
  if (lower.includes("terms of service") || lower.includes("terms and conditions")) return "Terms of Service";
  if (lower.includes("privacy policy")) return "Privacy Policy";
  if (lower.includes("purchase") || lower.includes("sale") || lower.includes("buyer") || lower.includes("seller")) return "Purchase Agreement";
  if (lower.includes("service agreement") || lower.includes("contractor") || lower.includes("freelance")) return "Service Agreement";
  if (lower.includes("loan") || lower.includes("mortgage") || lower.includes("promissory")) return "Loan Agreement";
  return "Legal Document";
};
