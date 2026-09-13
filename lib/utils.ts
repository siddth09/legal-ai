import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function riskColor(risk: "high" | "medium" | "low" | "neutral"): string {
  switch (risk) {
    case "high":   return "text-red-400 bg-red-950/40 border-red-800";
    case "medium": return "text-amber-400 bg-amber-950/40 border-amber-800";
    case "low":    return "text-emerald-400 bg-emerald-950/40 border-emerald-800";
    default:       return "text-slate-400 bg-slate-800/40 border-slate-700";
  }
}

export function riskIcon(risk: "high" | "medium" | "low" | "neutral"): string {
  switch (risk) {
    case "high":   return "⚠️";
    case "medium": return "🟡";
    case "low":    return "✅";
    default:       return "📄";
  }
}

export function changeTypeColor(type: "added" | "removed" | "modified"): string {
  switch (type) {
    case "added":    return "text-emerald-400 bg-emerald-950/30 border-emerald-800";
    case "removed":  return "text-red-400 bg-red-950/30 border-red-800";
    case "modified": return "text-blue-400 bg-blue-950/30 border-blue-800";
  }
}

export function significanceLabel(s: "high" | "medium" | "low"): string {
  switch (s) {
    case "high":   return "High Impact";
    case "medium": return "Medium Impact";
    case "low":    return "Low Impact";
  }
}

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}
