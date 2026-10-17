import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f2f0ea] min-h-[60vh] flex flex-col justify-center">
        <div className="mx-auto max-w-[var(--max-width)] px-6 text-center">
          <h1 className="font-serif text-6xl leading-none text-[#10110f]">404</h1>
          <p className="mt-4 text-xl text-[#77766f]">Page not found</p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-[#9B8468] px-6 py-3 text-sm font-semibold text-[#10110f] transition-colors hover:bg-[rgba(155,132,104,0.9)]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
