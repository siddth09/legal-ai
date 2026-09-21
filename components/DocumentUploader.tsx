"use client";

import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface DocumentUploaderProps {
  label: string;
  id: string;
  onFile: (file: File) => void;
  onText?: (text: string) => void;
  currentFile?: File | null;
  onClear?: () => void;
  accept?: string;
  disabled?: boolean;
}

const SAMPLE_NDA = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of January 1, 2025, between Acme Corporation ("Disclosing Party") and John Doe ("Receiving Party").

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any data or information that is proprietary to the Disclosing Party and not generally known to the public, whether in tangible or intangible form, including but not limited to technical data, trade secrets, research, product plans, products, services, customers, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, marketing, and finances.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to: (a) hold the Confidential Information in strict confidence; (b) not disclose the Confidential Information to any third parties; (c) use the Confidential Information solely for the purpose of evaluating a potential business relationship.

3. TERM
This Agreement shall remain in effect for a period of five (5) years from the date first written above, UNLESS either party provides thirty (30) days written notice of termination.

4. LIQUIDATED DAMAGES
In the event of a breach of this Agreement, the Receiving Party shall pay liquidated damages of $500,000 per occurrence, which the parties agree is a reasonable estimate of damages and not a penalty.

5. NON-COMPETE
During the term of this Agreement and for two (2) years thereafter, Receiving Party shall not, directly or indirectly, engage in any business that competes with Disclosing Party within a 500-mile radius.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.

7. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof.`;

export default function DocumentUploader({
  label, id, onFile, onText, currentFile, onClear,
  accept = ".pdf,.txt,.md", disabled = false,
}: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) return "File too large (max 5 MB)";
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "txt", "md"].includes(ext)) return "Only PDF, TXT, or MD files are supported";
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const err = validate(file);
    if (err) { setError(err); return; }
    onFile(file);
  }, [onFile, validate]);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  /* ── File loaded state ── */
  if (currentFile) {
    return (
      <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}
        role="status" aria-label={`File loaded: ${currentFile.name}`}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <FileText size={17} style={{ color: "#60a5fa" }} aria-hidden="true" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentFile.name}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {(currentFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="btn-ghost"
            style={{ padding: "6px", borderRadius: 8 }}
            aria-label={`Remove ${currentFile.name}`}
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  /* ── Upload zone ── */
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
        {label}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload area for ${label}. Drag and drop a file or click to browse.`}
        aria-disabled={disabled}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        className="upload-zone"
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          ...(dragging && { borderColor: "rgba(59,130,246,0.5)", background: "rgba(59,130,246,0.06)" }),
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={disabled ? undefined : onDrop}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={onChange}
          disabled={disabled}
          aria-label={`File input for ${label}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hintId}
        />
        <div style={{
          width: 40, height: 40, borderRadius: 10, margin: "0 auto 12px",
          background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Upload size={18} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
          {dragging ? "Drop it here!" : "Drag & drop or click to upload"}
        </p>
        <p id={hintId} style={{ fontSize: 12, color: "var(--text-muted)" }}>PDF, TXT, or MD · Max 5 MB</p>

        {onText && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onText(SAMPLE_NDA); }}
            style={{
              marginTop: 14, fontSize: 12, color: "#60a5fa",
              background: "none", border: "none", cursor: "pointer",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
            aria-label="Load sample NDA document for demonstration"
          >
            or load sample NDA
          </button>
        )}
      </div>

      {error && (
        <div
          id={errorId}
          style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#f87171" }}
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
