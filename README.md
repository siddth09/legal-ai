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

## 🏗️ Architecture

```
legal-ai/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts   # POST — document analysis endpoint
│   │   ├── compare/route.ts   # POST — contract comparison endpoint
│   │   └── qa/route.ts        # POST — document Q&A endpoint
│   ├── analyze/               # Document Analyzer page + error/loading UI
│   ├── compare/               # Contract Comparator page + error/loading UI
│   ├── qa/                    # Ask LexAI page + error/loading UI
│   ├── error.tsx              # Route-level error boundary
│   ├── global-error.tsx       # Root error boundary
│   ├── layout.tsx             # Root layout (Inter font, skip-nav, metadata)
│   └── page.tsx               # Landing page
├── components/
│   ├── AnalysisResult.tsx     # Tabbed analysis display (React.memo + useMemo)
│   ├── ChatInterface.tsx      # Document Q&A chat (useCallback, optimistic UI)
│   ├── CompareView.tsx        # Contract diff view (React.memo + useMemo)
│   ├── DocumentUploader.tsx   # Drag-drop + file picker with full ARIA support
│   ├── NavBar.tsx             # Sticky nav with keyboard-accessible mobile menu
│   └── RiskBadge.tsx          # Accessible risk level badge
├── lib/
│   ├── gemini.ts              # Gemini client, retry logic, prompt templates
│   ├── pdf-parser.ts          # Server-side PDF/text extraction + validation
│   ├── types.ts               # Shared TypeScript interfaces (no `as any`)
│   ├── utils.ts               # Pure utility helpers (JSDoc, fully tested)
│   └── validators.ts          # Centralised request validation (discriminated unions)
├── __tests__/
│   ├── components/            # ChatInterface, CompareView, DocumentUploader, RiskBadge
│   └── lib/                   # gemini, pdf-parser, utils, validators
└── middleware.ts              # Edge middleware — method guard + security headers
```

**Data flow:**
1. User uploads a document via `DocumentUploader`
2. Page component sends a `FormData` POST to the appropriate API route
3. The API route validates input via `lib/validators.ts`, calls Gemini with a structured prompt, and parses the JSON response
4. The structured result is passed back and rendered by the appropriate result component

---

## 🛡️ Security

- **API key** stored only in `.env.local` — never committed (`.gitignore` enforced)
- **Centralised validation** — all inputs run through `lib/validators.ts` discriminated-union validators before reaching the AI model
- **Input sanitization** — `sanitizeInput()` strips `<script>` / `<style>` blocks, HTML tags, HTML entities, and control characters from all user text
- **Rate limiting** — 20 requests per minute per IP address (server-side in-memory)
- **Edge middleware** — `middleware.ts` enforces API method guards (405) and injects `X-Request-ID` tracing headers at the CDN edge before requests hit the origin
- **Content Security Policy** — strict CSP via `next.config.js` with `unsafe-eval` removed
- **Security headers** — HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy, COEP
- **Error sanitization** — API routes detect stack traces and replace them with generic messages; internal error details never leak to the client
- **Stateless** — no user data or documents stored server-side
- **Cache-Control: no-store** — all AI responses are marked non-cacheable to prevent sensitive legal data being stored in caches

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Type checking (zero errors)
npm run type-check

# Linting (zero errors)
npm run lint
```

**86 tests across 8 test suites** — all passing:

| Suite | Coverage |
|---|---|
| `lib/utils.test.ts` | `checkRateLimit`, `sanitizeInput`, risk helpers |
| `lib/validators.test.ts` | `validateQABody`, `validateTextField` — all branches |
| `lib/pdf-parser.test.ts` | `truncateText` boundaries, `validateFileSize`, `validateFileType` |
| `lib/gemini.test.ts` | `DETECT_DOC_TYPE`, prompt template structure |
| `components/RiskBadge.test.tsx` | Rendering, ARIA, inline style colours |
| `components/CompareView.test.tsx` | Stats, changes, recommendations, ARIA |
| `components/DocumentUploader.test.tsx` | Upload, validation, keyboard, ARIA |
| `components/ChatInterface.test.tsx` | Message flow, API success/error, UI state |

---

## ♿ Accessibility

- **Skip navigation** link (`#main-content`) for keyboard and screen-reader users
- All interactive elements have descriptive `aria-label` attributes
- Navigation uses `aria-current="page"` for active links
- File uploader supports keyboard navigation (`Enter`/`Space` to open), `aria-describedby` linked to hint text, `aria-invalid` + `aria-live="assertive"` on errors
- Chat log uses `role="log"` and `aria-live="polite"`
- Risk badges use `role="img"` with descriptive labels (`Risk level: High Risk`)
- Mobile hamburger menu closes on `Escape` key press
- Reduced-motion media query suppresses animations for users who prefer it
- High-contrast color palette on dark background
- Consistent `:focus-visible` outlines throughout

---

## 💡 Assumptions

1. Documents should be under 5 MB and in PDF, TXT, or MD format
2. PDF text extraction works on text-based PDFs (not scanned images — OCR is out of scope)
3. Analysis is based on the first ~30,000 characters of long documents (model context limit)
4. The app is informational only — it explicitly does not provide legal advice
5. A valid `GEMINI_API_KEY` environment variable must be set for AI features to work
6. In-memory rate limiting resets on server restart; a Redis-backed store would be needed for multi-instance production deployments

---

## 🔧 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | Full-stack React framework (App Router) |
| [TypeScript](https://typescriptlang.org) | 5 | Strict type safety (`strict: true`) |
| [Google Gemini Flash](https://ai.google.dev) | `gemini-3.6-flash` | AI analysis, comparison, Q&A |
| [pdf-parse](https://npmjs.com/package/pdf-parse) | 2.x | Server-side PDF text extraction |
| [lucide-react](https://lucide.dev) | latest | Icon system |
| [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com) | 29 | Unit & component testing |
| [uuid](https://npmjs.com/package/uuid) | 11 | Cryptographic request IDs in middleware |
| [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | — | Zero-CLS font loading (Inter) |

---

## 📝 License

MIT — see [LICENSE](LICENSE) for details.
