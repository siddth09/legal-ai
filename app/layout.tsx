import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LexAI – AI-Powered Legal Document Assistant",
  description:
    "Understand, compare, and navigate legal documents with AI. LexAI helps you decode contracts, spot risks, compare agreements, and prepare smarter questions for your attorney — for free.",
  keywords: ["legal AI", "contract analysis", "legal document assistant", "NDA analyzer", "lease analyzer"],
  openGraph: {
    title: "LexAI – AI-Powered Legal Document Assistant",
    description: "Decode any legal document in seconds with AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Skip navigation for keyboard/screen-reader users */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <NavBar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer>
          <p>
            LexAI provides legal <strong>information</strong> only — not legal advice.
          </p>
          <p>Always consult a qualified attorney for your specific situation.</p>
        </footer>
      </body>
    </html>
  );
}
