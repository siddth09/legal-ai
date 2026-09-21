"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, FileSearch, GitCompare, MessageSquare, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const nav = [
  { href: "/analyze", label: "Analyze",   icon: FileSearch  },
  { href: "/compare", label: "Compare",   icon: GitCompare  },
  { href: "/qa",      label: "Ask LexAI", icon: MessageSquare },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      borderBottom: "1px solid var(--border)",
      background: "rgba(7,9,15,0.85)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }} role="banner">
      <nav
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }} aria-label="LexAI Home">
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(59,130,246,0.3)",
          }}>
            <Scale size={15} color="#fff" aria-hidden="true" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>
            Lex<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul style={{ display: "flex", alignItems: "center", gap: 2, listStyle: "none", margin: 0, padding: 0 }} className="hidden-mobile">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    transition: "all 0.15s",
                    ...(active
                      ? { background: "rgba(59,130,246,0.12)", color: "#60a5fa" }
                      : { color: "var(--text-secondary)", background: "transparent" }),
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          style={{ padding: 8, borderRadius: 8, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          className="show-mobile"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" style={{ borderTop: "1px solid var(--border)", padding: "12px 20px 16px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: 4, listStyle: "none", margin: 0, padding: 0 }}>
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 9,
                      fontSize: 14, fontWeight: 600, textDecoration: "none",
                      ...(active
                        ? { background: "rgba(59,130,246,0.12)", color: "#60a5fa" }
                        : { color: "var(--text-secondary)" }),
                    }}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style>{`
        @media (min-width: 640px) { .show-mobile { display: none !important; } }
        @media (max-width: 639px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
