import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const services = [
  {
    title: "Custom Homes",
    description:
      "Thoughtfully designed residences tailored to your lifestyle, site, and aspirations. From concept sketches to final walkthrough, we manage every detail.",
  },
  {
    title: "Design-Build",
    description:
      "Seamless coordination between design and construction under one accountable team. One point of contact, one schedule, one budget.",
  },
  {
    title: "Remodels & Additions",
    description:
      "Thoughtful updates that respect the original architecture while modernizing your space for how you live today.",
  },
  {
    title: "Commercial Build",
    description:
      "Purpose-built spaces for retail, office, and hospitality clients who value craftsmanship and material integrity.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f2f0ea]">
        <section className="mx-auto max-w-[var(--max-width)] px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl leading-tight text-[#10110f]">
              Services
            </h1>
            <p className="mt-4 text-[#77766f]">
              From initial consultation through final handover, we bring
              architectural vision and hands-on construction expertise together.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <section
                key={service.title}
                className="rounded-md border border-[#1a1b19] bg-[#10110f] p-8"
              >
                <h2 className="font-serif text-2xl text-[#9B8468]">
                  {service.title}
                </h2>
                <p className="mt-4 text-[#cccbcb] leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-block text-sm font-medium text-[#cccbcb] hover:text-ivory transition-colors"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
