"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const fields = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
  { id: "email", label: "Email Address", type: "email", placeholder: "jane@example.com" },
  { id: "phone", label: "Phone Number", type: "tel", placeholder: "(555) 000-0000" },
  { id: "projectType", label: "Project Type", type: "select", options: ["Custom Home", "Remodel", "Addition", "Commercial", "Consultation"] },
  { id: "timeline", label: "Timeline", type: "select", options: ["0–3 months", "3–6 months", "6–12 months", "12+ months", "Not sure yet"] },
  { id: "budget", label: "Budget Range", type: "select", options: ["Under $500k", "$500k–$1M", "$1M–$2M", "$2M–$5M", "$5M+", "Prefer not to say"] },
  { id: "message", label: "Tell us about your project", type: "textarea", placeholder: "What are you hoping to build? Share your site, aspirations, and any timeline considerations." },
];


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    timeline: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => { const next = { ...prev }; delete next[id]; return next; });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Enter a valid email address";
    if (!formData.message.trim()) next.message = "Please tell us about your project";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Demo mode: no backend configured. Simulate a network delay.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
    }, 1200);
  };
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f2f0ea]">
        <section className="mx-auto max-w-[var(--max-width)] px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h1 className="font-serif text-4xl leading-tight text-[#10110f]">
                Start Your Project
              </h1>
              <p className="mt-4 text-[#77766f] leading-relaxed">
                Tell us about your site, your aspirations, and your timeline.
                We will follow up with a clear next step and an honest estimate.
              </p>
              <div className="mt-8 space-y-3 text-sm text-[#cccbcb]">
                <p>
                  <span className="text-[#9B8468] font-medium">Email:</span>{" "}
                  inquiry@stonehaven.dev
                </p>
                <Link
                  href="mailto:inquiry@stonehaven.dev"
                  className="inline-block text-[#cccbcb] hover:text-ivory transition-colors"
                >
                  Send email directly
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm font-medium text-[#9B8468] uppercase tracking-wider">
                {submitStatus === "success"
                  ? "Thank you — we will be in touch shortly."
                  : submitStatus === "error"
                  ? "Something went wrong. Please try again."
                  : "Inquiry form"}
              </p>

              {fields.map((field) => {
                const error = errors[field.id];
                return (
                  <div key={field.id} className="space-y-1">
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-[#cccbcb]"
                    >
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        id={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`rounded-md border px-3 py-2 text-sm bg-[#10110f] text-[#cccbcb] focus:border-[#9B8468] focus:outline-none transition-colors ${
                          error ? "border-[#d46a6a]" : "border-[#1a1b19]"
                        }`}
                      >
                        <option value="">Select an option</option>
                        {field.options!.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        id={field.id}
                        rows={field.type === "textarea" ? 4 : 1}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={`rounded-md border px-3 py-2 text-sm bg-[#10110f] text-[#cccbcb] focus:border-[#9B8468] focus:outline-none transition-colors ${
                          error ? "border-[#d46a6a]" : "border-[#1a1b19]"
                        }`}
                      />
                    )}
                    {error && (
                      <p className="text-xs text-[#d46a6a]">{error}</p>
                    )}
                  </div>
                );
              })}

              <div className="mt-2 text-xs text-[#6b6a61]">
                <strong>Demo mode:</strong> No backend is configured. This form
                simulates submission and does not send data anywhere.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors ${
                  isSubmitting
                    ? "bg-[#1a1b19] text-[#cccbcb] cursor-not-allowed"
                    : "bg-[#9B8468] text-[#10110f] hover:bg-[rgba(155,132,104,0.9)]"
                }`}
              >
                {isSubmitting ? "Sending…" : "Send Inquiry"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}