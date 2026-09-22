/**
 * @fileoverview POST /api/compare — Contract comparison endpoint.
 *
 * Accepts two legal documents (files or raw text) and returns a structured
 * diff powered by Google Gemini AI. The diff identifies every meaningful
 * change between the documents — additions, removals, and modifications —
 * and explains each change in plain English along with which party benefits.
 *
 * Rate-limited per IP. Files are validated for size (≤ 5 MB) and type
 * (PDF, TXT, MD) before processing. Each document is truncated to 15,000
 * characters to stay within the model's context window.
 */

import { NextRequest, NextResponse } from "next/server";
import { getModel, withRetry, COMPARE_PROMPT } from "@/lib/gemini";
import { truncateText, validateFileSize, validateFileType } from "@/lib/pdf-parser";
import { checkRateLimit } from "@/lib/utils";
import { validateTextField } from "@/lib/validators";

export const maxDuration = 60;

/** Maximum characters sent to Gemini per document in a comparison request. */
const COMPARE_TRUNCATE_CHARS = 15_000;

/**
 * Compares two legal documents and returns a plain-English diff analysis.
 *
 * Accepts documents via `FormData` with fields `fileA`/`textA` and
 * `fileB`/`textB`. Files take precedence over their corresponding text fields.
 *
 * @param req - Incoming POST request with `FormData` containing document A and B.
 * @returns JSON response with `{ success, comparison }` or `{ error }`.
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
    const fileA = formData.get("fileA") as File   | null;
    const fileB = formData.get("fileB") as File   | null;
    const textA = formData.get("textA") as string | null;
    const textB = formData.get("textB") as string | null;

    // ── Dynamic import (keeps pdf-parse off the Edge bundle) ─────────────────
    const { extractTextFromFile } = await import("@/lib/pdf-parser");

    // ── Extract document A ────────────────────────────────────────────────────
    let docTextA = "";
    if (fileA) {
      validateFileSize(fileA, 5);
      validateFileType(fileA);
      docTextA = await extractTextFromFile(fileA);
    } else if (textA) {
      const v = validateTextField(textA, "textA");
      if (!v.ok) return NextResponse.json({ error: v.error }, { status: v.status });
      docTextA = v.data;
    }

    // ── Extract document B ────────────────────────────────────────────────────
    let docTextB = "";
    if (fileB) {
      validateFileSize(fileB, 5);
      validateFileType(fileB);
      docTextB = await extractTextFromFile(fileB);
    } else if (textB) {
      const v = validateTextField(textB, "textB");
      if (!v.ok) return NextResponse.json({ error: v.error }, { status: v.status });
      docTextB = v.data;
    }

    if (!docTextA.trim() || !docTextB.trim()) {
      return NextResponse.json(
        { error: "Both documents are required for comparison." },
        { status: 400 }
      );
    }

    // ── AI comparison ─────────────────────────────────────────────────────────
    const model  = getModel();
    const result = await withRetry(() =>
      model.generateContent(
        COMPARE_PROMPT(
          truncateText(docTextA, COMPARE_TRUNCATE_CHARS),
          truncateText(docTextB, COMPARE_TRUNCATE_CHARS)
        )
      )
    );
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned an unexpected response format.");

    const comparison = JSON.parse(jsonMatch[0]);

    return NextResponse.json(
      { success: true, comparison },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: unknown) {
    console.error("[Compare] Error:", err);
    const isKnown = err instanceof Error && !err.message.includes("    at ");
    const message = isKnown ? err.message : "Comparison failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
