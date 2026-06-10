# Cultivar Explorer Rebuild — Brief & Session Kickoff

**Created:** June 10, 2026 (end of audit session)
**Decision:** Rebuild the explorer UI to match the cbcberry.com homepage design language.
Keep the data/content layer. Do NOT merge the repos — the homepage repo is the design
source of truth; sharing happens through one copied tokens file.

---

## KICKOFF PROMPT FOR THE NEXT SESSION

Copy-paste this to start tomorrow (start the session with BOTH repos:
`cbc-cultivar-explorer` and the homepage repo):

```
We're rebuilding the CBC Cultivar Explorer UI to match the cbcberry.com homepage
design language. The strategy, design tokens, salvage/scrap lists, and build
sequence are already decided and documented — read these two files in the
cbc-cultivar-explorer repo first and follow them:

1. REBUILD_BRIEF.md       — the plan for THIS rebuild (read fully, it's the spec)
2. REFACTOR_AUDIT_2026-06.md — the audit; explains what's broken and why we're
   rebuilding instead of refactoring (skim §0 and §1)

Also already prepared: data/cultivarRegistry.ts — the unified cultivar registry
(single source of truth consolidating 9 scattered legacy lists). The rebuild
consumes this; legacy data files stay untouched until cutover.

From the homepage repo, extract the real design system: Tailwind v4 setup
(globals/theme CSS), the --cbc-* token definitions, nav/header, card grid,
pill button, and eyebrow-label components. The explorer should feel like the
same product as the homepage.

Today's goal — Phase R1 from REBUILD_BRIEF.md:
- New route structure: app/page.tsx (homepage/grid) + app/[cultivarId]/page.tsx,
  generateStaticParams from registry routableIds, content.json loaded
  server-side, metadata per cultivar.
- Proper Tailwind v4 setup copied from the homepage repo (preflight ON from the
  start — nothing legacy depends on the new routes yet).
- cbc-tokens.css ported from the homepage as the canonical token file.
- A bare-but-correctly-styled cultivar page shell (banner, name, description
  from content.json) proving the pipeline end to end on mobile viewport sizes.

Build the new UI alongside the old app on a branch; do not modify the legacy
page.tsx / CultivarDetailCardV2 / globals.css until cutover. Verify with
`npm run build` and screenshots at 390×844 (iPhone), 820×1180 (iPad), and
desktop. Mobile-first: this product's primary audience is iPhone/iPad users.
```

---

## WHY REBUILD (one paragraph)

The audit (REFACTOR_AUDIT_2026-06.md) found the current UI is built on a half-broken
Tailwind pipeline — v4 engine, v3 directives, unloaded v3 config — so no color/spacing/
typography utilities exist in the compiled CSS and the visual design was iterated on top
of that breakage with inline styles. The most expensive refactor phase existed only to
preserve those visuals. Since the goal is now a NEW look (homepage parity), that phase is
unnecessary: start from a correct Tailwind v4 foundation and rebuild the UI. The data and
content layer (months of work) is cleanly separated and ports as-is.

## DESIGN LANGUAGE (extracted from live www.cbcberry.com, June 10 2026)

Tokens (these exact values are also already in this repo at `app/globals.css:57-67`,
currently scoped to the 404 page — promote them):

```css
:root {
  --cbc-blue: #355e82;
  --cbc-blue-light: #c4daf4;
  --cbc-gold: #fdbd51;
  --cbc-green: #6e903c;
  --cbc-red-dark: #920000;
  --cbc-red: #c93834;
  --cbc-red-bright: #ff3b3b;
  --cbc-bg-cream: #f7f6f2;
  --font-display: "Jost", sans-serif;
}
```

Patterns observed on the live homepage:
- Light cream/white surfaces, blue/gold/red accents (NOT the explorer's dark navy +
  neon `#00ff88` glass — that whole system is being retired).
- Jost display font for headings; uppercase eyebrow labels with `tracking-[0.15em]`.
- Pill-shaped CTAs (the explorer's 404 `.not-found-btn` is already this pattern:
  rounded-full, gold primary w/ black text, ghost secondary w/ white border).
- `btn-hover-gold` / `btn-hover-ghost` hover utilities (already in this repo,
  globals.css:74-94).
- Card grids ("Featured Cultivars", 4 program cards), `group-hover:translate-x-1`
  arrow affordances, `focus-visible:ring-[var(--cbc-gold)]` focus rings.
- Headline tone: "Built by People Who Love the Process." / "Better berries for
  growers, worldwide."
- The homepage's Tailwind v4 is properly configured (verified: theme vars, preflight,
  full utility set in compiled CSS) — copy its setup, don't reinvent.

Keep from the old explorer's interaction design (rebuilt, not ported): mobile-first
drill-down (tap a variety → detail), horizontal cultivar rail/strip, trait filters,
swipeable image carousel, tap-for-info trait chips. Drop: the dark glassmorphism,
shimmer sweeps, the drawer+dock chrome (redesign navigation in the new language).

## SALVAGE LIST (port as-is or near)

- ALL of `public/` — content JSONs (10 cultivars × 3 langs), 17 chart CSVs,
  photos/banners, trilingual icon PNGs. Mind the naming irregularity:
  `sweetcarolina` (no hyphen) for icons/images, `sweet-carolina` for content/CSV —
  encoded in the registry.
- `data/cultivarRegistry.ts` — NEW unified registry (this session). Single source of
  truth; replaces 9 scattered lists (provenance documented in its header).
- `data/i18n/*` + `shared/components/LanguageContext.tsx` — works. Fix at port time:
  initialize 'en' and adopt `?lang` in useEffect (hydration hazard, audit #21);
  persist choice to localStorage.
- `components/CultivarChart.tsx` + `SpiderChart.tsx` — self-contained recharts;
  restyle containers only. Consider next/dynamic import.
- `components/ImageCarousel.tsx` — works; restyle.
- `components/ContactForm.tsx` + `app/api/contact/route.ts` — works (rate limiting,
  Resend, tracking); restyle form.
- `data/infoOverlayContent.ts` + `data/i18n/infoOverlay.*.json` — the educational
  content is good; the overlay UI gets redesigned.
- 404 page (`app/not-found.tsx`) — already homepage-parity; keep.

## SCRAP LIST (do not port)

- `app/page.tsx` (both layout trees), `components/CultivarDetailCardV2.tsx`,
  `components/Homepage.tsx`, `components/InfoOverlayMobile.tsx` (UI),
  `components/TopNav.tsx`, `components/CultivarFilterPanel.tsx` (UI — keep the
  filter LOGIC: AND-semantics, dynamic available-options narrowing),
  `components/CultivarSelector.tsx`, `components/CultivarIcon.tsx` (replace with
  registry-driven version).
- `app/globals.css`, `app/cultivar-themes.css`, `shared/theme/*` (the dark theme
  system), `tailwind.config.ts` (dead anyway), the Google Fonts @import and
  @fontsource imports (use next/font: Space Grotesk? → decide; Jost + Inter for sure).
- `next.config.ts` rewrites (replaced by real `/[cultivarId]` routes; keep
  allowedDevOrigins if still wanted).
- Legacy data fields: `stats`, `imageUrl`, `imageGallery` in cultivars.ts (dead,
  audit #29) — not in the registry.
- chartData.ts's silent Alturas fallback + fuzzy matching (audit #28) — new chart
  loader fails loudly (error card already exists in CultivarChart).

## BUILD SEQUENCE

- **R1 (next session):** routes + registry wiring + Tailwind v4 + tokens + bare
  detail shell, server-side content loading, per-cultivar metadata. Old app untouched.
- **R2:** explorer home — cultivar grid/rail in homepage card language, trait
  filters (port logic, new UI), mobile-first nav.
- **R3:** detail page full build — banner, carousel, trait chips + info overlays,
  metrics, recommendations, charts (+ comparison selector driven by
  registry.comparison — ONE implementation; the legacy one was copy-pasted 9×),
  contact form.
- **R4:** language switcher + i18n polish, 404 already done, analytics, redirects
  from old URLs (they're the same paths — /alturas keeps working by construction).
- **Cutover:** delete legacy page/components/CSS, remove rewrites, ship.
  Per-cultivar canonical URLs fix the SEO/canonical issue (audit #32).

## DECISIONS ALREADY MADE (don't relitigate)

1. Rebuild, not refactor (rationale above).
2. Two repos, no merge. Homepage = design source of truth; share via one copied
   tokens file. Revisit only if real component sharing emerges.
3. Registry-first: all per-cultivar config flows from data/cultivarRegistry.ts.
4. Preflight ON in the new app from day one.
5. Mobile-first acceptance: every R-phase is verified at iPhone/iPad sizes before
   desktop.
6. One open visual question carried over: fixing the legacy `100()` gradient bug
   is moot — the rebuilt comparison selector just uses the intended blue.
