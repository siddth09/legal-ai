# LexAI – AI-Powered Legal Document Assistant

> **Understand any legal document in seconds.** LexAI uses Google Gemini to help everyday people decode contracts, spot risks, compare agreements, and prepare smarter questions for their attorney — all for free.

> ⚠️ **Disclaimer:** LexAI provides legal *information* only — not legal advice. Always consult a qualified attorney before making decisions based on any legal document.

---

## 🎯 Problem Statement Alignment

This project addresses the **AI for Legal Assistance & Access** hackathon theme by covering **all listed use cases**:

| Use Case | LexAI Feature |
|---|---|
| Simplifying complex legal documents | ✅ Document Analyzer → plain-English summary |
| Highlighting important clauses, risks, obligations | ✅ Clause Cards with risk flags (High/Medium/Low) |
| Answering questions based on documents | ✅ Ask LexAI chat (document-grounded Q&A) |
| Comparing contracts and policies | ✅ Contract Comparator with diff view |
| Helping users understand options / next steps | ✅ Next Steps Checklist |
| Generating summaries, checklists, actionable outputs | ✅ Lawyer Prep Kit with tailored questions |
| Helping prepare questions for a legal professional | ✅ Lawyer Prep Kit tab |

---

## ✨ Features

### 1. 📄 Document Analyzer
- Upload any PDF or text legal document
- AI returns: plain-English summary, party identification, key dates, 5–10 annotated clauses, risk scoring, obligations breakdown, red flags, and an action checklist
- Includes a **"Load Sample NDA"** demo mode — no file upload needed

### 2. ⚖️ Contract Comparator
- Upload two document versions (original vs. revised)
- AI identifies every meaningful change with: type (added/removed/modified), significance, which party it favors, and a plain-English explanation
- Color-coded diff view (🟢 added · 🔴 removed · 🔵 modified)

### 3. 💬 Ask LexAI (Legal Q&A)
- Upload a document, then ask any question about it in plain English
- AI answers only from document content (no hallucination)
- Shows relevant text quotes, confidence level, and suggested follow-up questions
- Pre-loaded suggested questions for quick starts

---

## 🏗️ Architecture

```
legal-ai/
├── app/
│   ├── layout.tsx            # Root layout with NavBar, SEO metadata
│   ├── page.tsx              # Landing page
│   ├── globals.css           # Dark theme, animations, custom utilities
│   ├── analyze/page.tsx      # Document Analyzer UI
│   ├── compare/page.tsx      # Contract Comparator UI
│   ├── qa/page.tsx           # Legal Q&A UI
│   └── api/
│       ├── analyze/route.ts  # POST /api/analyze – Gemini analysis
│       ├── compare/route.ts  # POST /api/compare – Gemini comparison
│       └── qa/route.ts       # POST /api/qa – Gemini Q&A
├── components/
│   ├── NavBar.tsx            # Sticky responsive navigation
│   ├── DocumentUploader.tsx  # Drag-and-drop file uploader
│   ├── AnalysisResult.tsx    # Tabbed results (Overview/Clauses/Obligations/Lawyer)
│   ├── ClauseCard.tsx        # Expandable clause with risk badge
│   ├── RiskBadge.tsx         # Risk level indicator
│   ├── CompareView.tsx       # Diff-style comparison view
│   └── ChatInterface.tsx     # Real-time Q&A chat
├── lib/
│   ├── gemini.ts             # Gemini client + all prompt templates
│   ├── pdf-parser.ts         # Server-side PDF text extraction
│   └── utils.ts              # Shared helpers, rate limiter
└── __tests__/                # Jest unit + component tests
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/legal-ai.git
cd legal-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY=your_key_here

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see LexAI.

---

## 🛡️ Security

- **API key** stored only in `.env.local` — never committed (`.gitignore` enforced)
- **Input validation** — file type, size limits (5MB max), question length limits
- **Rate limiting** — 20 requests/minute per IP address
- **Input sanitization** — HTML chars stripped from user inputs
- **Content Security Policy** — strict CSP headers via `next.config.js`
- **Security headers** — X-Frame-Options, X-Content-Type-Options, XSS Protection
- **Stateless** — no user data stored server-side

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

Tests cover:
- `lib/gemini.ts` — document type detection, prompt template correctness
- `lib/utils.ts` — color helpers, rate limiter logic  
- `components/RiskBadge.tsx` — rendering, accessibility, color application

---

## ♿ Accessibility

- All interactive elements have descriptive `aria-label` attributes
- Navigation uses `aria-current="page"` for active links
- File uploader supports keyboard navigation (`Enter`/`Space` to open)
- Chat log uses `role="log"` and `aria-live="polite"`
- Risk badges use `role="img"` with descriptive labels
- Mobile-responsive layout with hamburger menu
- High-contrast color palette on dark background
- Consistent `:focus-visible` outlines throughout

---

## 💡 Assumptions

1. Documents should be under 5MB and in PDF, TXT, or MD format
2. PDF text extraction works on text-based PDFs (not scanned images)
3. Analysis is based on the first ~30,000 characters of long documents
4. The app is informational only — it explicitly does not provide legal advice
5. A valid `GEMINI_API_KEY` environment variable must be set for AI features to work

---

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | Full-stack React framework (App Router) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Google Gemini 1.5 Flash](https://ai.google.dev) | AI analysis, comparison, Q&A |
| [pdf-parse](https://npmjs.com/package/pdf-parse) | Server-side PDF text extraction |
| [lucide-react](https://lucide.dev) | Icon system |
| [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com) | Unit & component testing |

---

## 📝 License

MIT — see [LICENSE](LICENSE) for details.
