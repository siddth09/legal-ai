import Link from "next/link";
import { Scale, FileSearch, GitCompare, MessageSquare, ArrowRight, Shield, Zap, BookOpen } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Document Analyzer",
    description: "Upload any legal document and get a plain-English breakdown with risk flags, key clauses, and obligations.",
    href: "/analyze",
    color: "from-blue-500 to-cyan-500",
    badge: "Most Popular",
  },
  {
    icon: GitCompare,
    title: "Contract Comparator",
    description: "Upload two versions of an agreement. LexAI highlights every change and explains what it means for you.",
    href: "/compare",
    color: "from-violet-500 to-purple-600",
    badge: null,
  },
  {
    icon: MessageSquare,
    title: "Ask LexAI",
    description: "Ask any question about your uploaded document. Get grounded, document-specific answers instantly.",
    href: "/qa",
    color: "from-emerald-500 to-teal-600",
    badge: null,
  },
];

const stats = [
  { value: "5+", label: "Document Types" },
  { value: "Free", label: "No Sign-up Needed" },
  { value: "AI", label: "Gemini Powered" },
  { value: "100%", label: "Privacy-First" },
];

const useCases = [
  { icon: "🏠", label: "Lease Agreements" },
  { icon: "💼", label: "Employment Contracts" },
  { icon: "🤝", label: "NDAs & Confidentiality" },
  { icon: "📋", label: "Terms of Service" },
  { icon: "💰", label: "Loan Agreements" },
  { icon: "🛒", label: "Purchase Agreements" },
];

export default function HomePage() {
  return (
    <div className="bg-mesh min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center" aria-labelledby="hero-heading">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <Shield size={12} aria-hidden="true" />
          AI-powered · Not legal advice · Privacy-first
        </div>

        <h1 id="hero-heading" className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Understand Any Legal
          <br />
          <span className="gradient-text">Document in Seconds</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          LexAI uses AI to decode contracts, flag risks, compare agreements, and help you
          ask the right questions — so you&apos;re never lost in legal language again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-100 shadow-lg shadow-blue-900/30"
          >
            <FileSearch size={18} aria-hidden="true" />
            Analyze a Document
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-100"
          >
            <GitCompare size={18} aria-hidden="true" />
            Compare Contracts
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto" role="list" aria-label="LexAI statistics">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4" role="listitem">
              <div className="text-2xl font-bold text-blue-400">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Everything you need to navigate legal documents
        </h2>
        <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
          Three powerful tools. No legal background required.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group glass rounded-2xl p-6 hover:border-slate-600 hover:-translate-y-1 transition-all relative overflow-hidden"
                aria-label={`Go to ${f.title}`}
              >
                {f.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5">
                    {f.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight size={14} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" aria-labelledby="usecases-heading">
        <h2 id="usecases-heading" className="text-xl font-bold text-center mb-6 text-slate-300">
          Works with all types of legal documents
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {useCases.map((uc) => (
            <div
              key={uc.label}
              className="glass rounded-full px-4 py-2 text-sm font-medium text-slate-300 flex items-center gap-2"
            >
              <span role="img" aria-hidden="true">{uc.icon}</span>
              {uc.label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: "1", icon: "📄", title: "Upload your document", desc: "PDF or plain text — lease, contract, NDA, ToS — anything." },
            { step: "2", icon: "🤖", title: "AI analyzes it", desc: "Gemini reads the full document and extracts clauses, risks, and obligations." },
            { step: "3", icon: "✅", title: "Act with confidence", desc: "Get a plain-English summary, risk flags, and a checklist of next steps." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl mx-auto mb-4" role="img" aria-label={item.title}>
                {item.icon}
              </div>
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Step {item.step}</div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="glass rounded-2xl p-6 flex gap-3 items-start" role="note">
          <BookOpen size={20} className="text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-400 text-sm mb-1">Important disclaimer</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              LexAI provides legal <strong className="text-slate-300">information</strong> only — not legal advice. 
              AI-generated analysis may contain errors. Always consult a qualified attorney before making decisions 
              based on legal documents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
