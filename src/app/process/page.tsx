import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const steps = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We start with a conversation about your site, your aspirations, your budget, and your timeline. No obligation, just clarity.",
  },
  {
    step: "02",
    title: "Design & Estimating",
    description:
      "Our team develops concept designs and a transparent cost estimate so you can make informed decisions before anything is built.",
  },
  {
    step: "03",
    title: "Construction",
    description:
      "We manage the build with regular site visits, clear communication, and a single point of accountability from foundation to finish.",
  },
  {
    step: "04",
    title: "Handover",
    description:
      "A thorough walkthrough, all documentation, and a commitment to stand behind our work long after the keys are handed over.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f2f0ea]">
        <section className="mx-auto max-w-[var(--max-width)] px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl leading-tight text-[#10110f]">
              Our Process
            </h1>
            <p className="mt-4 text-[#77766f]">
              A clear, transparent path from first conversation to final
              handover — so you always know where things stand.
            </p>
          </div>
          <div className="mt-16 space-y-16">
            {steps.map((step) => (
              <section
                key={step.step}
                className="grid gap-4 md:grid-cols-2 md:items-start"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-[3rem] font-serif font-bold text-[#9B8468]">
                    {step.step}
                  </span>
                  <h2 className="font-serif text-2xl text-[#10110f]">
                    {step.title}
                  </h2>
                  <p className="text-[#cccbcb] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
