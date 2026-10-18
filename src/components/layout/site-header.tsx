"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#10110f] bg-[#10110f]/95">
      <div className="mx-auto flex h-20 max-w-[var(--max-width)] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-ivory">
          <span className="text-xl font-serif font-semibold text-ivory">
            stonehaven
          </span>
          <span className="text-sm font-sans text-[#9B8468] tracking-[0.15em] uppercase">
            construction
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-2 text-sm font-medium text-[#cccbcb] transition-colors hover:text-ivory [text-decoration:none]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-[#cccbcb] hover:bg-[rgba(255,255,255,0.08)] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav aria-label="Mobile" className="border-t border-[#1a1b19] md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-[#cccbcb] hover:bg-[rgba(255,255,255,0.06)] hover:text-ivory"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header >
  );
}
