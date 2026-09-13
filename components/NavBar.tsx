"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, FileSearch, GitCompare, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/analyze", label: "Analyze", icon: FileSearch },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/qa",      label: "Ask LexAI",    icon: MessageSquare },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 glass" role="banner">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="LexAI Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Scale className="w-4.5 h-4.5 text-white" size={18} aria-hidden="true" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Lex<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex items-center gap-1" role="list">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600/15 text-blue-400"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {/* Mobile nav */}
      {open && (
        <div id="mobile-menu" className="sm:hidden border-t border-slate-800/60 px-4 pb-4">
          <ul className="flex flex-col gap-1 mt-3" role="list">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                      active
                        ? "bg-blue-600/15 text-blue-400"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
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
    </header>
  );
}
