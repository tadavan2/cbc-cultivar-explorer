# CSS Theme System Documentation

This document describes the CSS architecture, theme system, and styling approach for the CBC Cultivar Explorer application.

## ⚠️ REFACTORING CONTEXT FOR AI

**Original Goal (2025 Refactoring)**: Simplify and REDUCE code complexity, not add abstraction layers. The codebase needed cleanup for future maintenance (info/graphic updates), not major development.

**What Was Done**:
- **Phase 1 (2025)**: 
  - Extracted 156 CSS variables to centralize colors in `cultivar-themes.css`
  - Removed duplicate class definitions from `globals.css` (-92 lines)
  - Evaluated CSS variables and base classes (kept for maintainability)
  - **Result**: `globals.css` reduced from 1,627 → 1,535 lines (-92 lines)
- **Phase 2 (2025)**:
  - Simplified `getFilterThemeClass` helper function (-4 lines)
  - Audited component code for consolidation opportunities
  - **Result**: Component code simplified, helper functions optimized
- **Previous Work**:
  - Removed ~236 lines of dead button classes from `globals.css`
  - Created base classes (`.theme-base-card`, `.theme-base-filter`, `.theme-base-premium-button`)
  - Extracted shared theme to `shared/theme/` for reuse

**Current Status**:
- `globals.css`: 1,535 lines (down from 2,550 originally)
- `cultivar-themes.css`: ~890 lines (includes 156 CSS variables)
- Theme system is well-documented and ready for extraction to homepage app

**What Still Needs Work**:
- Further CSS consolidation if opportunities arise
- Monitor if CSS variables reduce maintenance burden in practice

## Overview

The application uses a hybrid styling approach combining:
- **Tailwind CSS 4**: Utility-first framework for layout and spacing
- **Custom CSS**: Glassmorphism theme system and cultivar-specific styling
- **CSS Variables**: For colors, fonts, and theming

## File Structure

### `app/globals.css` (~2,200 lines)
Main stylesheet containing:
- CSS variable definitions (`:root`)
- Tailwind imports
- Base HTML/body styles
- Glassmorphism base styles
- Component styles (buttons, cards, badges)
- Animation keyframes
- Responsive media queries
- Mobile-specific styles

### `app/cultivar-themes.css` (~800 lines)
Cultivar-specific theme definitions:
- Cultivar card themes (by market group and traits)
- Filter button themes (matching cultivar themes)
- Theme-specific hover and selected states

## CSS Variables

### Global Design Tokens (`globals.css`)

Defined in `:root` in `globals.css`:

```css
:root {
  --background: #0a0f1c;        /* Dark blue background */
  --foreground: #ffffff;        /* White text */
  --card-bg: #1a2332;          /* Card background */
  --border: #2a3441;           /* Border color */
  --accent-green: #00ff88;     /* Primary accent (green) */
  --accent-teal: #00d4aa;      /* Secondary accent (teal) */
  --text-muted: #8b9dc3;       /* Muted text */
  --font-header: 'Futura', ...; /* Header font */
  --font-body: 'Space Grotesk', ...; /* Body font */
}
```

### Theme Color Variables (`cultivar-themes.css`)

**Phase 1 Refactoring (2025)**: All theme colors have been extracted to CSS custom properties for centralized management and future theme updates.

Defined in `:root` in `cultivar-themes.css` (156 variables total):

#### Variable Naming Convention

Each theme has variables for different states and use cases:

- **Base colors**: `--theme-{theme-name}-bg-start`, `--theme-{theme-name}-bg-mid`, `--theme-{theme-name}-bg-end`
- **Filter variants**: `--theme-{theme-name}-bg-start-filter` (slightly different opacity for filter buttons)
- **Hover states**: `--theme-{theme-name}-bg-start-hover`, etc.
- **Selected states**: `--theme-{theme-name}-bg-start-selected`, etc.
- **Borders**: `--theme-{theme-name}-border`, `--theme-{theme-name}-border-hover`, `--theme-{theme-name}-border-selected`
- **Shadows**: `--theme-{theme-name}-shadow`, `--theme-{theme-name}-shadow-selected`

#### Available Themes

1. **Day-Neutral** (`--theme-day-neutral-*`): Yellow gradient theme
2. **Short-Day** (`--theme-short-day-*`): Orange gradient theme
3. **Organic** (`--theme-organic-*`): Green gradient theme
4. **Cold-Tolerant** (`--theme-cold-tolerant-*`): Blue gradient theme
5. **Excellent Flavor** (`--theme-excellent-flavor-*`): Red gradient theme
6. **Premium Quality** (`--theme-premium-quality-*`): Gold gradient theme
7. **Fall Plant** (`--theme-fall-plant-*`): Burnt orange gradient theme

#### Common Shared Variables

- `--theme-white-overlay`: `rgba(255, 255, 255, 0.1)`
- `--theme-white-overlay-strong`: `rgba(255, 255, 255, 0.2)`
- `--theme-black-overlay`: `rgba(0, 0, 0, 0.1)`
- `--theme-black-overlay-strong`: `rgba(0, 0, 0, 0.2)`
- `--theme-text-dark`: `rgba(0, 0, 0, 0.8)`
- `--theme-text-dark-strongest`: `rgba(0, 0, 0, 1)`

#### Usage

All theme classes now use these variables instead of hardcoded rgba values:

```css
.cultivar-theme-day-neutral {
  background: linear-gradient(135deg, 
    var(--theme-day-neutral-bg-start) 0%, 
    var(--theme-day-neutral-bg-mid) 50%, 
    var(--theme-day-neutral-bg-end) 100%);
  border: 1px solid var(--theme-day-neutral-border);
  /* ... */
}
```

**Benefits**:
- Single source of truth for all theme colors
- Easy to update colors across all button systems
- Consistent theming between cultivar cards, filter buttons, and info overlay buttons
- Future-proof for theme switching or rebranding

## Theme System Architecture

### Theme Class Functions

Two helper functions determine theme classes dynamically:

#### `getCultivarThemeClass(cultivarId: string)`
Located in `app/page.tsx` (lines 13-42). Maps cultivar IDs to theme classes:

- **Day-Neutral Market Group** (`cultivar-theme-day-neutral`): Yellow gradient
  - Cultivars: `alturas`, `alhambra`, `brisbane`, `carpinteria`
  
- **Short-Day Market Group** (`cultivar-theme-short-day`): Orange gradient
  - Cultivars: `adelanto`, `belvedere`, `castaic`
  
- **Organic Variety** (`cultivar-theme-organic`): Green gradient
  - Cultivar: `artesia`
  
- **Cold Tolerant** (`cultivar-theme-cold-tolerant`): Blue gradient
  - Cultivar: `sweet-carolina`
  
- **Home/Debug** (`cultivar-theme-home`): Red gradient
  - Cultivar: `debug`
  
- **Default** (`cultivar-card-glass`): Standard glassmorphism

#### `getFilterThemeClass(value: string, category: string)`
Located in `components/CultivarFilterPanel.tsx` (lines 11-36). Maps filter values to theme classes:

- **Flower Types**: `DN` → `filter-theme-day-neutral`, `SD` → `filter-theme-short-day`
- **Market Types**: `fall plant` → `filter-theme-fall-plant`, etc.
- **Traits**: `organic` → `filter-theme-organic`, `cold tolerant` → `filter-theme-cold-tolerant`, etc.
- **Default**: `filter-button-glass`

### Theme Classes

Each theme class in `cultivar-themes.css` includes:
1. Base styles (background gradient, border, border-radius) - **now using CSS variables**
2. `::before` pseudo-element for shimmer effect
3. `:hover` state (transform, border-color, box-shadow) - **now using CSS variables**
4. `.selected-glass` modifier (for selected state) - **now using CSS variables**

**Phase 1 Update**: All color values now reference CSS custom properties instead of hardcoded rgba values.

Example structure:
```css
.cultivar-theme-day-neutral {
  background: linear-gradient(135deg, 
    var(--theme-day-neutral-bg-start) 0%, 
    var(--theme-day-neutral-bg-mid) 50%, 
    var(--theme-day-neutral-bg-end) 100%);
  backdrop-filter: blur(2px) saturate(180%);
  border: 1px solid var(--theme-white-overlay);
  box-shadow: 
    0 8px 32px var(--theme-black-overlay-strong),
    inset 0 1px 0 var(--theme-white-overlay),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  /* ... */
}

.cultivar-theme-day-neutral::before {
  /* Shimmer effect */
}

.cultivar-theme-day-neutral:hover {
  border-color: var(--theme-day-neutral-border);
  box-shadow: 
    0 20px 60px var(--theme-black-overlay-dark),
    0 8px 32px var(--theme-day-neutral-shadow),
    /* ... */
}

.cultivar-theme-day-neutral.selected-glass {
  border-color: var(--theme-day-neutral-border-selected);
  box-shadow: 
    0 16px 48px var(--theme-day-neutral-shadow-selected),
    /* ... */
}
```

## Glassmorphism Design System

### Base Glass Styles

- **`.glass-panel`**: Base glassmorphism container
  - Semi-transparent background with gradient
  - Backdrop blur and saturation
  - Subtle border and shadow
  
- **`.glass-text`**: Text with gradient fill
  - White to light blue gradient
  - Background clip for text effect
  
- **`.glass-badge`**: Badge with glass effect
  - Green/teal tinted background
  - Blur and border effects

### Component-Specific Glass Styles

- **`.cultivar-card-glass`**: Cultivar card base style
- **`.modern-card`**: Modern card with hover effects
- **`.modern-card-static`**: Static card without hover
- **`.premium-button`**: Premium button with gradient
- **`.filter-button-glass`**: Filter button glass style

## Animations

### Active Animations

1. **`pulse-glow-glass`**: Pulsing glow effect (2s infinite)
   - Used on selected cultivar indicators
   
2. **`pulse-glow`**: Alternative pulse animation
   - Used on various UI elements
   
3. **`light-sweep`**: Background light sweep (25s linear infinite)
   - Applied to `.dark-theme::after`
   
4. **`sensor-glint`**: Sensor glint effect (12s ease-in-out infinite)
   - Applied to glass panels and cards
   
5. **`holographic-sweep`**: Holographic sweep (12s ease-in-out infinite)
   - Used on marketing banners
   
6. **`edge-pulse`**: Edge pulsing effect (5s ease-in-out infinite)
   - Used on marketing banners
   
7. **`airport-lights-down`**: Airport landing strip effect (2s ease-in-out infinite)
   - Used on mobile drawer button arrows (down state)
   
8. **`airport-lights-up`**: Airport landing strip effect (2s ease-in-out infinite)
   - Used on mobile drawer button arrows (up state)

### Removed Animations

The following animations were removed during refactoring (unused):
- `starlight-twinkle`
- `digital-pulse`
- `scanner-glow`
- `float-particle`
- `radar-sweep`
- `data-stream`
- `neural-pulse`
- `neural-connect`
- `hex-grid-flow`
- `glitch-sweep`
- `energy-pulse-ring`
- `chromatic-shift`
- `grid-pulse`
- `particle-float`
- `scan-line`
- `gentle-bounce`
- `scanner-pulse`
- `card-shimmer`
- `airport-lights-left`
- `airport-lights-right`

## Tailwind vs Custom CSS Boundaries

### Use Tailwind For:
- Layout (flex, grid, positioning)
- Spacing (padding, margin)
- Typography sizing (text-sm, text-lg)
- Responsive utilities (md:, lg:)
- Display utilities (hidden, block, flex)
- Basic colors (when not using theme system)

### Use Custom CSS For:
- Glassmorphism effects
- Theme-specific gradients and colors
- Complex animations
- Cultivar-specific styling
- Filter button themes
- Component-specific hover/active states
- Backdrop filters and blur effects

## Responsive Breakpoints

Defined in media queries:

- **Desktop**: `≥740px` (and not mobile landscape)
- **Tablet**: `740px - 1023px`
- **Mobile**: `<740px` or landscape mode with specific ratio

Key breakpoints:
- `@media (max-width: 1024px)`: Tablet adjustments
- `@media (max-width: 768px)`: Mobile adjustments
- `@media (max-width: 480px)`: Small mobile adjustments

## Scrollbar Styling

### Global Scrollbar Hiding
```css
html {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
html::-webkit-scrollbar {
  display: none; /* WebKit */
}
```

### Glass Scrollbar (`.scrollbar-glass`)
Custom styled scrollbar for specific containers:
- Green/teal gradient thumb
- Glassmorphism track
- Hover effects

### Hidden Scrollbar (`.scrollbar-hidden`)
Utility class to hide scrollbars while maintaining scroll functionality.

## Adding New Themes

### Adding a New Cultivar Theme

**Phase 1 Update**: New themes should use CSS variables for all color values.

1. **Add CSS variables to `:root` in `cultivar-themes.css`**:
```css
:root {
  /* New theme color variables */
  --theme-new-theme-bg-start: rgba(255, 100, 50, 0.9);
  --theme-new-theme-bg-mid: rgba(255, 80, 40, 0.8);
  --theme-new-theme-bg-end: rgba(255, 60, 30, 0.9);
  --theme-new-theme-bg-start-filter: rgba(255, 100, 50, 0.8);
  --theme-new-theme-bg-mid-filter: rgba(255, 80, 40, 0.7);
  --theme-new-theme-bg-end-filter: rgba(255, 60, 30, 0.8);
  /* ... hover, selected, border, shadow variables ... */
}
```

2. **Add theme class to `cultivar-themes.css`** (using variables):
```css
.cultivar-theme-new-theme {
  background: linear-gradient(135deg, 
    var(--theme-new-theme-bg-start) 0%, 
    var(--theme-new-theme-bg-mid) 50%, 
    var(--theme-new-theme-bg-end) 100%);
  border: 1px solid var(--theme-new-theme-border);
  /* ... base styles using variables ... */
}

.cultivar-theme-new-theme::before { /* shimmer */ }
.cultivar-theme-new-theme:hover { 
  border-color: var(--theme-new-theme-border-hover);
  /* ... using variables ... */
}
.cultivar-theme-new-theme.selected-glass { 
  border-color: var(--theme-new-theme-border-selected);
  /* ... using variables ... */
}
```

3. **Add matching filter theme** (using variables):
```css
.filter-theme-new-theme {
  background: linear-gradient(135deg, 
    var(--theme-new-theme-bg-start-filter) 0%, 
    var(--theme-new-theme-bg-mid-filter) 50%, 
    var(--theme-new-theme-bg-end-filter) 100%);
  /* ... using variables ... */
}
```

4. **Add matching premium button** (if needed for info overlays):
```css
.premium-button-new-theme-glass {
  background: linear-gradient(135deg, 
    var(--theme-new-theme-bg-start) 0%, 
    var(--theme-new-theme-bg-mid) 50%, 
    var(--theme-new-theme-bg-end) 100%);
  /* ... using variables ... */
}
```

5. **Update `getCultivarThemeClass()` in `app/page.tsx`**:
```typescript
if (cultivarId === 'new-cultivar') {
  return 'cultivar-theme-new-theme';
}
```

6. **Update `getFilterThemeClass()` in `components/CultivarFilterPanel.tsx`** (if needed)

## CSS Conflicts and Resolution

### Tailwind Conflicts
Some Tailwind utilities may conflict with custom CSS. The custom CSS uses:
- Specific selectors to override Tailwind
- `!important` sparingly (only when necessary)
- Higher specificity through class combinations

### Theme Overlap and Consolidation

**Phase 1 Refactoring**: All three button systems now share the same CSS variable definitions:

1. **Cultivar Card Buttons** (`.cultivar-theme-*` in `cultivar-themes.css`)
2. **Filter Buttons** (`.filter-theme-*` in `cultivar-themes.css`)
3. **Info Overlay Buttons** (`.premium-button-*-glass` in `globals.css`)

All three systems now reference the same CSS custom properties defined in `cultivar-themes.css`, ensuring:
- **Consistency**: Same colors across all button types
- **Maintainability**: Update colors in one place (CSS variables)
- **Future-proofing**: Easy to rebrand or add new themes

**Color Mapping**:
- `premium-button-glass` → Day-Neutral theme variables
- `premium-button-pink-glass` → Excellent Flavor theme variables
- `premium-button-blue-glass` → Cold-Tolerant theme variables
- `premium-button-gold-glass` → Premium Quality theme variables
- `premium-button-green-glass` → Organic theme variables
- `premium-button-orange-glass` → Short-Day theme variables

## Performance Considerations

- **Backdrop filters**: Can be performance-intensive. Used selectively on key UI elements.
- **Animations**: All animations use `transform` and `opacity` for GPU acceleration.
- **CSS Variables**: 
  - All theme colors now use CSS custom properties (Phase 1 refactoring)
  - Enables runtime theme switching (future enhancement)
  - No performance impact - variables are resolved at render time
  - Centralized color management reduces CSS bundle size

## Maintenance Notes

- **Theme consistency**: When adding new cultivars, ensure theme class matches market group/trait
- **Color updates**: To change theme colors, update CSS variables in `cultivar-themes.css` - changes will apply to all button systems automatically
- **Animation cleanup**: Remove unused animations to reduce CSS size
- **Responsive testing**: Test all themes on mobile, tablet, and desktop
- **Browser compatibility**: Test backdrop-filter support (requires modern browsers)

## Phase 1 Refactoring Summary (2025)

**Goal**: Centralize theme color definitions using CSS custom properties for easier maintenance and future theme updates.

**Changes Made**:
1. Created 156 CSS custom properties in `cultivar-themes.css` for all theme colors
2. Updated all `.cultivar-theme-*` classes to use CSS variables
3. Updated all `.filter-theme-*` classes to use CSS variables
4. Updated all `.premium-button-*-glass` classes in `globals.css` to use CSS variables

**Benefits**:
- Single source of truth for all theme colors
- Easy to update colors across all button systems
- Consistent theming between cultivar cards, filter buttons, and info overlay buttons
- Future-proof for theme switching or rebranding
- No visual changes - all colors remain identical

