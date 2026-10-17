import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f2f0ea]">
        <section className="mx-auto max-w-[var(--max-width)] px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl leading-tight text-[#10110f]">
              About Stonehaven
            </h1>
            <p className="mt-4 text-[#77766f]">
              A premium custom home builder focused on architectural
              integrity, material honesty, and lasting craft.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-[#10110f]">
                Our Approach
              </h2>
              <p className="text-[#cccbcb] leading-relaxed">
                We believe great homes are built on great relationships.
                That means listening first, designing with intention, and
                building with precision. Every project is a collaboration
                between you, your site, and our team.
              </p>
              <h2 className="font-serif text-2xl text-[#10110f] mt-8">
                Craft & Materials
              </h2>
              <p className="text-[#cccbcb] leading-relaxed">
                We work with enduring materials — stone, timber, steel, and
                glass — chosen for their character and longevity. The details
                matter: the reveal at a window sill, the joinery at a corner,
                the way light moves through a room across the day.
              </p>
            </div>
            <div className="border-l border-[#1a1b19] pl-8">
              <blockquote className="text-2xl font-serif text-[#10110f] italic border-l-4 border-[#9B8468] pl-4 py-2">
                "Build with intention. Made to last."
              </blockquote>
              <div className="mt-8 text-sm text-[#6b6a61]">
                <p>
                  Stonehaven Construction is a concept project — a fictional
                  premium custom home builder used to demonstrate
                  architectural web design.
                </p>
                <p>All imagery and copy are illustrative.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
