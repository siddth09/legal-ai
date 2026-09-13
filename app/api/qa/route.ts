import { NextRequest, NextResponse } from "next/server";
import { getModel, QA_PROMPT } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/utils";

export const maxDuration = 60;

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

    if (typeof question !== "string" || question.length > 500) {
      return NextResponse.json({ error: "Question must be under 500 characters." }, { status: 400 });
    }

    // Sanitize question
    const sanitizedQuestion = question.replace(/[<>]/g, "").trim();

    const model = getModel();
    const result = await model.generateContent(QA_PROMPT(documentText, sanitizedQuestion));
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const answer = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, answer });
  } catch (err: unknown) {
    console.error("QA API error:", err);
    const message = err instanceof Error ? err.message : "Q&A failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
