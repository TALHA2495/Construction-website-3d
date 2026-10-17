# Design System — Stonehaven Construction

## 1. Design intent

Premium architectural editorial. The site should feel like a considered architecture studio and a capable construction partner—not a generic contractor template and not a flashy 3D experiment.

The supplied photographs are the visual anchor: a contemporary single-storey residence with horizontal rooflines, dark metal frames, warm timber cladding, expansive glazing, natural landscaping, and a pool. The supplied images are daylight references. Do not darken every page just to create a “premium” look.

## 2. Brand personality

- Precise, grounded, confident, thoughtful, craft-oriented.
- Cinematic where useful; quiet and highly readable elsewhere.
- Premium without being exclusive or vague.
- Clear business language; no empty luxury buzzwords.

## 3. Color tokens

```css
:root {
  --color-charcoal: #171815;
  --color-deep: #10110F;
  --color-ivory: #F2F0EA;
  --color-limestone: #C7C0B4;
  --color-bronze: #9B8468;
  --color-sage: #7D8575;
  --color-ink: #20211E;
  --color-muted: #77766F;
  --color-line-light: rgba(32, 33, 30, 0.16);
  --color-line-dark: rgba(242, 240, 234, 0.18);
}
```

Use warm ivory and light neutrals for content surfaces, the supplied daylight imagery for the hero and projects, charcoal for selected high-contrast sections, and bronze/sage as restrained accents. Do not use neon, loud gradients, glassmorphism, or decorative glow as a default.

## 4. Typography

Use an editorial serif for selected display headings and a highly readable modern sans-serif for body copy, navigation, forms, labels, and utility text. Use a local/system fallback stack if remote font loading is unavailable.

- Use `clamp()` for fluid display type.
- Give headings deliberate line breaks without clipping at narrow widths.
- Keep paragraph line length comfortable.
- Use uppercase labels sparingly with measured tracking.
- Buttons must remain comfortably readable and easy to activate.

Suggested pairing: `DM Sans` or `Manrope` for sans-serif, with `DM Serif Display` or `Cormorant Garamond` for selected large editorial headlines. Use no more than two families unless the design requires a justified third.

## 5. Layout and spacing

- Use a consistent spacing scale based on 4px/8px increments.
- Provide generous section spacing without excessive dead space.
- Use a centered content container with a sensible maximum width and responsive gutters.
- Keep sections visually related through alignment, typography, and image treatment.
- Avoid turning every section into a rounded card.
- Prefer open layouts, thin rules, clear hierarchy, and purposeful asymmetry.

## 6. Image rules

Reference assets:
- `assets/reference/hero-desktop.jpg`
- `assets/reference/hero-mobile.jpg`

Use the landscape image for desktop and the portrait image for mobile through `<picture>` or an equivalent reliable responsive-image pattern. Verify the actual crop at each breakpoint. Never stretch the image. Do not assume the mobile image is dark/night photography; it is a daylight reference with a portrait crop.

Use `object-fit: cover` for photographic cards and choose `object-position` deliberately. The image should show the intended architectural subject, not merely fill the rectangle.

Any concept render must not be presented as a verified completed customer project.

## 7. Hero rules

- Architectural imagery is the hero, not decorative background noise.
- Keep primary copy short and high contrast.
- Use a clear primary action such as “Start Your Project” and a secondary action such as “Explore Our Work”.
- Avoid covering the house's most important features with oversized text.
- Make mobile composition intentionally different when necessary; do not simply scale down the desktop layout.
- Motion must not delay access to the headline or CTAs.

Suggested message:

“Built with Intention. Made to Last.”

Supporting line:
“Thoughtfully planned. Precisely built. From the first conversation to the final detail, we bring architectural vision and construction expertise together.”

All copy is editable concept content, not a factual claim about a real company.

## 8. Motion language

Motion should resemble carefully composed motion design:
- Controlled easing and timing.
- Masked editorial heading reveals.
- Staggered but restrained entrances.
- Subtle parallax where it supports depth.
- Scroll progress tied to one coherent timeline for the 3D helix.
- Clear dark-to-light transitions without harsh flashes.
- Consistent duration and easing across related elements.

Avoid constant idle movement, scroll hijacking, excessive bounce, random floating objects, long intro gates, and animations that hide content. Respect `prefers-reduced-motion` and ensure content remains usable without animation.

## 9. 3D helix presentation

The helix is a featured storytelling section, not the entire website. Cards should feature coherent construction/architecture imagery. Preserve the canonical reference's card bending, camera movement, depth order, guide lines, title timing, scene transition, and closing grid. See `.agents/skills/threejs-helix/SKILL.md`.

## 10. Components and states

Buttons, inputs, links, accordions, menus, and cards must have clear hover, active, focus-visible, disabled, error, and success states where relevant. Do not rely on color alone to communicate errors or status. All interactions must be keyboard accessible.

## 11. Responsive design

Verify at 1440, 1200, 1024, 768, 430, and 390 CSS pixels. Prevent horizontal overflow, clipped headings, tiny tap targets, overlapping content, and CTAs covered by sticky elements. Scale 3D rendering based on device capability and use a reliable fallback when WebGL is unavailable or reduced motion is requested.

## 12. Do not do this

- Do not use generic AI construction imagery in place of supplied references.
- Do not make up statistics, testimonials, credentials, customer names, awards, or past projects.
- Do not use fake buttons or fake form success.
- Do not sacrifice readability for visual effects.
- Do not alter the helix geometry from memory when canonical source code is available.
