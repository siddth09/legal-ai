import { NextRequest, NextResponse } from "next/server";
import { getModel, withRetry, COMPARE_PROMPT } from "@/lib/gemini";
import { truncateText, validateFileSize, validateFileType } from "@/lib/pdf-parser";
import { checkRateLimit } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const fileA = formData.get("fileA") as File | null;
    const fileB = formData.get("fileB") as File | null;
    const textA = formData.get("textA") as string | null;
    const textB = formData.get("textB") as string | null;

    let docTextA = "";
    let docTextB = "";

    const { extractTextFromFile } = await import("@/lib/pdf-parser");

    if (fileA) {
      validateFileSize(fileA, 5);
      validateFileType(fileA);
      docTextA = await extractTextFromFile(fileA);
    } else if (textA) {
      docTextA = textA;
    }

    if (fileB) {
      validateFileSize(fileB, 5);
      validateFileType(fileB);
      docTextB = await extractTextFromFile(fileB);
    } else if (textB) {
      docTextB = textB;
    }

    if (!docTextA.trim() || !docTextB.trim()) {
      return NextResponse.json({ error: "Both documents are required for comparison." }, { status: 400 });
    }

    const model = getModel();
    const result = await withRetry(() =>
      model.generateContent(
        COMPARE_PROMPT(truncateText(docTextA, 15000), truncateText(docTextB, 15000))
      )
    );
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const comparison = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, comparison });
  } catch (err: unknown) {
    console.error("Compare API error:", err);
    const message = err instanceof Error ? err.message : "Comparison failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
