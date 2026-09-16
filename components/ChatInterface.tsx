"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, HelpCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  relevantText?: string;
  confidence?: "high" | "medium" | "low";
  disclaimer?: string;
  followUpQuestions?: string[];
  error?: boolean;
}

interface ChatInterfaceProps {
  documentText: string;
  documentName?: string;
}

const SUGGESTED_QUESTIONS = [
  "What are my main obligations under this document?",
  "Are there any automatic renewal clauses?",
  "What happens if I break this agreement?",
  "Can I terminate early, and what are the penalties?",
  "What are the payment terms?",
];

const confidenceColor = (c?: "high" | "medium" | "low") =>
  c === "high" ? "#34d399" : c === "medium" ? "#fbbf24" : "var(--text-muted)";

export default function ChatInterface({ documentText, documentName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `I've read your document${documentName ? ` ("${documentName}")` : ""}. Ask me anything about it — I'll answer based only on what's written in the document.` },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async (question: string) => {
    if (!question.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: question.trim() }]);
    setInput(""); setLoading(true);
    try {
      const res  = await fetch("/api/qa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentText, question: question.trim() }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to get answer");
      const { answer } = data;
      setMessages((prev) => [...prev, { role: "assistant", content: answer.answer, relevantText: answer.relevantText, confidence: answer.confidence, disclaimer: answer.disclaimer, followUpQuestions: answer.followUpQuestions }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: err instanceof Error ? err.message : "Something went wrong.", error: true }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [documentText, loading]);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: 580, overflow: "hidden" }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 16 }}
        role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row" }} className="fade-in">
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: msg.role === "assistant" ? "linear-gradient(135deg,#3b82f6,#7c3aed)" : "rgba(255,255,255,0.08)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }} aria-hidden="true">
              {msg.role === "assistant"
                ? <Bot size={14} color="#fff" />
                : <User size={14} color="var(--text-secondary)" />}
            </div>

            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {/* Bubble */}
              <div style={{
                padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.65,
                ...(msg.role === "user"
                  ? { background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.25)", color: "var(--text-primary)", borderTopRightRadius: 4 }
                  : msg.error
                  ? { background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#fca5a5", borderTopLeftRadius: 4 }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-primary)", borderTopLeftRadius: 4 }),
              }}>
                {msg.content}
              </div>

              {/* Quote */}
              {msg.relevantText && (
                <blockquote style={{ borderLeft: "2px solid rgba(59,130,246,0.4)", paddingLeft: 10, fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.6, maxWidth: "100%" }}>
                  &ldquo;{msg.relevantText}&rdquo;
                </blockquote>
              )}

              {/* Confidence */}
              {msg.confidence && (
                <p style={{ fontSize: 11, color: confidenceColor(msg.confidence) }}>
                  Confidence: {msg.confidence}
                  {msg.disclaimer && <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>· {msg.disclaimer}</span>}
                </p>
              )}

              {/* Follow-up chips */}
              {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                  {msg.followUpQuestions.map((q, qi) => (
                    <button key={qi} onClick={() => send(q)} disabled={loading} style={{
                      fontSize: 11, padding: "4px 10px", borderRadius: 99, cursor: "pointer",
                      background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                      color: "var(--text-secondary)", opacity: loading ? 0.5 : 1, transition: "all 0.15s"
                    }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 10 }} aria-label="LexAI is thinking" aria-live="polite" className="fade-in">
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={14} color="#fff" aria-hidden="true" />
            </div>
            <div style={{ padding: "12px 16px", borderRadius: 14, borderTopLeftRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 4 }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", display: "block",
                  animation: "dot 1.2s ease-in-out infinite", animationDelay: `${d * 180}ms`
                }} aria-hidden="true" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <HelpCircle size={11} aria-hidden="true" /> Suggested questions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => send(q)} disabled={loading} style={{
                fontSize: 11, padding: "5px 11px", borderRadius: 99, cursor: "pointer",
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                color: "var(--text-secondary)", opacity: loading ? 0.5 : 1, transition: "all 0.15s"
              }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        role="search"
        aria-label="Ask a question about the document"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this document…"
          maxLength={500}
          disabled={loading}
          style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "var(--text-primary)",
            outline: "none", transition: "border-color 0.15s",
            opacity: loading ? 0.5 : 1,
          }}
          onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
          onBlur={e => (e.target.style.borderColor = "var(--border)")}
          aria-label="Question input"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn-primary"
          style={{ width: 40, height: 40, padding: 0, justifyContent: "center", flexShrink: 0, borderRadius: 10 }}
          aria-label="Send question"
        >
          <Send size={15} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
