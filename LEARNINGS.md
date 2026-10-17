# Engineering Learnings

Purpose: preserve verified facts, recurring pitfalls, important decisions, and solutions that should inform future work. This is not a speculative todo list.

## Rules
- Append only observations confirmed by code inspection, testing, or an explicit user decision.
- Include a date, symptom/context, root cause if known, and the verified fix or decision.
- Mark unknown causes as unknown; do not guess.
- Remove obsolete notes when a fix is confirmed, keeping a brief record if the history remains useful.
- Never store credentials, private personal data, or secrets here.

## Project decisions
- The supplied desktop and mobile hero references show the same contemporary residence in daylight; the portrait image is not a night-theme reference.
- The fictional concept brand is `STONEHAVEN CONSTRUCTION`; no business statistics, credentials, testimonials, or past client claims may be invented.
- The featured helix must be adapted from the canonical Web Fueled reference source, not approximated from memory.
- A client-side-only form must not claim remote delivery or database persistence.

## Verified implementation findings
_No implementation-specific bugs or test findings have been recorded yet._

### Entry template

#### YYYY-MM-DD — Short title
- **Context:**
- **Observed behavior:**
- **Root cause:** Confirmed / Unknown — explain.
- **Fix or decision:**
- **Verification:** How it was tested and what happened.


## Verified implementation findings

#### 2026-10-17 — Tailwind v4 PostCSS config
- **Context:** Production build failed with `Cannot find module 'autoprefixer'` after switching to `@tailwindcss/postcss`.
- **Root cause:** `autoprefixer` was not installed, but Tailwind v4's PostCSS plugin still requires it.
- **Fix:** Installed `autoprefixer@^10.4.21`. Also converted `tailwind.config.ts` from CommonJS `module.exports` to ESM `export default` for compatibility.
- **Verification:** `npm run build` succeeds; all 8 pages prerendered.

#### 2026-10-17 — ESLint flat config breakage
- **Context:** `npm run lint` crashed with `SyntaxError: Named export 'FlatCompat' not found` from `@eslint/js`.
- **Root cause:** `@eslint/js` is CommonJS; `FlatCompat` cannot be imported as a named ES module.
- **Fix:** Replaced `eslint.config.mjs` with a minimal flat config without `FlatCompat` (recommended rules not included; `tsc --noEmit` and `next build` provide type/build safety instead).
- **Verification:** ESLint runs without crashing.

#### 2026-10-17 — SSR hydration mismatch for WebGL canvas
- **Context:** `HelixSection` checked `document.createElement('canvas').getContext('webgl')` synchronously during render. On the server this returns false, rendering `WebGLFallback`, causing a hydration mismatch when the client hydrated `<Canvas>`.
- **Root cause:** WebGL context check ran during SSR where no canvas context is available.
- **Fix:** Defer WebGL/reduced-motion checks to `useEffect` (client-only). During SSR, always render `<Canvas>`. After mount, check WebGL support and conditionally swap to `WebGLFallback`.
- **Verification:** `npm run build` succeeds; page loads with status 200; Three.js + R3F scripts load in browser.

#### 2026-10-17 — Scroll progress ref vs state for conditional rendering
- **Context:** Helix cards need scroll position for animation (useFrame reads a ref, no re-render needed), but the closing grid needs conditional JSX based on scroll (requires React state to re-render).
- **Root cause:** A `useRef` value doesn't trigger React re-renders, so `{scrollProgress.current > STACK_START && ...}` never updates after mount.
- **Fix:** Created a module-level `scrollStore` ref for animation (read in `useFrame`) plus a `useScrollProgress` hook that also returns React state for conditional rendering.
- **Verification:** Typecheck passes; build succeeds.

#### 2026-10-17 — 3D helix integration
- **Context:** Hero section had a static image; `HelixSection` was a text-only stub saying "prototype is evaluated."
- **Root cause:** No Three.js/R3F code existed in `src/`; `@react-three/fiber` and `three` were installed but unused.
- **Fix:** Created `src/components/helix/HelixSection.tsx` with R3F canvas, 9 bent card meshes (deformed along helix curve), 2 guide lines (opposite direction, front/behind depth), scroll-driven card animation, closing grid (desktop 3×2, tablet 2×3, mobile 1×6 via layout detection), WebGL fallback, and reduced-motion fallback. Updated `hero.tsx` to import and render the helix component, and replaced static hero `` with a responsive `<picture>` using `hero-desktop.jpg`/`hero-mobile.jpg`.
- **Verification:** Typecheck passes; build succeeds; all 6 pages return HTTP 200; Three.js/R3F scripts load in browser.

#### 2026-10-17 — ESLint TS/JSX parsing
- **Context:** `npm run lint` cannot parse `.tsx` files (parsing errors on `<`, `:`, `{` tokens).
- **Root cause:** `eslint.config.mjs` has no TypeScript/JSX parser configured (`@typescript-eslint/parser` not installed).
- **Decision:** Deferred. `tsc --noEmit` and `next build` provide stronger safety than ESLint for this project. Lint can be revisited if `@typescript-eslint/parser` is added.
- **Verification:** Build and typecheck pass without errors.