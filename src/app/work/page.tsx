import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const projects = [
  {
    title: "Canyon Ridge Residence",
    location: "Aspen, CO",
    description: "A contemporary mountain home carved into a south-facing slope, with floor-to-ceiling glazing that frames the valley below.",
    image: "/images/hero-desktop.jpg",
  },
  {
    title: "Lakeside Pavilion",
    location: "Lake Tahoe, CA",
    description: "A low-profile pavilion that sits lightly on the shoreline, using charred timber and stone to blend into the forest edge.",
    image: "/images/hero-mobile.jpg",
  },
  {
    title: "Prairie House",
    location: "Marfa, TX",
    description: "A rectilinear residence inspired by the flat horizon, with deep overhangs and a central courtyard that brings light into every room.",
    image: "/images/hero-desktop.jpg",
  },
];

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f2f0ea]">
        <section className="mx-auto max-w-[var(--max-width)] px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl leading-tight text-[#10110f]">
              Selected Work
            </h1>
            <p className="mt-4 text-[#77766f]">
              A curated selection of custom homes and architectural projects.
              Each one is a collaboration between client, site, and craft.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="rounded-md border border-[#1a1b19] bg-[#10110f] overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h2 className="font-serif text-xl text-[#10110f]">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#9B8468] uppercase tracking-wider">
                    {project.location}
                  </p>
                  <p className="mt-4 text-sm text-[#cccbcb] leading-relaxed">
                    {project.description}
                  </p>
                  <Link
                    href="#"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#9B8468] hover:text-[#10110f]"
                  >
                    View project <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
