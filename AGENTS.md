# Agent Instructions — Stonehaven Construction

## Mission
Build and validate a premium, responsive construction-company website that combines the supplied architectural images, refined editorial design, a reference-faithful scroll-driven Three.js helix, a clear construction workflow, and a truthful lead-generation experience.

## Read before editing
1. `design.md`
2. `prd.md`
3. `.agents/skills/threejs-helix/SKILL.md` before touching the helix
4. `LEARNINGS.md`
5. Existing source files and `assets/reference/README.md`

## General working rules
- Inspect the current folder, git status, stack, scripts, assets, and existing architecture before editing anything.
- Preserve existing user work. Do not overwrite unrelated files, remove functioning behavior, or restructure the project without a clear reason.
- If starting fresh, use plain HTML, CSS, JavaScript, and Three.js. Do not introduce a framework or build system without a demonstrated need. If an existing framework is already in use, keep it unless the user approves a change or the technical case is compelling and documented.
- Work directly in the project. Do not stop after offering a plan or generating an isolated code sample.
- Prefer small, testable changes. After each significant change, run the relevant checks.
- Keep dependencies and assets lean. Avoid unnecessary packages, remotely hosted dependencies where local assets are practical, and unused code.
- Do not fabricate project facts, real client names, testimonials, certification, awards, business metrics, locations, contact details, or years of experience. Use clearly labelled concept content or editable placeholders.
- Never claim that a form submitted, email sent, test passed, website launched, browser checked, server started, or requirement satisfied unless it was actually verified.
- If a required tool, file, browser, endpoint, or server is unavailable, clearly report the blocker and finish all other feasible work.
- Do not use `file://` as the final website preview URL. Start an appropriate local HTTP server when the environment supports it and report the actual URL.
- Keep buttons, navigation, anchors, forms, accordions, and project links functional. Do not leave decorative controls that pretend to work.

## Visual and interaction rules
- Follow `design.md`; do not invent a second design system.
- Use the supplied desktop and mobile architectural reference images. They depict the same contemporary residence in daylight; filenames from earlier uploads may misleadingly include the word “night”.
- Keep the building, palette, material character, and visual language coherent across the site.
- Use motion to clarify the content and support the architectural story, not as decoration that obstructs browsing.
- Respect `prefers-reduced-motion`, keyboard operation, touch input, and reasonable device performance.
- Keep meaningful content available even if WebGL fails or reduced motion is enabled.
- Do not hijack scrolling or trap users in the helix.

## Helix rules
- Read the canonical source and its validation checklist before implementation or modification.
- Use the reference implementation for the difficult geometry, timing, camera behavior, card deformation, layer ordering, image handling, and responsive closing grid.
- Do not approximate curved/deforming card surfaces with rigid flat planes positioned in a circle.
- Preserve the two guide lines' opposite travel direction and their intended front/behind depth relationships.
- Preserve the reference card order and responsive closing-grid behavior unless a validated technical issue requires a documented adjustment.
- Re-run the reference checklist after any change to geometry, timings, resize handling, images, or scene ordering.
- Do not claim “pixel perfect” or “reference faithful” unless it has actually been compared and verified.

## Lead generation rules
- The main CTA must reach the inquiry form or an explicitly configured destination.
- Validate input, provide clear field errors, handle loading and failure, prevent accidental duplicate submissions, and preserve user-entered data after recoverable errors.
- Do not report success until a configured endpoint acknowledges success.
- If no backend is configured, clearly label demo mode and offer a locally useful fallback without claiming remote delivery.
- Never expose secret keys in client-side code.

## Verification expectations
After implementation:
1. Run the project's existing lint, test, type-check, and build commands if present.
2. Start the correct local preview server and retain it while browser review is performed, if the environment allows it.
3. Inspect the website in an actual browser if browser tooling is available.
4. Test desktop, tablet, and narrow mobile layouts, major CTAs, the menu, inquiry form, reduced-motion behavior, helix, and closing grid.
5. Check failed network requests, console exceptions, image paths, overflow, focus, text clipping, resizing, and context loss/fallback behavior.
6. Compare helix behavior with the canonical validation file.
7. Append only verified findings and useful durable decisions to `LEARNINGS.md`.
8. Report completed checks separately from checks that could not be performed.

## Change discipline
Before major edits, summarize the impact and risks briefly. For normal implementation tasks, proceed without asking for approval for every small change. Ask one direct clarification only when an essential decision cannot be safely inferred.
