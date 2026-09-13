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
  label,
  id,
  onFile,
  onText,
  currentFile,
  onClear,
  accept = ".pdf,.txt,.md",
  disabled = false,
}: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((file: File): string | null => {
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) return `File too large (max ${maxMB}MB)`;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "txt", "md"].includes(ext)) return "Only PDF, TXT, or MD files are supported";
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const err = validate(file);
      if (err) { setError(err); return; }
      onFile(file);
    },
    [onFile, validate]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const loadSample = () => {
    if (onText) {
      onText(SAMPLE_NDA);
    }
  };

  if (currentFile) {
    return (
      <div className="glass rounded-xl p-4 flex items-center gap-3" role="status" aria-label={`File loaded: ${currentFile.name}`}>
        <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-blue-400" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{currentFile.name}</p>
          <p className="text-xs text-slate-500">{(currentFile.size / 1024).toFixed(1)} KB</p>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={`Remove ${currentFile.name}`}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload area for ${label}. Drag and drop a file or click to browse.`}
        aria-disabled={disabled}
        className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${dragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/40"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
        />
        <Upload size={28} className="text-slate-500 mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-300">
          {dragging ? "Drop it here!" : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-slate-500 mt-1">PDF, TXT, or MD · Max 5MB</p>

        {onText && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); loadSample(); }}
            className="mt-4 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
            aria-label="Load sample NDA document for demonstration"
          >
            or load sample NDA
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs" role="alert">
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
