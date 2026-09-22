/**
 * @fileoverview Centralized input validation schemas for all LexAI API routes.
 *
 * Provides strict, type-safe validation for every inbound request, ensuring
 * consistent sanitization, length caps, and structured error responses across
 * the entire API surface. This centralised approach makes it trivial to audit
 * and tighten security constraints in one place.
 */

import { sanitizeInput } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum allowed size for any uploaded file (in megabytes). */
export const MAX_FILE_MB = 5;

/** Maximum characters allowed in a free-text document paste. */
export const MAX_TEXT_CHARS = 100_000;

/** Maximum characters allowed for a Q&A question. */
export const MAX_QUESTION_CHARS = 500;

// ─── Types ────────────────────────────────────────────────────────────────────

/** A validation result that either succeeds with data or fails with an error. */
export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

// ─── Validators ───────────────────────────────────────────────────────────────

/**
 * Validates and sanitizes a Q&A request body.
 *
 * @param body - Raw parsed JSON body from the request.
 * @returns A discriminated union containing either the sanitized fields or an error.
 *
 * @example
 * ```ts
 * const result = validateQABody(await req.json());
 * if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
 * const { documentText, question } = result.data;
 * ```
 */
export function validateQABody(body: unknown): ValidationResult<{
  documentText: string;
  question: string;
}> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object.", status: 400 };
  }

  const { documentText, question } = body as Record<string, unknown>;

  if (typeof documentText !== "string" || !documentText.trim()) {
    return { ok: false, error: "documentText is required and must be a non-empty string.", status: 400 };
  }

  if (typeof question !== "string" || !question.trim()) {
    return { ok: false, error: "question is required and must be a non-empty string.", status: 400 };
  }

  if (question.length > MAX_QUESTION_CHARS) {
    return {
      ok: false,
      error: `Question must be at most ${MAX_QUESTION_CHARS} characters. Received ${question.length}.`,
      status: 400,
    };
  }

  if (documentText.length > MAX_TEXT_CHARS) {
    return {
      ok: false,
      error: `Document text must be at most ${MAX_TEXT_CHARS} characters.`,
      status: 400,
    };
  }

  return {
    ok: true,
    data: {
      documentText: sanitizeInput(documentText),
      question: sanitizeInput(question),
    },
  };
}

/**
 * Validates a text field submitted as raw text (e.g., from a FormData entry).
 *
 * @param text  - The raw text value.
 * @param field - The field name, used in error messages.
 * @param max   - Maximum allowed length (defaults to {@link MAX_TEXT_CHARS}).
 * @returns A discriminated union containing either the sanitized text or an error.
 */
export function validateTextField(
  text: unknown,
  field: string,
  max = MAX_TEXT_CHARS
): ValidationResult<string> {
  if (typeof text !== "string" || !text.trim()) {
    return { ok: false, error: `${field} must be a non-empty string.`, status: 400 };
  }

  if (text.length > max) {
    return {
      ok: false,
      error: `${field} must be at most ${max} characters. Received ${text.length}.`,
      status: 400,
    };
  }

  return { ok: true, data: sanitizeInput(text) };
}
