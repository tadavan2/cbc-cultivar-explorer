# CBC Cultivar Explorer — Refactor Audit & Plan (June 2026)

**Scope:** Full read-through of every source file (app/, components/, shared/, data/, types/, configs)
plus a verification production build. Audit only — no code changes in this session.

**Verification methodology:** every "unused" claim below was checked by grepping TSX for the class
name AND by tracing the three dynamic class builders (`getCultivarThemeClass` in `app/page.tsx`,
`getFilterThemeClass` in `components/CultivarFilterPanel.tsx`, `attributeButtonMap` in
`data/infoOverlayContent.ts`) — these are the only places class names are assembled at runtime, and
they assemble from full-string literals, so grep results are reliable. The Tailwind findings were
verified against the actual compiled CSS of a production build (`npm run build` succeeds; output in
`.next/static/css/`).

---

## SECTION 0: THE HEADLINE FINDING (not in the original brief)

**The Tailwind pipeline is half-broken in production, and the app's current appearance depends on
the breakage.**

- `package.json` installs **Tailwind v4.1.7** via `@tailwindcss/postcss`.
- `app/globals.css:52-54` uses **Tailwind v3 directives** (`@tailwind base/components/utilities`).
- `tailwind.config.ts` is a **v3-style config that Tailwind v4 never loads** (v4 requires an
  explicit `@config` directive in CSS; there is none). Everything in it is dead: the `content`
  globs, the `font-inter`/`sans` font families, the `background`/`foreground` colors, the
  `pulse-glow` animation, and the `@tailwindcss/forms` + `@tailwindcss/typography` plugins.

Verified consequences in the compiled production CSS:

| Expected | Actual in `.next/static/css/*` |
|---|---|
| Preflight (CSS reset) | **Absent** — `@tailwind base` emits nothing under v4 |
| `p-4`, `mb-6`, `gap-2`, `w-2`, `h-2` (spacing) | **Absent** (0 matches) |
| `text-sm`, `font-bold` (typography) | **Absent** |
| `text-white`, `text-green-400`, `bg-green-400`, `bg-black/50` (colors) | **Absent** |
| `font-inter` on `<body>` (`app/layout.tsx:107`) | **Absent** — body actually renders in Space Grotesk via `--font-body` from `shared/theme/base.css` |
| `flex`, `grid`, `absolute`, `h-full`, arbitrary values (`z-[10000]`, `h-[5%]`, bare values like `duration-1300`) | Present |

Reason: `@tailwind utilities` still emits *theme-independent* utilities under v4, but the v4 theme
(`@import "tailwindcss/theme.css"` / `@theme` tokens) is never imported, so every utility that needs
a token (colors, spacing scale, font sizes, breakpoints-as-screens) is silently skipped.

**Why this is the most important thing in the audit:** hundreds of utility classes across the JSX
(`text-sm font-bold text-white mb-6 gap-2 p-4 …`) currently do **nothing**, and the visual design was
iterated on top of that — usually compensated by inline `style={}` props. Any naive "fix" (switching
to `@import "tailwindcss"`) would simultaneously activate all dormant utilities **and** preflight,
changing the appearance of nearly every screen. Conversely, leaving it broken means every future
developer writes Tailwind classes that may or may not work depending on whether they need a theme
token. This must be resolved deliberately (see Phase 2) before most other CSS work makes sense.

---

## SECTION 1: CONFIRMED ISSUES

Severity legend: **C** critical, **H** high, **M** medium, **L** low.
Format: location — issue — maintenance risk.

### 1A. Build pipeline / configuration

| # | Sev | Location | Issue | Risk |
|---|-----|----------|-------|------|
| 1 | C | `app/globals.css:52-54`, `tailwind.config.ts`, `package.json` | Tailwind v4 engine fed v3 directives; v3 config silently ignored; no theme ⇒ no color/spacing/typography utilities and no preflight in compiled CSS (verified). | Classes in JSX silently no-op; appearance depends on a broken pipeline; any Tailwind upgrade/cleanup is a visual minefield until resolved. |
| 2 | M | `package.json:13-14` | `@tailwindcss/forms`, `@tailwindcss/typography` installed but unloaded (plugins of the dead config). | Dead deps, misleading. |
| 3 | M | `app/layout.tsx:2-21,107` + `app/globals.css:49-50` + `components/SpiderChart.tsx:163` | Triple font loading: `next/font` Inter (its `--font-inter` var is consumed by nothing — the only consumer was the dead Tailwind config), six `@fontsource/inter` CSS imports, plus render-blocking Google Fonts `@import` for Space Grotesk + Jost inside globals.css. Body actually uses Space Grotesk. Inter is genuinely used only by SpiderChart's inline `fontFamily`. Jost is used only by the 404 page. | Wasted bytes/requests; three competing font systems; nobody can tell which font "wins" where. |
| 4 | L | `next.config.ts:13-20` | Rewrites map `/alturas` → `/?cultivar=alturas` but nothing ever reads the `cultivar` query param — `app/page.tsx:176-186` reads `window.location.pathname` instead. Works, but the destination is misleading. `debug` is not in the rewrite list, so `/debug` 404s (relevant to #14). | Confusing contract between routing and state. |

### 1B. CSS architecture

| # | Sev | Location | Issue | Risk |
|---|-----|----------|-------|------|
| 5 | H | `app/globals.css` vs `shared/theme/*` | The shared/theme migration **copied instead of moved**: `.theme-base-premium-button` + `.premium-button-glass` defined in both `globals.css:1266-1330` and `shared/theme/components.css:170-233`; `.scrollbar-glass` in `globals.css:253-278` **and** `base.css:119-144`; `.scrollbar-hidden` in `globals.css:792-799` **and** `base.css:147-154`; `@keyframes pulse-glow-glass` in `globals.css:281-294` **and** `components.css:253-266`. Comments in globals.css ("now in shared/theme/components.css", lines 296/452/512) claim the move happened. Import order in `layout.tsx:9-12` means the globals.css copies win. | Two sources of truth; editing the shared copy does nothing; divergence is invisible. |
| 6 | H | `app/globals.css:1014-1021` vs `1165-1173` | `.cultivar-tag-mobile` defined **twice with conflicting colors** (white `rgba(255,255,255,0.9)` vs black `rgba(0,0,0,0.8)`); the black one wins by source order, the white one is dead. Also duplicated `@media (max-width:480px)` re-definitions at `764-769` and `1199-1210`. | Anyone editing the first definition sees no effect. |
| 7 | H | 7 locations | Shimmer-sweep `::before` (`left:-100% → 100%`) copy-pasted into: `.cultivar-card-glass` (globals:212), `.filter-button-glass` (globals:325), `.cultivar-card-mobile` (globals:974, dead class), `.theme-base-premium-button` (globals:1279 **and** components.css:182), `.theme-base-card` (cultivar-themes:251), `.cultivar-theme-home` (cultivar-themes:485). | Pattern change requires 5+ edits; already drifted (some use `var(--theme-white-overlay)`, some hard-code the rgba). |
| 8 | H | 4+ locations | Glass gradient `rgba(26,35,50,…) / rgba(36,45,61,…)` hard-coded in `.cultivar-card-glass` (globals:196), `.filter-button-glass` (globals:300), `.cultivar-card-mobile` (globals:957), `.cultivar-drawer-handle` (globals:893), and a lighter variant in `.glass-panel` (base.css:85). Plus dozens of inline-style copies in TSX (`CultivarChart`, `SpiderChart`, `CultivarSelector`, `CultivarDetailCardV2` use `rgba(17,24,39,…)/rgba(31,41,55,…)` ~20×). | Rebranding the glass look = dozens of scattered edits across CSS *and* TSX. |
| 9 | H | `app/globals.css`, `shared/theme/*` | **~39 custom classes with zero TSX usage** (verified incl. dynamic builders): `.stats-card`, `.trait-badge`, `.stat-value-gradient`, `.cultivar-name`, `.section-header`, `.metric-number`, `.metric-label`, `.description-text`, `.w-18`, `.h-18`, `.filter-panel`, `.cultivar-bottom-panel`, `.detail-area`, `.filter-button` (standalone), `.filter-drawer-button`, `.filter-drawer-arrow`, `.filter-drawer-tab`, `.cultivar-drawer-handle`, `.cultivar-drawer-indicator`, `.cultivar-card-mobile` (+ hover/selected/media/touch variants), `.horizontal-scroll`, `.vertical-scroll`, `.scrollbar-glass` (both copies), `.glass-panel`, `.glass-badge`, `.background-overlay`, `.modern-card-static`, `.gradient-text`, `.nav-glass`, `.glow-green`, `.glow-teal`, `.text-primary`, `.text-accent`, `.active-glass`, `.mobile-filter-drawer-button` (+ its hide-block), `.cultivar-icon-container`, `.cultivar-icon-image`, and the `--glint-delay` nth-child block (globals:1178-1182 — sets a var consumed only by an animation those elements don't run). Roughly 400-500 lines of dead CSS. | Dead weight; every reader must mentally carry classes that can never fire. |
| 10 | M | `app/cultivar-themes.css:539-661` | Three **card** themes are never applied: `.cultivar-theme-fall-plant`, `.cultivar-theme-excellent-flavor`, `.cultivar-theme-premium-quality` (the *filter* variants ARE used; `getCultivarThemeClass` can only return organic/cold-tolerant/day-neutral/short-day/glass/home). Includes the `@keyframes shimmer` used only by the dead premium-quality theme, and the `.w-full` override block at 525-537 listing them. | ~150 dead lines; misleads anyone extending themes. |
| 11 | M | `app/cultivar-themes.css:53-225` | The 156 CSS vars: **all are referenced by `var()` somewhere** (the "dead variables" hypothesis is false at face value), but ~12 are referenced *only* by the dead classes in #10 (e.g. `--theme-fall-plant-bg-start/mid/end`, `--theme-fall-plant-border-selected`, `--theme-fall-plant-shadow-selected`, `--theme-excellent-flavor-border-selected/-shadow-selected`, `--theme-premium-quality-shadow-glow{,-hover,-selected}`, `--theme-premium-quality-border-selected`) and become dead once #10 is removed. Structurally, each theme's ~20 vars are just alpha variants of 3-4 base colors — collapsible to ~4 channel tokens per theme via `rgb(var(--c) / α)` (see Section 3). | 700-line file for what is ~25 actual color decisions. |
| 12 | M | `app/globals.css` overall | One 1,663-line file mixing: 404-only styles (56-181), app glass components, typography, drawers, dock, info overlay, keyframes, responsive overrides — in roughly chronological (not logical) order, with section headers that no longer match contents. | High cost of locating anything; encourages append-only edits. |
| 13 | M | Breakpoints | No single source of truth: CSS media queries use **480 / 640 / 740 / 768 / 875 / 1024 / 1200 px** plus orientation+aspect-ratio rules; JS uses **740px + (aspect ratio 2.0-2.4 && width<1200)** in `app/page.tsx:147-158`, **768px** in `CultivarChart.tsx:35`. The JS "mobile" boundary (740) and the CSS mobile-hiding block (768, globals:1653-1662) disagree by 28px. `!important` overrides in `topnav-title-responsive` (globals:654-672), `.mobile-drawer-button:active` (1255-1257), the mobile filter hide-block (1653-1662), and the theme `.w-full` block (525-537). | Layout bugs that only reproduce in 28-px-wide windows of viewport sizes; nobody can safely change a breakpoint. |
| 14 | L | z-index | Values in use: 1,2,3,5,6,10,15,16,20,30,40,50,55,60,100,200,210,225,300,400,999,10000 — no scale, mostly inline. | Stacking bugs whack-a-mole. |

### 1C. Component architecture

| # | Sev | Location | Issue | Risk |
|---|-----|----------|-------|------|
| 15 | C | `components/CultivarDetailCardV2.tsx:1361-2089` | The per-cultivar comparison selector is **copy-pasted 9× essentially verbatim** (~730 lines; Alturas/Adelanto/Alhambra/Artesia/Belvedere/Castaic/Carpinteria/Brisbane/Sweet-Carolina branches differ only in a comment and one label special-case). The data needed to render all of them generically already exists in `cultivarConfig` (lines 85-98). | Any selector change = 9 edits; this is most of why the file is 2,193 lines. |
| 16 | C | same file, all 9 copies + nowhere else | **Bug:** `background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100())'` — `100()` instead of `100%` (lines 1429, 1510, 1591, 1672, 1753, 1834, 1915, 1996, 2077). The browser drops the invalid declaration, so the *selected* comparison button renders with no background instead of the intended blue gradient. Note: fixing it is a (desirable) visible change. | Demonstrates the copy-paste risk; bug shipped 9×. |
| 17 | H | `components/CultivarDetailCardV2.tsx:212-495` | The `cultivar.id === 'debug'` intro layout (~284 lines) is a near-verbatim duplicate of `components/Homepage.tsx` — and it is **dead code**: `handleCultivarChange` can never receive debug (filtered out of the rail), the deep-link effect can't either (`/debug` is not in `next.config.ts` rewrites so it 404s), and `isHomepage` starts `true`. | 284 dead lines inside the biggest file; Homepage.tsx and this copy have already drifted (hard-coded English vs `t()`). |
| 18 | H | `app/page.tsx` | God component, but the real numbers: **12 `useState` calls** (not 31 as folklore says), two complete layout trees (mobile return at 212-445, desktop return at 448-683) duplicating the cultivar rail and the Home button block (372-400 vs 546-574, including identical inline-style red-gradient overrides of `.cultivar-theme-home`). Plus URL sync without `popstate` handling (back/forward broken), and DOM-querying transitions (`document.querySelector('.flex-1.relative...')` at 113, fragile selector coupling). | Every layout change touches two trees; selection/URL behavior is half-implemented. |
| 19 | M | `app/page.tsx:580-592`, `CultivarDetailCardV2:720-732, 1173-1185`, `CultivarChart:184-196` | The same inline wheel-to-horizontal-scroll ref callback is copy-pasted 4×. (React 19 honors the returned cleanup, but the inline ref re-runs every render — works, churns listeners.) | One behavior, four owners. |
| 20 | M | whole app | **Zero** `React.memo`/`useCallback`; `useMemo` only in V2. Every keystroke of state in `page.tsx` re-renders both full trees including the rail and `CultivarDetailCardV2`. With current app size this is tolerable (no user-visible jank reported), so this is a cleanup-enabler, not an emergency. | Perf cliff as cultivars/content grow; harder to extract components later if everything re-renders by default. |
| 21 | M | `shared/components/LanguageContext.tsx:63-70` | `getInitialLanguage()` reads `window.location.search` inside the `useState` initializer of a client component that is **statically prerendered** — server renders `en`, a `?lang=es` client initializes `es` ⇒ hydration mismatch on every translated text node when the param is used. Also: language is not persisted (switching pages/reloading loses it) and `t()` rebuilds closures every render (fine, but pairs with #20). | Console hydration errors + flash of English; subtle and easy to misdiagnose. |
| 22 | L | `components/LanguageContext.tsx` | Pure re-export shim of `shared/components/LanguageContext`. The three exports (`LanguageProvider`, `TranslationProvider`, `useLanguage`/`useTranslation`) are all genuinely used; `LanguageContext` itself is *not* exported (brief's premise wrong). Both providers are required (separate contexts). Shim is fine but undocumented — half the components import from `./LanguageContext`, layout imports from `../shared/components/LanguageContext`. | Mild confusion only. |
| 23 | L | `components/TopNav.tsx:39-77` | `LanguageSwitcher` is a component defined inside the render body — remounts on every TopNav render (new component type each time). | Focus/state loss risk on the `<select>`; bad pattern to copy. |
| 24 | L | `components/CultivarDetailCardV2.tsx:103-112` | `isAlturasPage`…`isSweetCarolinaPage` boolean ladder exists only to drive the 9 duplicated branches (#15). `selectedCultivar` state (line 81) is force-synced to `cultivar.id` by an effect (153-157) — it can never durably differ; it's a constant wearing a state costume. | Dissolves for free when #15 is fixed. |
| 25 | L | `components/InfoOverlayMobile.tsx:29-37, 131-172` | Hard-codes `top: 48px` (landscape header height) for all mobile orientations though portrait header is 32px/64px elsewhere; styled-jsx block with `:global` + `!important` to style injected HTML. Also `duration-1300` is a made-up Tailwind class (it *does* generate under v4 bare-value rules — one of the few that works by luck). | Off-by-header-height overlay; `!important` styling of `dangerouslySetInnerHTML` content. |
| 26 | L | `Homepage.tsx:158` | `style={{ margin: 'px' }}` — invalid value, dropped by the browser. | Harmless today; trap when someone "fixes" it to a real value and the layout shifts. |

### 1D. Data layer

| # | Sev | Location | Issue | Risk |
|---|-----|----------|-------|------|
| 27 | H | `data/chartData.ts:333-342, 345-371, 466-486` + `CultivarDetailCardV2.tsx:85-98, 115-128` | The cultivar taxonomy (which ids are DN / SD / summer-plant) is hard-coded **3× inside chartData.ts** (`getAvailableCultivarsFromCSV`, `getCultivarInfo`, `getSmartComparisonCultivars`) and **2× more in V2** (`cultivarConfig`, `mobileFixedPair`). Adding one cultivar requires touching ≥5 lists in 2 files, plus `cultivars.ts`, plus `CultivarIcon.tsx`'s `iconMap`/`customIconCultivars` (2 more lists), plus `next.config.ts` rewrites. **Nine** registration points total. | The #1 cost of "add a cultivar", which is this app's main recurring task. |
| 28 | M | `data/chartData.ts:191-214` | `getChartData` fallback chain ends in *silently returning Alturas data for any unknown cultivar* (line 211-214), after a fuzzy partial-string match (201-209). If a CSV ever 404s, users see Alturas numbers labeled as another variety. | Silent wrong agronomic data — worst failure mode for this product. |
| 29 | M | `data/cultivars.ts` / `types/cultivar.ts` | `stats` (yieldKgPerHa/brix/shelfLifeDays/fruitWeight), `imageUrl`, `imageGallery` are populated for all 10 cultivars and **never read anywhere**. The duplication the brief worried about (yield ranges in chartData vs cultivars) exists in the sense that `stats.yieldKgPerHa` overlaps conceptually with `cultivarYieldMax`/CSV data but is dead. | Editors maintain numbers nobody sees; risk of "fixing" data in the dead field. |
| 30 | M | data loading | All content/CSV fetching is client-side from `public/` (`cultivarContent.ts`, `chartData.ts`, `SpiderChart.tsx` re-fetches+re-parses `spider_traits.csv` on every cultivar/comparison/**language** change). The hand-rolled `contentCache` in `cultivarContent.ts:73-108` is fine as code but exists because nothing is server-rendered. No `Cache-Control` reliance issues found, but charts/spider/CSV parse logic runs per mount. | Slower first paint; SEO sees a shell; every data shape change is a runtime-only failure. |
| 31 | L | `types/background.ts` | Entire file (BackgroundImage, AVAILABLE_BACKGROUNDS, DEFAULT_BACKGROUND) unreferenced. `public/data/csv/debug.csv`, `data/sample-chart-data.csv` unreferenced. `MasterDescript.docx`/`MasterDescriptUpdate.docx` are stray binaries in repo root. `data/README_*.md` reference a `data/csvParser.ts` that doesn't exist. | Dead files mislead. |
| 32 | L | `app/layout.tsx:104` | `<link rel="canonical" href="https://cultivars.cbcberry.com" />` hard-coded for every path (deep-linked cultivar pages claim the root as canonical); manual `<meta name="viewport">` instead of Next's `viewport` export. | SEO papercut. |

---

## SECTION 2: PRIORITIZED REFACTOR PLAN

Each phase is independently shippable; the app builds and looks identical after each (exceptions
explicitly flagged). Order matters: the Tailwind decision (Phase 2) gates the CSS consolidation
(Phase 3), and V2 decomposition (Phase 4) is independent of all CSS phases and can run in parallel.

### Phase 0 — Safety net (½ session, zero risk)
**Goal:** make "visual behavior preserved" verifiable instead of vibes.
1. Create a screenshot matrix checklist: {desktop ≥1200, tablet 800×1100 portrait, mobile 390×844
   portrait, mobile landscape 844×390} × {homepage, alturas, adelanto, sweet-carolina} × {filter
   panel open/closed, cultivar drawer open/closed, info overlay open, contact form expanded} + the
   404 page. Capture once, store under `docs/visual-baseline/` (or a shared drive).
2. Record the interaction checklist: filter AND-logic, Clear All, drawer interplay (filter drawer
   pushed up by cultivar drawer), deep link `/alturas`, `?lang=es`, chart metric switching,
   comparison select/None/Reset, contact form submit (staging key), language switch on every screen.
3. Commit this audit doc. `npm run build` green is the per-phase gate.

**Test after:** n/a (no code change).

### Phase 1 — Dead code purge (1 session, low risk)
**Goal:** delete everything proven unreferenced. No behavior change by construction.
1. `app/globals.css`: delete the ~39 dead classes from issue #9 (each one re-verified by grep at
   deletion time), the duplicate `.cultivar-tag-mobile` white-text definition (1014-1021) and the
   duplicate 480px block (1199-1210 — keep one), the `--glint-delay` nth-child block, and the
   duplicated copies of `.theme-base-premium-button`/`.premium-button-glass`/`.scrollbar-glass`/
   `.scrollbar-hidden`/`@keyframes pulse-glow-glass` (keep the `shared/theme` copies; they load
   first and are var-fallback-hardened — verify computed equality first, the globals copies
   currently win the cascade).
2. `app/cultivar-themes.css`: delete `.cultivar-theme-fall-plant`/`-excellent-flavor`/
   `-premium-quality` card themes, `@keyframes shimmer`, the `.w-full` override block, and the ~12
   transitively-dead vars (issue #11). Keep all `filter-theme-*` classes.
3. `components/CultivarDetailCardV2.tsx`: delete the dead debug branch (212-495).
4. Delete files: `types/background.ts`, `public/data/csv/debug.csv`, `data/sample-chart-data.csv`;
   move the two `.docx` files out of the repo (or to `/docs`); fix `data/README_*` references.
5. `package.json`: remove `@tailwindcss/forms`, `@tailwindcss/typography`.
6. Fix `Homepage.tsx:158` `margin:'px'` → remove the property (current computed value is 0).

**Risk:** very low (everything deleted is provably unreachable). The cascade swap in step 1 is the
only subtle part — diff the two copies before deleting.
**Test after:** build green; screenshot matrix unchanged; grep each deleted class returns 0.

### Phase 2 — Tailwind pipeline decision (1-2 sessions, HIGHEST risk — do alone, smallest possible diffs)
**Goal:** make the compiled CSS match the source of truth, without changing pixels.
1. **Inventory dormant utilities:** script-extract every Tailwind class used in TSX, classify
   against the compiled CSS (present/absent). The absent list (~the entire color/spacing/text scale)
   is the blast radius.
2. **Adopt v4 properly but without preflight**, replacing `@tailwind` directives in globals.css:
   ```css
   @layer theme, base, components, utilities;
   @import "tailwindcss/theme.css" layer(theme);
   @import "tailwindcss/utilities.css" layer(utilities);
   /* deliberately NOT importing tailwindcss/preflight — the app was built without a reset */
   ```
   This activates the dormant utilities. **This WILL change visuals** where a dormant class fights
   an inline style or a custom class. Walk the screenshot matrix; for each delta either (a) the
   utility now does what the author originally intended — keep it, or (b) it fights the inline
   style that was added to compensate — delete the dead class from JSX. Budget a full session for
   this walk; do it component by component (TopNav → FilterPanel → page rails → V2 → overlays).
3. Delete `tailwind.config.ts` (dead) and move the only thing worth keeping — breakpoint tokens —
   into `@theme` in CSS once Phase 3 standardizes them.
4. Remove the no-op `font-inter` class from `layout.tsx`; consolidate fonts: one mechanism
   (recommend `next/font` for Space Grotesk + Inter + Jost; delete the Google Fonts `@import` and
   the six `@fontsource` imports). Verify SpiderChart's hard-coded `'Inter'` still resolves.
5. Rename custom `.w-25`/`.h-25` (globals:517-531) to non-Tailwind-colliding names
   (`.cultivar-card-w`/`-h` or similar) — under real v4, `w-25` is a valid spacing utility
   (100px ≠ the custom 150px) and the collision outcome depends on layer order.

**Risk:** high if rushed; bounded by the inventory + matrix. Never combine with other phases.
**Test after:** full screenshot matrix + interaction checklist on all four form factors; diff
compiled CSS size; grep for remaining `@tailwind`.

### Phase 3 — CSS consolidation (1-2 sessions, medium risk)
**Goal:** the architecture in Section 3. Mostly mechanical moves once Phases 1-2 landed.
1. Split `globals.css` into the file layout of Section 3 (move, don't rewrite).
2. Extract the shimmer `::before` into one `.shimmer-sweep` primitive; make
   `.cultivar-card-glass`, `.filter-button-glass`, `.cultivar-theme-home` compose it (the two
   `theme-base-*` classes already centralize it for themed cards/buttons — converge on that).
3. Tokenize the glass gradients: `--glass-grad-dark`, `--glass-grad-panel`, `--glass-grad-card` in
   `tokens.css`; replace the 4 CSS occurrences. (Inline-style copies in TSX migrate during Phase 4.)
4. Collapse `cultivar-themes.css` per-theme var sets to channel tokens:
   `--theme-c1: 255 235 59; --theme-c2: 255 213 79; --theme-c3: 255 193 7;` per theme class, with
   shared rules using `rgb(var(--theme-c1) / 0.9)` etc. 156 vars → ~30; ~890 lines → ~250.
   Computed colors must be byte-identical — verify with getComputedStyle spot checks.
5. Standardize breakpoints as `@theme` tokens (keep current pixel values: 480/740/768/875/1024/1200
   — do NOT "rationalize" them this phase; that's a behavior change).
6. Remove `!important`s where the cascade now allows (the mobile filter hide-block and title sizing
   usually stop needing it once duplicates are gone).

**Risk:** medium; pure-CSS refactors are verifiable via computed-style equality.
**Test after:** screenshot matrix; specifically re-test the 5 shimmer hosts (hover each), theme
colors on all 10 cultivar cards + all filter buttons in all 3 states (rest/hover/selected).

### Phase 4 — CultivarDetailCardV2 decomposition (1-2 sessions, medium risk)
**Goal:** 2,193 → ~500 lines; one selector implementation; fix the 9× bug.
1. Extract `ComparisonSelector` (props: `title`, `options`, `value`, `onChange`, `labelFor?`) —
   replaces all 9 branches *and* the `isXxxPage` ladder; delete `selectedCultivar` pseudo-state
   (issue #24). **Fix the `100()` bug in the one remaining copy** — flag to the team: selected
   comparison buttons become blue (the original intent); get a thumbs-up on that one visual change.
2. Extract `InfoButtonsRow` (the premium-button strip — currently duplicated mobile/desktop),
   `MetricsGrid`, `RecommendationCards`, `MarketingBanner` (banner + holographic/edge effects,
   duplicated mobile/desktop), `DesktopInfoOverlay`.
3. Extract `useWheelScroll()` hook (ref + listener); adopt in the 4 call sites (incl. page.tsx and
   CultivarChart).
4. Move `cultivarConfig`/`mobileFixedPair` objects out of the component into `data/` (precursor to
   Phase 6 registry).

**Risk:** medium — JSX moves can subtly change DOM structure; keep extraction 1:1 (same elements,
same classes/styles), no styling changes in this phase.
**Test after:** every cultivar page desktop + mobile portrait + landscape; comparison selection on
all 9 cultivars; info overlays (desktop + mobile); charts with/without comparison.

### Phase 5 — page.tsx decomposition + responsive logic (1 session, medium risk)
See Section 4 for the full design. Tasks:
1. Extract `useBreakpoint()`, `useCultivarSelection()`, `useFilters()` hooks.
2. Extract `CultivarRail`, `HomeButton`, `MobileDrawerToggle`, `FilterDock` components; collapse
   the duplicated mobile/desktop rails and Home buttons.
3. Add `popstate` handling so back/forward works with the existing replaceState scheme (or defer to
   the routing plan already drafted in `CODEBASE_REVIEW_PLAN.md` Phase 3.5 — if that lands soon,
   skip replaceState patching and let real routes solve it).
4. Fix the LanguageContext hydration hazard (#21): initialize `'en'`, adopt `?lang` in a
   `useEffect`, optionally persist to localStorage.
5. Targeted memoization only where the hooks make it natural: `React.memo(CultivarRail card)`,
   `useCallback` on handlers passed into rails. Do not blanket-memo.

**Risk:** medium; state moves are regression-prone around the drawer/transition timing.
**Test after:** full interaction checklist on all form factors; transition timing (500ms fade) feel;
deep links; back button.

### Phase 6 — Data layer unification (1 session, low-medium risk)
1. Single registry: extend `data/cultivars.ts` entries with `group`, `comparisonOptions`,
   `defaultComparison`, `mobileFixedComparison`, `yieldAxisMax`, `firmnessRange`, `hasCustomIcon`;
   add minimal "reference-only" entries (monterey, cabrillo, san-andreas, fronteras, portola,
   ruby-june) flagged `referenceOnly: true`. Derive the 3 chartData lists, the 2 V2 configs, the
   CultivarIcon maps, and (build-time) the rewrite list from it. "Add a cultivar" becomes one
   object + assets.
2. Delete dead fields `stats`/`imageUrl`/`imageGallery` (or mark deprecated if external docs
   reference them).
3. Make `getChartData` fail loudly: drop the fuzzy partial match and Alturas final fallback; return
   null → CultivarChart already renders an error card.
4. Optional (in-stack, aligns with the existing CODEBASE_REVIEW_PLAN routing proposal): move
   `content.json` loading into a server component / route segment when dynamic routes land.

**Risk:** low-medium; pure data plumbing, chart outputs must be identical.
**Test after:** every cultivar's charts/selectors/icons; one deliberately-missing CSV shows the
error card instead of Alturas data.

---

## SECTION 3: CSS CONSOLIDATION STRATEGY

### What Tailwind can and can't absorb

**Replaceable with Tailwind utilities (after Phase 2 makes them real):**
- All spacing/typography/color one-offs currently done with inline `style={}` AND the dormant
  utility classes already in the JSX (they were written as Tailwind originally — Phase 2 step 2
  decides each one).
- The scroll-behavior helpers (`.scroll-container` → `overscroll-contain scroll-smooth`,
  `.scrollbar-hidden` has no core equivalent — keep custom).
- Simple media-query font-size tweaks (`.cultivar-tag` responsive blocks) → `text-[length]
  max-md:…` utilities or stay in the component CSS — low value either way.

**Genuinely must stay custom CSS:**
- Glassmorphism stacks (multi-stop gradients + backdrop-filter + 3-4 layered box-shadows + inset
  highlights) — expressible as arbitrary values but unreadable; keep as `.glass-*` classes.
- Shimmer/holographic/edge-pulse/airport-light/pulse-glow **keyframes** and the `::before` sweep
  pattern (pseudo-element choreography).
- The cultivar/filter **theme system** (paired class + state-variant color math) — this is a real
  design system; keep as CSS with channel tokens.
- Scrollbar styling (`::-webkit-scrollbar`).
- The drawers/dock (transform-transition state machines tied to JS class toggles).
- 404 marketing styles (scoped, shared with the www site).

### Proposed final structure

```
shared/theme/                  ← cross-app layer (www.cbcberry.com parity), single source of truth
  tokens.css                   ← :root design tokens: palette, fonts, glass gradients,
                                  z-index scale (--z-nav:50, --z-drawer:55, --z-overlay:100,
                                  --z-toast:999…), breakpoint @theme tokens
  base.css                     ← html/body, .dark-theme, .background-image, scrollbars (as today)
  glass.css                    ← .glass-panel, .shimmer-sweep, .modern-card, .nav-glass*,
                                  pulse-glow keyframes        (*only what www actually uses)
  buttons.css                  ← .theme-base-premium-button + .premium-button-*-glass variants

app/
  globals.css (~80 lines)      ← @layer order, tailwind theme+utilities imports, next/font wiring,
                                  @imports of the files below
  styles/
    cultivar-themes.css (~250) ← channel-token themes: .cultivar-theme-*, .filter-theme-*,
                                  .theme-base-card, .theme-base-filter
    explorer.css (~300)        ← app-specific: cultivar rail cards, drawers, dock tab,
                                  mobile header, drawer buttons, topnav title clamp
    info-overlay.css (~120)    ← .info-overlay/.info-card + mobile overlay content styles
                                  (replaces the styled-jsx !important block)
    not-found.css (~120)       ← everything currently at globals.css:56-181
```

Theme tokenization sketch (replaces ~20 vars/theme with 4):

```css
.cultivar-theme-day-neutral, .filter-theme-day-neutral { --c1: 255 235 59; --c2: 255 213 79; --c3: 255 193 7; }
.theme-base-card   { background: linear-gradient(135deg, rgb(var(--c1)/.9), rgb(var(--c2)/.8) 50%, rgb(var(--c3)/.9)); }
.theme-base-filter { background: linear-gradient(135deg, rgb(var(--c1)/.8), rgb(var(--c2)/.7) 50%, rgb(var(--c3)/.8)); }
/* hover/selected variants change only the alpha + border, expressed once */
```

Net effect: globals.css 1,663 → ~80; cultivar-themes.css 889 → ~250; zero duplicated patterns; the
shimmer exists in exactly one place; the 404 styles stop hitching a ride on the app bundle's main
sheet conceptually (still one compiled sheet, but maintainable).

---

## SECTION 4: COMPONENT DECOMPOSITION PLAN (page.tsx)

### Actual state inventory (12 useState, corrected from the brief's "31")

| State | Today | Proposed owner |
|---|---|---|
| `selectedCultivar`, `displayedCultivar`, `isTransitioning`, `isHomepage` | page.tsx | `useCultivarSelection()` hook (also owns URL sync + popstate + the scroll-to-top side effect) |
| `filters` | page.tsx | `useFilters()` hook (returns `filters`, `setFilters`, `filteredCultivars`, `clearAll`) |
| `isLandscape`, `isMobile`, `isDesktopOrWideTablet` | page.tsx (resize+orientation listeners) | `useBreakpoint()` hook — one matchMedia-based implementation, also adopted by `CultivarChart` (drops its private 768px listener) and V2's `screenWidth`. JS thresholds stay exactly as today (740 / aspect-ratio rule); aligning them with CSS is a *flagged follow-up*, not part of the refactor, because every threshold change is a behavior change on real devices |
| `isFilterDrawerOpen`, `isCultivarDrawerOpen` | page.tsx | `MobileLayout` (only mobile uses them) |
| `isFilterPanelDocked`, `topNavHeight` | page.tsx | `DesktopLayout` (only desktop uses them) |

### Before → after component tree

```
BEFORE                                   AFTER
Home (page.tsx, 685 lines)               Home (page.tsx, ~80 lines)
├── [mobile tree, 233 lines]             ├── hooks: useBreakpoint, useCultivarSelection, useFilters
│   ├── inline drawer button (90 ln)     ├── <MobileLayout …>            (mobile only)
│   ├── TopNav                           │   ├── <TopNav/>
│   ├── Homepage | CultivarDetailCardV2  │   ├── <Homepage/> | <CultivarDetailCardV2/>
│   ├── inline filter drawer             │   ├── <FilterDrawer> → <CultivarFilterPanel/>
│   ├── inline cultivar drawer           │   ├── <CultivarDrawer> → <CultivarRail/>
│   │   ├── inline Home button (28 ln)   │   │   └── <HomeButton/>
│   │   └── inline card map              │   └── <MobileDrawerToggle/>
│   └── backdrop                         └── <DesktopLayout …>           (desktop only)
└── [desktop tree, 236 lines]                ├── <TopNav onHeightChange/>
    ├── TopNav                               ├── <Homepage/> | <CultivarDetailCardV2/>
    ├── Homepage | CultivarDetailCardV2      ├── <CultivarRail/>  ← SAME component as mobile,
    ├── inline rail + scroll buttons         │   └── <HomeButton/>    isMobile prop
    │   └── inline Home button (dup)         └── <FilterDock> → <CultivarFilterPanel/>
    └── inline filter dock
```

Key consolidation: `CultivarRail` (card strip + selection dot + theme classes + wheel scroll +
optional scroll arrows) and `HomeButton` are each written **once** instead of twice; the
`getCultivarThemeClass` helper moves next to the theme data. The two layout components keep their
genuinely different chrome (drawers vs dock) and nothing else.

V2's parallel plan is in Phase 4 above (ComparisonSelector ×9 → 1 is the headline).

---

## SECTION 5: QUICK WINS (<30 min each, no architecture)

1. Delete the duplicate white-text `.cultivar-tag-mobile` (globals.css:1014-1021) and one of the
   two identical 480px blocks (1199-1210).
2. Delete dead-by-grep classes in batches (issue #9 list) — each batch is a 10-minute
   delete + grep + build.
3. Delete dead card themes + `@keyframes shimmer` + the `.w-full` block in cultivar-themes.css.
4. Delete V2's dead debug branch (lines 212-495).
5. Fix `margin: 'px'` (Homepage.tsx:158).
6. Fix `100()` → `100%` in V2 ×9 (note: makes selected comparison buttons blue — intended design;
   confirm with team since it's user-visible).
7. Remove `@tailwindcss/forms` + `@tailwindcss/typography` from package.json.
8. Delete `types/background.ts`, `public/data/csv/debug.csv`, `data/sample-chart-data.csv`; move
   the `.docx` files out of the repo root.
9. Remove the `font-inter` class from layout.tsx body (provably a no-op today).
10. `app/layout.tsx`: replace manual `<meta name="viewport">` with Next's `viewport` export; drop
    or parameterize the hard-coded canonical link.
11. `not-found.tsx`: external `cbcberry.com` links use `next/link` — switch to `<a>`.
12. Fix `data/README_*` references to the nonexistent `data/csvParser.ts`.
13. Drop the fuzzy partial-match block in `getChartData` (chartData.ts:201-209) — keep the explicit
    fallback for now (full fix is Phase 6).
14. `TopNav`: hoist `LanguageSwitcher` out of the render body.
15. Remove `console.error`-only ESLint `<img>` warnings by switching the three `<img>`s
    (page.tsx ×2, CultivarIcon ×1) to `next/image` — or explicitly suppress with a comment;
    either is 15 minutes.

**Explicitly NOT quick wins** (look tempting, are not): touching `@tailwind` directives or
`tailwind.config.ts` (Phase 2 only, with the screenshot matrix), "fixing" breakpoint numbers,
de-duplicating the shared/theme copies (cascade-order sensitive — Phase 1 step 1 with care),
memoization sweeps.

---

## Corrections to the audit brief (things the code disproved)

- page.tsx has **12** useState calls, not 31+ (app-wide total across all components ≈ 37).
- All **156** theme CSS variables are referenced somewhere; only ~12 are dead, and only
  transitively via 3 dead card-theme classes.
- `LanguageContext` exports two providers + two hooks, all used; the `components/` copy is a
  re-export shim, not a duplicate implementation. No "two aliases" problem.
- No V1 of `CultivarDetailCardV2` exists anywhere in the tree; the only "remnant" is the name.
- The biggest problem was not in the brief at all: the half-broken Tailwind v4 pipeline (Section 0).
