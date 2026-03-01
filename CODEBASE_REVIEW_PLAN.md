# CBC Cultivar Explorer — Codebase Review & Improvement Plan

**Date:** March 2026
**Scope:** Full codebase review (post-Phase 1-3 fixes)
**Goal:** Identify and plan fixes for duplicates, logic issues, vibe-coding patterns, and structural problems that hinder maintainability, future cultivar additions, and theme changes.

---

## Codebase Stats

| Area | Files | Total Lines |
|------|-------|-------------|
| App (page, layout, CSS) | 5 | ~3,300 |
| Components | 12 | ~4,960 |
| Shared theme | 3 | ~456 |
| Data | 4 | ~870 |
| **Total** | **24** | **~9,600** |

Largest files (the ones needing the most attention):
- `CultivarDetailCardV2.tsx` — **2,193 lines** (monster component)
- `globals.css` — **1,535 lines**
- `cultivar-themes.css` — **889 lines**
- `page.tsx` — **667 lines**

---

## Phase 4: Extract Shared Hooks (Duplicate Logic)

### 4A. `useHorizontalScroll()` hook
**Problem:** Identical mouse-wheel → horizontal scroll logic is copy-pasted in 3+ places:
- `app/page.tsx` (~line 565)
- `CultivarDetailCardV2.tsx` (~line 720)
- `CultivarChart.tsx` (~line 184)

**Plan:**
1. Create `shared/hooks/useHorizontalScroll.ts`
2. Accept a `RefObject<HTMLElement>` param
3. Attach `wheel` listener with `{ passive: false }`, convert `deltaY` → `scrollLeft`
4. Proper cleanup in return function
5. Replace all 3 inline implementations

---

### 4B. `useResponsive()` hook
**Problem:** Screen size detection + orientation listeners are reimplemented independently in 3+ components:
- `app/page.tsx` (lines 142-168) — 12 state variables for layout
- `CultivarDetailCardV2.tsx` (lines 194-207)
- `CultivarChart.tsx` (lines 33-39)

Each adds its own `resize` + `orientationchange` listeners, causing redundant re-renders.

**Plan:**
1. Create `shared/hooks/useResponsive.ts`
2. Use `window.matchMedia()` instead of manual ratio calculations
3. Export `{ isMobile, isLandscape, isDesktopOrWideTablet }` from single hook
4. Define breakpoint constants: `MOBILE_MAX = 739`, `TABLET_MAX = 1024`, `DESKTOP_MIN = 1200`
5. Replace all 3 component implementations
6. Eliminates the fragile `ratio > 2.0 && ratio < 2.4` landscape detection hack

---

### 4C. `useDrawer()` hook
**Problem:** Drawer open/close state, backdrop click, and coordination logic is scattered across `page.tsx` with 2 independent boolean states and no coordination.

**Plan:**
1. Create `shared/hooks/useDrawer.ts`
2. Manage `isFilterDrawerOpen` + `isCultivarDrawerOpen` as coordinated state
3. Single `handleBackdropClick` that closes both
4. Export toggle functions and state

---

## Phase 5: Extract Duplicate Components

### 5A. `HomeButton` component
**Problem:** The HOME button markup is duplicated ~200 lines apart in `page.tsx` (mobile version ~lines 354-381, desktop version ~lines 528-556). Nearly identical JSX with the same SVG, gradients, animations, and click handlers.

**Plan:**
1. Create `components/HomeButton.tsx`
2. Accept props: `onClick`, `isCultivarDrawerOpen`, `isLandscape`, `variant: 'mobile' | 'desktop'`
3. Replace both instances in `page.tsx`

---

### 5B. Shared glass container style
**Problem:** The glass morphism pattern appears 15+ times as inline style objects across components:
```
background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)'
backdropFilter: 'blur(10px) saturate(180%)'
border: '1px solid rgba(255, 255, 255, 0.1)'
borderRadius: '20px'
```
Found in: CultivarChart, SpiderChart, CultivarSelector, ContactForm, InfoOverlayMobile, CultivarDetailCardV2, page.tsx

**Plan:**
1. Add `.glass-container` class to `globals.css` (or extend existing `.glass-panel` in `base.css`)
2. Add variants: `.glass-container-sm` (12px radius), `.glass-container-lg` (24px radius)
3. Replace all inline style objects with className references
4. Keep any truly unique overrides as inline additions

---

### 5C. Shared button styling
**Problem:** Button style objects are defined independently in 4+ components:
- `CultivarChart.tsx` (lines 110-150)
- `CultivarSelector.tsx` (lines 37-63)
- `TopNav.tsx` (lines 47-65)
- `ContactForm.tsx` (lines ~94+)

Each defines its own padding, fontSize, background, border patterns.

**Plan:**
1. Add `.glass-button`, `.glass-button-active`, `.glass-button-hover` classes to `globals.css`
2. Replace inline style objects in all 4 components
3. Use CSS `:hover` states instead of `onMouseEnter`/`onMouseLeave` with `Object.assign`

---

## Phase 6: CSS Cleanup & Variable System

### 6A. Consolidate duplicate CSS rules
**Problem:** Several rules are defined in multiple files:

| Rule | Location 1 | Location 2 |
|------|-----------|-----------|
| `.theme-base-premium-button` | `components.css` (170-207) | `globals.css` (1137-1178) — 100% identical |
| `.premium-button-glass` | `components.css` (213-233) | `globals.css` (1181-1202) |
| `.scrollbar-glass::-webkit-scrollbar-*` | `base.css` (119-144) | `globals.css` (125-150) |
| `.cultivar-tag-mobile` | Defined **4 times** in globals.css (lines 636, 886, 1037, 1076) with conflicting values |

**Plan:**
1. Remove duplicates from `globals.css` — keep canonical version in shared theme files
2. Resolve `.cultivar-tag-mobile` to a single definition with correct color value
3. Remove dead code: `.main-layout`, `.content-spacing`, `.section-spacing` (marked "removed" but comments remain)

---

### 6B. Create CSS custom property system for hard-coded values
**Problem:** 50+ hard-coded color values, 30+ hard-coded dimensions scattered through `globals.css` and `base.css`. The theme system in `cultivar-themes.css` properly uses variables, but the base glass/layout styles do not.

**Plan — Add to `shared/theme/variables.css`:**

```css
/* Colors */
--accent-green: #00ff88;
--accent-teal: #00d4aa;
--accent-green-alt: #4ade80;
--dark-bg-primary: rgba(26, 35, 50, 1);
--dark-bg-secondary: rgba(36, 45, 61, 1);
--dark-bg-tertiary: rgba(17, 24, 39, 1);

/* Overlays (black) */
--overlay-light: rgba(0, 0, 0, 0.1);
--overlay-medium: rgba(0, 0, 0, 0.3);
--overlay-heavy: rgba(0, 0, 0, 0.6);

/* Overlays (white) */
--glass-tint-subtle: rgba(255, 255, 255, 0.05);
--glass-tint-light: rgba(255, 255, 255, 0.1);
--glass-tint-medium: rgba(255, 255, 255, 0.2);

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;

/* Blur */
--blur-sm: blur(2px);
--blur-md: blur(10px);
--blur-lg: blur(16px);
--blur-xl: blur(20px);

/* Z-Index Scale */
--z-base: 1;
--z-dropdown: 20;
--z-sticky: 30;
--z-drawer: 40;
--z-filter-drawer: 55;
--z-modal: 60;
--z-overlay: 100;

/* Shadows */
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
--shadow-glow-green: 0 4px 16px rgba(0, 255, 136, 0.1);
```

Then find-and-replace all hard-coded instances in `globals.css` and `base.css`.

---

### 6C. Fix filter drawer color mismatch
**Problem:** Filter drawer uses `rgba(255, 255, 255, 0.8)` (white/light) while the entire app is dark-themed. Looks inconsistent.

**Plan:**
1. Change `.filter-drawer` background to `var(--dark-bg-primary)` with glass effect
2. Add proper border using `var(--glass-tint-light)`

---

### 6D. Consolidate media queries
**Problem:** 8 separate media query blocks with overlapping breakpoints, missing 600px coverage, and conflicting orientation rules.

**Plan:**
1. Define canonical breakpoints as comments at top of `globals.css`:
   - `480px` (small mobile)
   - `600px` (large mobile / small tablet) — **NEW, currently missing**
   - `740px` (tablet)
   - `1024px` (small desktop)
   - `1200px` (desktop)
2. Consolidate portrait/landscape rules into single orientation-aware blocks
3. Fix cultivar drawer: landscape height should be **smaller** than portrait (currently both 70px)
4. Resolve `.cultivar-tag-mobile` conflicting colors across query blocks

---

## Phase 7: Break Up the Monster Component

### 7A. Decompose `CultivarDetailCardV2.tsx` (2,193 lines)
**Problem:** This is the biggest file by far and does too much: content loading, chart rendering, image carousel coordination, info overlay management, comparison selection, responsive layout, and all the JSX for the full detail view.

**Plan — Extract into focused sub-components:**

| New Component | Lines Saved | Responsibility |
|--------------|-------------|---------------|
| `CultivarContentSection.tsx` | ~300 | Text content area (description, growing info, etc.) |
| `CultivarComparisonBar.tsx` | ~150 | Comparison cultivar selector logic + UI |
| `CultivarStatsPanel.tsx` | ~100 | Stats cards section |
| `useContentLoader.ts` hook | ~50 | Content fetching + caching + error handling |

**Also:**
1. Move hardcoded comparison configuration (lines 85-128) to `data/cultivars.ts` as a `comparisons` field on each cultivar
2. Add content caching to prevent re-fetching on language switch (currently no cache)

---

### 7B. Reduce `page.tsx` state sprawl
**Problem:** `page.tsx` manages 12 state variables mixing layout/UI/data concerns. Causes full-app re-renders on orientation change.

**Plan:**
1. Move device state to `useResponsive()` hook (Phase 4B)
2. Move drawer state to `useDrawer()` hook (Phase 4C)
3. Move filter state to `useFilters()` hook
4. `page.tsx` should only own: `selectedCultivar`, `displayedCultivar`, `isHomepage`, `isTransitioning`

---

## Phase 8: Data Architecture for Future Cultivars

### 8A. Data-driven theme assignment
**Problem:** `getCultivarThemeClass()` in `page.tsx` uses manual if/else checking `cultivar.attributes.includes('organic')` etc. Adding a new cultivar with a new theme means editing this function.

**Plan:**
1. Add `theme: string` field to cultivar type definition
2. Add theme value to each cultivar in `data/cultivars.ts` (e.g., `theme: 'day-neutral'`)
3. Simplify `getCultivarThemeClass()` to a simple lookup: `cultivar-theme-${cultivar.theme}`
4. Adding a new cultivar with an existing theme = zero code changes to theme logic

---

### 8B. Centralize comparison configuration
**Problem:** Comparison options are hardcoded in `CultivarDetailCardV2.tsx` (lines 85-128) with separate desktop and mobile configs.

**Plan:**
1. Add `comparisons` field to cultivar type: `{ options: string[], mobileDefault: string }`
2. Define per-cultivar in `data/cultivars.ts`
3. CultivarDetailCardV2 reads from data instead of hardcoded switch

---

### 8C. New cultivar checklist (document)
After these changes, adding a new cultivar would require:
1. Add entry to `data/cultivars.ts` (name, id, theme, attributes, comparisons)
2. Add `public/data/cultivars/{id}/content.json`
3. Add `public/data/csv/{id}.csv` (chart data)
4. Update `public/data/csv/spider_traits.csv`
5. Add icons to `public/images/icons/`
6. Add carousel images to `public/images/backgrounds/`
7. Update i18n files if needed

**Reduced from 10 touch points to 7** — and 0 code file changes needed (just data/assets).

---

## Phase 9: Remove DOM Anti-patterns

### 9A. Replace `document.querySelector` with refs
**Problem:** `page.tsx` uses string-based DOM queries (`document.querySelector('.cultivar-scroll-container')`) which break if CSS class names change.

**Plan:**
1. Use `useRef` for scroll container
2. Pass ref down to scrollable elements
3. Remove all `document.querySelector` and `document.querySelectorAll` calls

---

### 9B. Replace direct style mutations with state/classes
**Problem:** Multiple components use `e.target.style.borderColor = '...'` and `Object.assign(e.target.style, ...)` for hover/focus effects. This bypasses React's rendering model.

**Locations:**
- `ContactForm.tsx` — focus/blur border color
- `CultivarSelector.tsx` — mouse enter/leave styling
- `TopNav.tsx` — language selector styling

**Plan:**
1. Replace with CSS `:hover` and `:focus` pseudo-classes
2. Or use React state + className toggling where CSS alone isn't enough

---

### 9C. Fix event listener in ref callback
**Problem:** `CultivarChart.tsx` (lines 184-195) adds a `wheel` event listener inside a ref callback. If the component re-renders while attached to DOM, this can create duplicate listeners.

**Plan:**
1. Move to `useEffect` with ref dependency
2. Or use the new `useHorizontalScroll()` hook from Phase 4A

---

## Phase 10: Minor Quality Issues

### 10A. Replace `alert()` with in-app error UI
- `ContactForm.tsx` uses `alert()` for submission errors — replace with inline error message component

### 10B. Add content caching
- `getCultivarContent()` fetches JSON every time — add a `Map<string, CultivarContent>` cache
- CSV chart data similarly re-fetches on mount — cache per cultivar ID

### 10C. Accessibility quick wins
- Add `role="button"` + `tabIndex={0}` + `onKeyDown` to clickable `<div>` cultivar cards
- Add `aria-label` to drawer close buttons and backdrop
- Add `aria-pressed` to filter toggle buttons
- Add `role="dialog"` + `aria-modal="true"` to drawer containers

### 10D. Remove dead CSS
- `.main-layout` — commented as "removed - not used"
- `.content-spacing` / `.section-spacing` — same
- `.cultivar-icon-container` / `.cultivar-icon-image` — defined in themes but no HTML usage found
- `.glass-text` in `base.css` — no clear usage

---

## Execution Priority & Dependency Order

| Priority | Phase | Impact | Risk | Est. Scope |
|----------|-------|--------|------|------------|
| 1 | **6A** CSS duplicate cleanup | High | Low | Small — delete dupes |
| 2 | **6B** CSS variables | High | Low | Medium — find-replace |
| 3 | **4B** `useResponsive()` hook | High | Medium | Medium — touches 3 files |
| 4 | **4A** `useHorizontalScroll()` hook | Medium | Low | Small — extract + replace |
| 5 | **5A** `HomeButton` component | Medium | Low | Small — extract |
| 6 | **5B** Glass container CSS class | High | Low | Medium — replace inline styles |
| 7 | **8A** Data-driven themes | High | Low | Small — add field + simplify function |
| 8 | **8B** Centralize comparisons | Medium | Low | Small — move config to data |
| 9 | **7A** Break up CultivarDetailCardV2 | High | Medium | Large — 2,193 line file |
| 10 | **7B** Reduce page.tsx state | Medium | Medium | Medium — depends on hooks |
| 11 | **9A-C** DOM anti-patterns | Medium | Low | Small — targeted fixes |
| 12 | **6C-D** Drawer fix + media queries | Medium | Medium | Medium |
| 13 | **5C** Button styling | Low | Low | Small |
| 14 | **4C** `useDrawer()` hook | Low | Low | Small |
| 15 | **10A-D** Minor quality | Low | Low | Small |

**Suggested grouping into work batches:**
- **Batch A (low risk, high impact):** 6A + 6B + 10D — CSS cleanup, variables, dead code
- **Batch B (extractions):** 4A + 4B + 5A + 5B — Hooks and components
- **Batch C (data architecture):** 8A + 8B — Future cultivar friendliness
- **Batch D (big refactor):** 7A + 7B — Monster component breakup
- **Batch E (polish):** 9A-C + 5C + 6C-D + 4C + 10A-C — DOM fixes, a11y, drawer

---

## Summary

The codebase has the classic vibe-coding fingerprint: **working product, but copy-paste duplication and inline everything**. The main structural problems are:

1. **CultivarDetailCardV2.tsx at 2,193 lines** — needs decomposition
2. **50+ hard-coded color values** — need CSS variables
3. **3+ copies of screen detection logic** — needs a shared hook
4. **15+ copies of glass morphism inline styles** — needs CSS classes
5. **Cultivar theme/comparison config scattered across code** — needs data-driven approach

None of these are bugs. The app works. But each one makes it harder to add the next cultivar, change the theme, or fix a mobile layout issue without breaking something else. The plan above addresses all of them in dependency order with minimal risk.
