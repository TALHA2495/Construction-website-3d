import Link from "next/link";
import { Mail } from "lucide-react";

const footerSections = [
  {
    title: "Architecture",
    links: [
      { label: "Designed Residences", href: "/work" },
      { label: "Residential Projects", href: "/work" },
      { label: "Concept Studies", href: "/work" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Custom Homes", href: "/services" },
      { label: "Renovations", href: "/services" },
      { label: "Design-Build", href: "/services" },
      { label: "Project Management", href: "/services" },
    ],
  },
  {
    title: "Process",
    links: [
      { label: "Consultation", href: "/process" },
      { label: "Design & Estimating", href: "/process" },
      { label: "Construction", href: "/process" },
      { label: "Handover", href: "/process" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Inquiry Form", href: "/contact" },
      { label: "Map & Directions", href: "/contact" },
      { label: "Company Philosophy", href: "/about" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#10110f] bg-[#10110f]">
      <div className="mx-auto max-w-[var(--max-width)] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-ivory">
              stonehaven
            </h2>
            <p className="mt-2 text-sm text-[#9B8468] leading-relaxed">
              Premium custom home building and construction design.
              <br />
              <span className="text-ivory">
                Thoughtfully planned. Precisely built.
              </span>
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-[#9B8468]">
              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-ivory"
              >
                <Mail className="h-4 w-4" />
                inquiry@stonehaven.dev
              </a>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-medium text-[#9B8468] uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#cccbcb] transition-colors hover:text-ivory"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[#1a1b19] pt-6 text-sm text-[#6b6a61]">
          <p>
            Stonehaven Construction is a fictional premium custom home builder
            and construction company. All content on this site is concept copy
            and illustrative project material.
          </p>
          <p className="mt-2 text-xs">
            &copy; {new Date().getFullYear()} Stonehaven Construction. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
