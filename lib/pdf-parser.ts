/**
 * Server-side PDF text extraction.
 * Uses pdf-parse when available; falls back to raw buffer text for non-PDF files.
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return extractFromPdf(buffer);
  }

  // Plain text / markdown
  return buffer.toString("utf-8");
}

async function extractFromPdf(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse 2.x exports directly as named export
    const pdfParseModule = await import("pdf-parse");
    // Try both default and named export patterns
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
    const result = await pdfParse(buffer);
    return result.text || "";
  } catch (err) {
    console.error("PDF parse error:", err);
    throw new Error("Failed to parse PDF. Please try uploading a .txt file instead.");
  }
}

export function truncateText(text: string, maxChars = 30000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[Document truncated for analysis — first 30,000 characters shown]";
}

export function validateFileSize(file: File, maxMB = 5): void {
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File too large. Maximum size is ${maxMB}MB.`);
  }
}

export function validateFileType(file: File): void {
  const allowed = ["application/pdf", "text/plain", "text/markdown"];
  const allowedExts = [".pdf", ".txt", ".md"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowed.includes(file.type) && !allowedExts.includes(ext)) {
    throw new Error("Unsupported file type. Please upload a PDF or text file.");
  }
}
