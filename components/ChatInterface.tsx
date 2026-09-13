"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, AlertCircle, HelpCircle } from "lucide-react";

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

export default function ChatInterface({ documentText, documentName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I've read your document${documentName ? ` ("${documentName}")` : ""}. Ask me anything about it — I'll answer based only on what's written in the document.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (question: string) => {
      if (!question.trim() || loading) return;

      const userMsg: Message = { role: "user", content: question.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentText, question: question.trim() }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error ?? "Failed to get answer");
        }

        const { answer } = data;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer.answer,
            relevantText: answer.relevantText,
            confidence: answer.confidence,
            disclaimer: answer.disclaimer,
            followUpQuestions: answer.followUpQuestions,
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
            error: true,
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [documentText, loading]
  );

  const confidenceColor = (c?: "high" | "medium" | "low") =>
    c === "high" ? "text-emerald-400" : c === "medium" ? "text-amber-400" : "text-slate-500";

  return (
    <div className="flex flex-col h-[600px] glass rounded-2xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} fade-in`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-blue-500 to-violet-600"
                  : "bg-slate-700"
              }`}
              aria-hidden="true"
            >
              {msg.role === "assistant"
                ? <Bot size={16} className="text-white" />
                : <User size={16} className="text-slate-300" />}
            </div>

            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              {/* Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600/30 border border-blue-600/30 text-slate-200 rounded-tr-sm"
                    : msg.error
                    ? "bg-red-950/30 border border-red-800/40 text-red-300 rounded-tl-sm"
                    : "bg-slate-800/70 border border-slate-700/50 text-slate-200 rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Relevant text quote */}
              {msg.relevantText && (
                <blockquote className="border-l-2 border-blue-600/50 pl-3 text-xs text-slate-500 italic max-w-full">
                  &ldquo;{msg.relevantText}&rdquo;
                </blockquote>
              )}

              {/* Confidence + disclaimer */}
              {msg.confidence && (
                <p className={`text-xs ${confidenceColor(msg.confidence)}`}>
                  Confidence: {msg.confidence}
                  {msg.disclaimer && (
                    <span className="text-slate-600 ml-2">· {msg.disclaimer}</span>
                  )}
                </p>
              )}

              {/* Follow-up suggestions */}
              {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {msg.followUpQuestions.map((q, qi) => (
                    <button
                      key={qi}
                      onClick={() => send(q)}
                      disabled={loading}
                      className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 fade-in" aria-label="LexAI is thinking" aria-live="polite">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" aria-hidden="true" />
            </div>
            <div className="bg-slate-800/70 border border-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d * 150}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
            <HelpCircle size={11} aria-hidden="true" /> Suggested questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => send(q)}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        className="p-4 border-t border-slate-800/60 flex gap-2"
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
          className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          aria-label="Question input"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors"
          aria-label="Send question"
        >
          <Send size={16} className="text-white" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
