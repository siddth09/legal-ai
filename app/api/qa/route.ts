import { NextRequest, NextResponse } from "next/server";
import { getModel, withRetry, QA_PROMPT } from "@/lib/gemini";
import { checkRateLimit, sanitizeInput } from "@/lib/utils";

export const maxDuration = 60;

const MAX_QUESTION_LENGTH  = 500;
const MAX_DOCUMENT_LENGTH  = 100_000; // 100 KB

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { documentText, question } = body;

    if (!documentText || !question) {
      return NextResponse.json(
        { error: "Both documentText and question are required." },
        { status: 400 }
      );
    }

    if (typeof question !== "string" || question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json({ error: `Question must be under ${MAX_QUESTION_LENGTH} characters.` }, { status: 400 });
    }

    if (typeof documentText !== "string" || documentText.length > MAX_DOCUMENT_LENGTH) {
      return NextResponse.json({ error: "Document text is too large." }, { status: 400 });
    }

    const sanitizedQuestion     = sanitizeInput(question);
    const sanitizedDocumentText = sanitizeInput(documentText);

    const model = getModel();
    const result = await withRetry(() =>
      model.generateContent(QA_PROMPT(sanitizedDocumentText, sanitizedQuestion))
    );
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const answer = JSON.parse(jsonMatch[0]);
    return NextResponse.json(
      { success: true, answer },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    console.error("QA API error:", err);
    const message = err instanceof Error ? err.message : "Q&A failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
