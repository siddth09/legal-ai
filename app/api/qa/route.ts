/**
 * @fileoverview POST /api/qa — Document Q&A endpoint.
 *
 * Accepts a legal document and a plain-English question, then returns a
 * grounded answer sourced directly from the document text using Gemini AI.
 *
 * Rate-limited per IP. Inputs are validated and sanitized before being
 * forwarded to the AI model. Responses include a confidence score and
 * follow-up questions to guide further exploration.
 */

import { NextRequest, NextResponse } from "next/server";
import { getModel, withRetry, QA_PROMPT } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/utils";
import { validateQABody } from "@/lib/validators";

export const maxDuration = 60;

/**
 * Answers a user's question about a specific legal document.
 *
 * @param req - Incoming POST request with `{ documentText, question }` JSON body.
 * @returns JSON response with `{ success, answer }` or `{ error }`.
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
    // ── Input validation ─────────────────────────────────────────────────────
    const body = await req.json().catch(() => null);
    const validation = validateQABody(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: validation.status });
    }

    const { documentText, question } = validation.data;

    // ── AI generation ────────────────────────────────────────────────────────
    const model = getModel();
    const result = await withRetry(() =>
      model.generateContent(QA_PROMPT(documentText, question))
    );
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned an unexpected response format.");

    const answer = JSON.parse(jsonMatch[0]);

    return NextResponse.json(
      { success: true, answer },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: unknown) {
    console.error("[QA] Error:", err);
    // Do not leak internal stack traces to the client
    const isKnown = err instanceof Error && !err.message.includes("    at ");
    const message = isKnown ? err.message : "Q&A processing failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
