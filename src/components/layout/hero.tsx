import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HelixSectionComponent from "@/components/helix/HelixSection";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#10110f]">
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/hero-mobile.jpg" />
          <img
            src="/images/hero-desktop.jpg"
            alt="Stonehaven Construction residence — daylight exterior"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#10110f] via-[#171815] to-[#0d0d0b]" />
      </div>

      <div className="relative mx-auto max-w-[var(--max-width)] px-6 pt-24 pb-28 sm:pt-32 sm:pb-36">
        <div className="max-w-2xl">
          <p className="mb-4 inline-block rounded-full bg-[rgba(155,132,104,0.25)] px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase text-[#9B8468]">
            Premium Custom Homes
          </p>
          <h1 className="font-serif text-5xl leading-[1.1] text-ivory sm:text-6xl md:text-7xl">
            Built with
            <br />
            <span className="text-[#9B8468]">Intention.</span>
            <br />
            Made to
            <br />
            <span className="text-[#9B8468]">Last.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-[#cccbcb] sm:text-lg">
            Thoughtfully planned. Precisely built. From the first conversation to
            the final detail, we bring architectural vision and construction
            expertise together.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#9B8468] px-6 py-3 text-sm font-semibold text-[#10110f] transition-colors hover:bg-[rgba(155,132,104,0.9)]"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-md border border-[#1a1b19] bg-[rgba(255,255,255,0.04)] px-6 py-3 text-sm font-semibold text-[#cccbcb] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            >
              Explore Our Work
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#10110f] to-transparent" />
    </section>
  );
}

export function ServicesPreview() {
  return (
    <section className="bg-[#f2f0ea]">
      <div className="mx-auto max-w-[var(--max-width)] px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight text-[#10110f]">
            A Construction Partner for Every Stage of the Build
          </h2>
          <p className="mt-4 text-[#77766f]">
            From initial consultation through final handover, we bring
            architectural vision and hands-on construction expertise together.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Custom Homes",
              description: "Thoughtfully designed residences tailored to your lifestyle, site, and aspirations.",
              href: "/services",
            },
            {
              title: "Design-Build",
              description: "Seamless coordination between design and construction under one accountable team.",
              href: "/services",
            },
            {
              title: "Remodels & Additions",
              description: "Thoughtful updates that respect the original architecture while modernizing your space.",
              href: "/services",
            },
            {
              title: "Commercial Build",
              description: "Purpose-built spaces for retail, office, and hospitality clients.",
              href: "/services",
            },
          ].map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group block rounded-md border border-[#1a1b19] bg-[rgba(255,255,255,0.04)] p-6 transition-colors hover:bg-[rgba(155,132,104,0.15)]"
            >
              <h3 className="font-serif text-xl text-[#9B8468]">{service.title}</h3>
              <p className="mt-2 text-sm text-[#cccbcb]">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HelixSection() {
  return <HelixSectionComponent />;
}

export function CtaSection() {
  return (
    <section className="bg-[#10110f]">
      <div className="mx-auto max-w-[var(--max-width)] px-6 py-20 text-center">
        <h2 className="font-serif text-3xl leading-tight text-ivory">
          Ready to Start Your Project?
        </h2>
        <p className="mt-4 text-[#cccbcb]">
          Tell us about your site, your aspirations, and your timeline. We will
          follow up with a clear next step and an honest estimate.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-[#9B8468] px-6 py-3 text-sm font-semibold text-[#10110f] transition-colors hover:bg-[rgba(155,132,104,0.9)]"
          >
            Request an Estimate
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-[#1a1b19] bg-[rgba(255,255,255,0.04)] px-6 py-3 text-sm font-semibold text-[#cccbcb] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
          >
            inquiry@stonehaven.dev
          </Link>
        </div>
      </div>
    </section>
  );
}
