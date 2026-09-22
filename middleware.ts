/**
 * @fileoverview Next.js Edge Middleware for LexAI.
 *
 * Runs before every request and enforces:
 * 1. **Security headers** — Adds CSP, HSTS, COOP, CORP, and other protective
 *    headers to every response at the edge (before the origin even runs).
 * 2. **Request-ID tracing** — Injects an `X-Request-ID` header so that
 *    server-side logs can be correlated with client-side errors.
 * 3. **API method guard** — Rejects non-POST requests to API routes with
 *    `405 Method Not Allowed` before they reach route handlers.
 *
 * Running these checks in middleware (edge runtime) is significantly more
 * efficient than handling them inside each individual route handler.
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// ─── Security Header Values ───────────────────────────────────────────────────

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://generativelanguage.googleapis.com",
  "worker-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  // ── 1. API method guard ────────────────────────────────────────────────────
  if (isApiRoute && req.method !== "POST" && req.method !== "OPTIONS") {
    return new NextResponse(
      JSON.stringify({ error: "Method not allowed." }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          Allow: "POST, OPTIONS",
        },
      }
    );
  }

  // ── 2. Pass through and add security + tracing headers ─────────────────────
  const res = NextResponse.next();
  const requestId = uuidv4();

  // Tracing
  res.headers.set("X-Request-ID", requestId);

  // Security headers (supplement next.config.js — edge applies these first)
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.set("Content-Security-Policy", CSP);

  return res;
}
