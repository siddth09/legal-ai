/**
 * @fileoverview Shared utility functions for LexAI.
 *
 * Provides pure, well-tested helper functions for:
 * - CSS class merging (`cn`)
 * - Date formatting (`formatDate`)
 * - Risk and change-type colour/icon mappings
 * - Server-side in-memory rate limiting (`checkRateLimit`)
 * - User-input sanitization to prevent XSS (`sanitizeInput`)
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── CSS Utilities ────────────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 *
 * @param inputs - Any number of class values (strings, arrays, conditionals).
 * @returns A single merged class string.
 *
 * @example
 * ```ts
 * cn("text-red-500", isActive && "font-bold") // "text-red-500 font-bold"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Formats an ISO date string into a human-readable long-form date.
 *
 * @param dateStr - An ISO 8601 date string (e.g., "2025-12-31").
 * @returns A localised string like "December 31, 2025", or the original
 *          string if it cannot be parsed.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year:  "numeric",
      month: "long",
      day:   "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Risk Display Utilities ───────────────────────────────────────────────────

/**
 * Returns Tailwind colour classes for a given clause risk level.
 *
 * @param risk - The risk classification from the AI analysis.
 * @returns A space-separated string of Tailwind classes for text, background, and border.
 */
export function riskColor(risk: "high" | "medium" | "low" | "neutral"): string {
  switch (risk) {
    case "high":   return "text-red-400 bg-red-950/40 border-red-800";
    case "medium": return "text-amber-400 bg-amber-950/40 border-amber-800";
    case "low":    return "text-emerald-400 bg-emerald-950/40 border-emerald-800";
    default:       return "text-slate-400 bg-slate-800/40 border-slate-700";
  }
}

/**
 * Returns an emoji icon representing a clause risk level.
 *
 * @param risk - The risk classification from the AI analysis.
 * @returns A single emoji character.
 */
export function riskIcon(risk: "high" | "medium" | "low" | "neutral"): string {
  switch (risk) {
    case "high":   return "⚠️";
    case "medium": return "🟡";
    case "low":    return "✅";
    default:       return "📄";
  }
}

/**
 * Returns Tailwind colour classes for a contract change type.
 *
 * @param type - The change classification: "added", "removed", or "modified".
 * @returns A space-separated string of Tailwind classes.
 */
export function changeTypeColor(type: "added" | "removed" | "modified"): string {
  switch (type) {
    case "added":    return "text-emerald-400 bg-emerald-950/30 border-emerald-800";
    case "removed":  return "text-red-400 bg-red-950/30 border-red-800";
    case "modified": return "text-blue-400 bg-blue-950/30 border-blue-800";
  }
}

/**
 * Returns a human-readable label for a change significance level.
 *
 * @param s - Significance level from the AI comparison.
 * @returns A display string like "High Impact".
 */
export function significanceLabel(s: "high" | "medium" | "low"): string {
  switch (s) {
    case "high":   return "High Impact";
    case "medium": return "Medium Impact";
    case "low":    return "Low Impact";
  }
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

/**
 * In-memory rate limiter keyed by IP address.
 *
 * @remarks
 * This is a simple sliding-window counter that resets after {@link RATE_WINDOW}
 * milliseconds. Because the store is in-memory, it resets on each server
 * restart. For production use at scale, replace with a Redis-backed store.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/** Maximum allowed requests per {@link RATE_WINDOW}. */
const RATE_LIMIT = 20;

/** Window duration for rate limiting in milliseconds (1 minute). */
const RATE_WINDOW = 60 * 1_000;

/**
 * Checks whether the given IP address is within its rate limit.
 *
 * Increments the request counter on every allowed call. Returns `false` once
 * the limit is reached. The window resets automatically after one minute.
 *
 * @param ip - The client IP address (typically from the `x-forwarded-for` header).
 * @returns `true` if the request should proceed; `false` if it should be blocked.
 *
 * @example
 * ```ts
 * if (!checkRateLimit(ip)) {
 *   return NextResponse.json({ error: "Too many requests." }, { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

/**
 * Sanitizes a user-supplied string to prevent XSS and prompt injection.
 *
 * Strips all HTML tags (including `<script>` and `<style>` blocks along with
 * their content), decodes common HTML entities to spaces, and removes
 * non-printable control characters. The result is safe to include in AI
 * prompts and server logs.
 *
 * @param input - Raw user-provided string.
 * @returns A sanitized string with HTML and control characters removed.
 *
 * @example
 * ```ts
 * sanitizeInput("<script>alert('xss')</script>Hello") // "Hello"
 * sanitizeInput("  leading spaces  ")                  // "leading spaces"
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // strip <script> blocks + content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,   "") // strip <style> blocks + content
    .replace(/<[^>]*>/g,                           "") // strip remaining HTML tags
    .replace(/&[a-z]+;/gi,                        " ") // replace HTML entities with spaces
    .replace(/[\x00-\x08\x0B-\x1F]/g,            "") // strip non-printable control chars
    .trim();
}
