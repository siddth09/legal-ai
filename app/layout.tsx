import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "LexAI – AI-Powered Legal Document Assistant",
  description:
    "Understand, compare, and navigate legal documents with AI. LexAI helps you decode contracts, spot risks, and prepare for legal consultations — for free.",
  keywords: ["legal AI", "contract analysis", "legal document assistant", "NDA analyzer", "lease analyzer"],
  openGraph: {
    title: "LexAI – AI-Powered Legal Document Assistant",
    description: "Decode any legal document in seconds with AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--bg)", color: "var(--text-primary)", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <NavBar />
        <main>{children}</main>
        <footer style={{
          borderTop: "1px solid var(--border)", marginTop: 80,
          padding: "28px 24px", textAlign: "center",
          fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8,
        }}>
          <p>LexAI provides legal <strong style={{ color: "var(--text-secondary)" }}>information</strong> only — not legal advice.</p>
          <p>Always consult a qualified attorney for your specific situation.</p>
        </footer>
      </body>
    </html>
  );
}
