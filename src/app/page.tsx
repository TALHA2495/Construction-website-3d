import { Hero, ServicesPreview, HelixSection, CtaSection } from "@/components/layout/hero";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ServicesPreview />
        <HelixSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
