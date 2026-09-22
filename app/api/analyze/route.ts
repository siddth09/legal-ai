/**
 * @fileoverview POST /api/analyze — Legal document analysis endpoint.
 *
 * Accepts a legal document (uploaded as a file or pasted as raw text) and
 * returns a comprehensive plain-English analysis powered by Google Gemini AI.
 *
 * The analysis includes:
 * - Document type detection
 * - Plain-English summary
 * - Clause-by-clause breakdown with risk scoring (High / Medium / Low)
 * - Extracted parties, key dates, and obligations
 * - Red flags and an action checklist
 * - Suggested questions to bring to a legal professional
 *
 * Rate-limited per IP. Uploaded files are validated for size (≤ 5 MB) and
 * type (PDF, TXT, MD) before processing.
 */

import { NextRequest, NextResponse } from "next/server";
import { getModel, withRetry, ANALYZE_PROMPT, DETECT_DOC_TYPE } from "@/lib/gemini";
import { truncateText, validateFileSize, validateFileType } from "@/lib/pdf-parser";
import { checkRateLimit } from "@/lib/utils";

export const maxDuration = 60;

/**
 * Analyzes a legal document and returns a structured plain-English breakdown.
 *
 * Accepts either a multipart file upload (`file` field) or a raw text paste
 * (`text` field). File uploads are extracted, then both paths are truncated
 * to 30,000 characters before being sent to Gemini.
 *
 * @param req - Incoming POST request with `FormData` containing `file` or `text`.
 * @returns JSON response with `{ success, analysis, documentText }` or `{ error }`.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file    = formData.get("file")  as File   | null;
    const rawText = formData.get("text")  as string | null;

    let documentText = "";

    // ── File extraction ────────────────────────────────────────────────────────
    if (file) {
      validateFileSize(file, 5);
      validateFileType(file);
      // Dynamic import keeps pdf-parse out of the Edge bundle
      const { extractTextFromFile } = await import("@/lib/pdf-parser");
      documentText = await extractTextFromFile(file);
    } else if (rawText) {
      documentText = rawText;
    } else {
      return NextResponse.json({ error: "No document provided." }, { status: 400 });
    }

    if (!documentText.trim()) {
      return NextResponse.json(
        { error: "Could not extract any text from the document. Try uploading a .txt file." },
        { status: 400 }
      );
    }

    // ── AI analysis ────────────────────────────────────────────────────────────
    const truncated = truncateText(documentText);
    const docType   = DETECT_DOC_TYPE(truncated);

    const model  = getModel();
    const result = await withRetry(() =>
      model.generateContent(ANALYZE_PROMPT(docType, truncated))
    );
    const responseText = result.response.text();

    // Gemini sometimes wraps JSON in a markdown code fence — extract it safely
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned an unexpected response format.");

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(
      { success: true, analysis, documentText: truncated },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: unknown) {
    console.error("[Analyze] Error:", err);
    const isKnown = err instanceof Error && !err.message.includes("    at ");
    const message = isKnown ? err.message : "Analysis failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
