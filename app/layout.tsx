import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <NavBar />
        <main>{children}</main>
        <footer className="border-t border-slate-800/60 mt-20 py-8 text-center text-sm text-slate-500">
          <p>LexAI provides legal <strong>information</strong> only — not legal advice.</p>
          <p className="mt-1">Always consult a qualified attorney for your specific situation.</p>
        </footer>
      </body>
    </html>
  );
}
