import { NextRequest, NextResponse } from "next/server";
import { getModel, withRetry, ANALYZE_PROMPT, DETECT_DOC_TYPE } from "@/lib/gemini";
import { truncateText, validateFileSize, validateFileType } from "@/lib/pdf-parser";
import { checkRateLimit } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawText = formData.get("text") as string | null;

    let documentText = "";

    if (file) {
      validateFileSize(file, 5);
      validateFileType(file);
      // Import dynamically to avoid edge runtime issues
      const { extractTextFromFile } = await import("@/lib/pdf-parser");
      documentText = await extractTextFromFile(file);
    } else if (rawText) {
      documentText = rawText;
    } else {
      return NextResponse.json({ error: "No document provided." }, { status: 400 });
    }

    if (!documentText.trim()) {
      return NextResponse.json({ error: "Could not extract text from the document." }, { status: 400 });
    }

    const truncated = truncateText(documentText);
    const docType = DETECT_DOC_TYPE(truncated);

    const model = getModel();
    const result = await withRetry(() =>
      model.generateContent(ANALYZE_PROMPT(docType, truncated))
    );
    const responseText = result.response.text();

    // Parse JSON from response (Gemini sometimes wraps in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, analysis, documentText: truncated });
  } catch (err: unknown) {
    console.error("Analyze API error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
