# Skill: Integrate and Validate the Scroll-Driven Three.js Helix

## When to use
Use this workflow before building, modifying, debugging, or validating the featured 3D helix section. Do not use it for ordinary CSS carousels.

## Canonical implementation
- Demo: https://webfueled.dev/resources/helix/v1/
- Repository: https://github.com/webfueled/web-fueled-helix
- `AI_SOURCE.md`: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/AI_SOURCE.md
- `AI_INSTRUCTIONS.md`: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/AI_INSTRUCTIONS.md
- `index.html`: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/index.html
- `styles.css`: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/styles.css
- `main.js`: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/main.js
- `VALIDATION.md`: https://raw.githubusercontent.com/webfueled/web-fueled-helix/main/VALIDATION.md
- Assets: `assets/work-01.svg` through `assets/work-09.svg` in the canonical repository.

## Mandatory procedure
1. Inspect the current project's source, dependency manager, package scripts, and git status.
2. Read `AI_SOURCE.md`, then `AI_INSTRUCTIONS.md`, the source HTML/CSS/JS, all relevant assets, and `VALIDATION.md`.
3. Record the reference's geometry strategy, mesh deformation, camera parameters, scroll mapping, title timing, line depth ordering, closing-grid mapping, resize behavior, and cleanup strategy.
4. Integrate the existing implementation into the current project with the smallest reasonable change. Do not replace the source's difficult math with a simplified animation.
5. Replace only the visual assets and relevant marketing copy needed to adapt the experience to construction. Preserve the reference's card order and timing logic unless an actual bug requires change.
6. Run the reference validation checklist.
7. Test on desktop and mobile, including resizing while the page is at different scroll positions.
8. Inspect browser console errors, failed requests, missing textures, clipping, and z/depth-order issues.
9. Document real deviations from the reference and why they were needed.

## Required interaction invariants

### Helix cards
- Exactly nine cards participate in the helix sequence.
- Card geometry must be visibly curved/deformed along the path where expected. Rigid flat planes simply positioned around a circle are not acceptable.
- Cards follow the scroll-linked timeline without jumps at section entry/exit or after resize.
- Depth ordering is coherent and repeatable.
- Card images use centered cover-like cropping without stretching or distortion.
- Support SVG, JPG/JPEG, PNG, and WebP as required by the reference task.

### Guide lines
- Two separate curved guides follow the intended helix path.
- Their travel direction is opposite to the card sequence.
- Preserve the reference's intended depth relationship: one behind the cards, one in front.
- Do not fake 3D depth with arbitrary HTML borders.

### Editorial sequence and transition
- Preserve the reference's entrance, hold, and exit choreography.
- Use construction copy such as “DESIGN + BUILD” and “BUILT TO LAST”, with typographic adjustments that preserve the underlying animation behavior.
- Keep the dark-to-light transition smooth and connected to the scroll timeline.

### Closing grid
- Reuse the reference's six-card mapping and animation behavior; do not invent the asset selection.
- Large screens (1200px+): 3 columns × 2 rows.
- Tablet (601px–1199px): 2 columns × 3 rows.
- Small mobile (600px and below): 1 column × 6 rows.
- Preserve staggered entry, overlap, sheet-like deformation, and settling behavior as far as the source demonstrates.

## Performance and fallback
- Avoid unnecessary per-frame object allocation.
- Use efficient render-loop and scroll synchronization patterns from the source.
- Handle resize and device-pixel-ratio changes.
- Do not keep expensive rendering active when it offers no visible benefit, unless required for the verified effect.
- Honor reduced-motion preferences with an understandable static or simplified experience.
- Handle WebGL initialization failure without blanking or hiding essential content.
- Release GPU resources on teardown where applicable.

## Browser QA checklist
- [ ] Nine cards appear in the correct order.
- [ ] The card mesh visibly deforms; cards are not just flat planes on a circular path.
- [ ] Scroll travel is smooth and repeatable in both directions.
- [ ] Both guide lines follow the path and have the correct directional/depth relationships.
- [ ] Editorial title sequence timing matches the reference behavior.
- [ ] Dark-to-light scene transition has no visible flash or seam.
- [ ] Closing grid contains the correct six cards and asset mapping.
- [ ] Closing grid works at desktop, tablet, and mobile breakpoints.
- [ ] Cropping does not stretch images or hide critical imagery unexpectedly.
- [ ] Resize does not break camera framing or scroll progress.
- [ ] Reduced-motion behavior remains usable.
- [ ] No console exceptions or failed asset requests occur during the test.
- [ ] Reference `VALIDATION.md` was read and checked item by item.

## Reporting rule
Never say this skill is complete merely because code was written. Report which checks were genuinely run, the results, any untested areas, and any remaining differences from the reference.
