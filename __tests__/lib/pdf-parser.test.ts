import { truncateText, validateFileSize, validateFileType } from "@/lib/pdf-parser";

describe("truncateText", () => {
  it("returns text unchanged when under the limit", () => {
    const short = "This is a short contract.";
    expect(truncateText(short, 100)).toBe(short);
  });

  it("truncates text at the specified character limit", () => {
    const longText = "a".repeat(35000);
    const result = truncateText(longText, 30000);
    expect(result.startsWith("a".repeat(30000))).toBe(true);
  });

  it("appends truncation notice when text is truncated", () => {
    const longText = "b".repeat(35000);
    const result = truncateText(longText, 30000);
    expect(result).toContain("[Document truncated for analysis");
  });

  it("uses default limit of 30000 characters", () => {
    const longText = "c".repeat(40000);
    const result = truncateText(longText);
    expect(result.length).toBeGreaterThan(30000); // includes truncation notice
    expect(result.startsWith("c".repeat(30000))).toBe(true);
  });

  it("does not add truncation notice for text at exactly the limit", () => {
    const exactText = "d".repeat(30000);
    const result = truncateText(exactText, 30000);
    expect(result).toBe(exactText);
    expect(result).not.toContain("[Document truncated");
  });
});

describe("validateFileSize", () => {
  const makeFile = (sizeBytes: number, name = "test.pdf") => {
    const file = new File([""], name, { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: sizeBytes });
    return file;
  };

  it("does not throw for files within the size limit", () => {
    const file = makeFile(4 * 1024 * 1024); // 4 MB
    expect(() => validateFileSize(file, 5)).not.toThrow();
  });

  it("throws for files that exceed the size limit", () => {
    const file = makeFile(6 * 1024 * 1024); // 6 MB
    expect(() => validateFileSize(file, 5)).toThrow(/Maximum size is 5MB/i);
  });

  it("throws exactly at the boundary (one byte over)", () => {
    const maxBytes = 5 * 1024 * 1024;
    const file = makeFile(maxBytes + 1);
    expect(() => validateFileSize(file, 5)).toThrow();
  });

  it("accepts files exactly at the size limit", () => {
    const file = makeFile(5 * 1024 * 1024);
    expect(() => validateFileSize(file, 5)).not.toThrow();
  });
});

describe("validateFileType", () => {
  const makeFileWithType = (name: string, type: string) =>
    new File(["content"], name, { type });

  it("accepts PDF files by MIME type", () => {
    const file = makeFileWithType("agreement.pdf", "application/pdf");
    expect(() => validateFileType(file)).not.toThrow();
  });

  it("accepts TXT files by MIME type", () => {
    const file = makeFileWithType("contract.txt", "text/plain");
    expect(() => validateFileType(file)).not.toThrow();
  });

  it("accepts MD files by extension", () => {
    const file = makeFileWithType("terms.md", "text/markdown");
    expect(() => validateFileType(file)).not.toThrow();
  });

  it("rejects .docx files", () => {
    const file = makeFileWithType(
      "report.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    expect(() => validateFileType(file)).toThrow(/Unsupported file type/i);
  });

  it("rejects .xlsx files", () => {
    const file = makeFileWithType(
      "data.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(() => validateFileType(file)).toThrow(/Unsupported file type/i);
  });

  it("rejects image files", () => {
    const file = makeFileWithType("contract.png", "image/png");
    expect(() => validateFileType(file)).toThrow(/Unsupported file type/i);
  });
});
