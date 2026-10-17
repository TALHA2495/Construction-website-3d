# Product Requirements — Stonehaven Construction Website

## 1. Overview

Build a premium responsive public website for a fictional construction-company concept, optimized to explain services, show architectural capability, demonstrate the building process, and collect qualified project inquiries. The website also serves as the agency's flagship frontend/3D portfolio case study.

## 2. Primary audiences

1. US homeowners exploring custom homes or major renovations.
2. Commercial property owners seeking a construction partner.
3. Architects and developers evaluating project execution capabilities.
4. Potential agency clients reviewing frontend engineering and motion quality.

## 3. Goals

- Establish credibility and a distinct architectural visual identity.
- Make services and the typical construction workflow easy to understand.
- Showcase an advanced scroll-driven 3D experience without blocking usability.
- Convert interested visitors into project inquiries.
- Demonstrate responsive design, accessibility, performance awareness, and working UI.

## 4. Non-goals for the first release

- Full construction project-management software.
- Staff permissions or internal CRM dashboard.
- Invoicing, payment processing, scheduling crews, procurement, or inventory.
- Real-time structural simulation or a fully walkable game environment.
- A production backend unless one is already configured or explicitly requested.

## 5. Information architecture

Recommended homepage sections:
1. Responsive navigation.
2. Architectural hero.
3. Brand/craftsmanship statement.
4. Services.
5. Featured projects / 3D helix.
6. Construction process.
7. Trust/working principles.
8. FAQ.
9. Project inquiry form.
10. Footer.

If dedicated project pages are created, every card must link to a real implemented route. Otherwise use working in-page details or modal disclosures.

## 6. Hero requirements

- Use `assets/reference/hero-desktop.jpg` as the wide-screen hero reference.
- Use `assets/reference/hero-mobile.jpg` as the portrait mobile hero reference.
- Maintain a consistent residence and material palette.
- Include a concise headline and functioning primary/secondary CTAs.
- Preserve image aspect ratio and choose cropping deliberately.

## 7. Services

Create concise content for:
- Custom Homes.
- Residential Renovations.
- Commercial Construction.
- Design-Build.
- Project Management.
- Pre-Construction Planning.

The text must explain what the service includes, without unsupported claims or implied guarantees.

## 8. Helix interaction requirements

Canonical reference:
- Demo: https://webfueled.dev/resources/helix/v1/
- Repository: https://github.com/webfueled/web-fueled-helix
- Source guide: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/AI_SOURCE.md
- Instructions: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/AI_INSTRUCTIONS.md
- Validation: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/VALIDATION.md

Requirements:
- Nine image cards move through a true 3D helix.
- Card surfaces visibly deform to follow the curved path; they must not remain rigid flat planes distributed around a circle.
- Scroll drives the movement smoothly and predictably.
- Two curved guide lines travel in the opposite direction from the cards.
- One guide line renders behind the cards and one in front, according to the reference's depth design.
- Preserve the editorial text choreography, adapted to construction messaging such as “DESIGN + BUILD” and “BUILT TO LAST”.
- Use a controlled dark-to-light scene transition.
- Resolve the closing sequence into the reference's responsive six-card grid behavior and staggered settling motion.
- Support SVG, JPG/JPEG, PNG, and WebP image inputs, with centered cover-style cropping that does not stretch images.
- Handle resize, reduced motion, WebGL failure, and small/mobile screens gracefully.
- Inspect and follow `VALIDATION.md`; don't approximate complex source behavior from memory.

Closing grid targets from the supplied reference requirements:
- 1200px and above: 3 columns × 2 rows.
- 601px–1199px: 2 columns × 3 rows.
- 600px and below: 1 column × 6 rows.

The mapping from nine helix assets to the six closing cards must be taken from the reference source, not guessed.

## 9. Construction workflow content

Display a typical process in a clear timeline:
1. Initial inquiry.
2. Discovery and site visit.
3. Feasibility and estimate.
4. Proposal and agreement.
5. Planning and scheduling.
6. Construction and updates.
7. Quality review.
8. Handover and follow-up.

Explain that the exact process, permits, inspections, and timing vary by project and jurisdiction. Do not suggest every project has an identical legal or construction process.

## 10. Featured projects

- Use a curated selection.
- Include title, type, description, and optional location only when verified or clearly described as illustrative.
- Do not invent client relationships, completion data, testimonials, or verified project outcomes.
- Label concept visualizations as concept projects.

## 11. Lead generation

The primary CTA routes to a project inquiry form.

Suggested fields:
- Project type.
- Project location.
- Project stage.
- Budget range.
- Desired timeline.
- Project summary.
- Name.
- Email.
- Optional phone/preferred contact method.
- Contact consent.

Requirements:
- Accessible labels and clear required/optional status.
- Inline validation and readable errors.
- Loading and failure states.
- Prevent repeated accidental submissions.
- Preserve entries after recoverable submission errors.
- Configure a real form endpoint only when one is available.
- Never claim a message has been delivered when only client-side validation has run.
- If no endpoint exists, explicitly show demo mode and provide an honest local fallback.

## 12. Trust and FAQ

Use process clarity and craftsmanship principles rather than unverifiable credentials. FAQ topics should include project types, estimate requirements, budget development, scope changes, progress updates, and pre-construction preparation.

## 13. Accessibility and performance

- Semantic HTML and a logical heading structure.
- Keyboard navigation and visible focus states.
- Form labels and accessible validation.
- Respect `prefers-reduced-motion`.
- Useful non-WebGL fallback.
- No forced scroll or long scroll lock.
- Lazy-load non-critical imagery and avoid unnecessarily large textures.
- Handle resize and device pixel ratio responsibly.
- No console errors or missing asset paths during verified testing.

## 14. Acceptance criteria

The build is acceptable only when:
- Hero image selection and crop are correct at desktop and mobile sizes.
- All major sections are present and coherently styled.
- All CTA links and navigation controls work.
- The 3D cards genuinely deform along the helix and preserve expected depth ordering.
- The two guide lines move correctly in relation to the cards.
- The heading sequence, scene transition, and closing grid match the reference's validated behavior.
- Closing-grid breakpoints are correct.
- Inquiry validation is correct and submission claims are truthful.
- Reduced-motion and WebGL fallback paths are usable.
- Layout is checked at 1440, 1200, 1024, 768, 430, and 390px.
- Console, path, and network failures are checked in an actual browser when browser tooling is available.
- The agent reports exactly which checks ran, which failed, and which could not be performed.

## 15. Initial copy direction

Headline: “Built with Intention. Made to Last.”
Supporting text: “Thoughtfully planned. Precisely built. From the first conversation to the final detail, we bring architectural vision and construction expertise together.”
Primary CTA: “Start Your Project”.
Secondary CTA: “Explore Our Work”.

This is concept copy and must be adjusted to fit the actual company if the project is later used commercially.
