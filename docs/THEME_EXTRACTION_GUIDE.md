# Theme Extraction Guide

## Purpose

This guide explains how to extract the shared theme system for use in the new homepage app (`www.cbcberry.com`).

## Architecture

- **Current app**: `cultivars.cbcberry.com` (product explorer)
- **New app**: `www.cbcberry.com` (homepage + static pages) - separate Next.js app
- **Linking**: Simple URL links between apps

## What to Extract

### Copy These Files/Folders

1. **`shared/theme/` folder** (entire folder)
   - `variables.css` - Global CSS custom properties
   - `base.css` - Base glassmorphism styles
   - `components.css` - Reusable component styles
   - `README.md` - Documentation

2. **Reusable Components** (when extracted in Phase 2)
   - `shared/components/TopNav.tsx` (if extracted)
   - `shared/components/LanguageContext.tsx` (if extracted)

## Setup in New App

### 1. Copy Shared Theme

Copy the `shared/theme/` folder to your new Next.js app:

```bash
# From cultivars app
cp -r shared/theme /path/to/www-app/shared/theme
```

### 2. Import in Your CSS

In your new app's `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import shared reusable theme styles */
@import '../shared/theme/variables.css';
@import '../shared/theme/base.css';
@import '../shared/theme/components.css';
```

### 3. Adjust Paths

- Update background image paths in `base.css` if needed
- Update any absolute paths to match your new app structure

## What NOT to Copy

These are **product-specific** and stay in the cultivars app:

- `app/cultivar-themes.css` - Cultivar-specific color themes
- `.cultivar-card-glass` styles
- `.filter-button-glass` styles
- `.cultivar-theme-*` classes
- `.filter-theme-*` classes
- All cultivar data files
- Product-specific components

## Linking the Apps

### Simple URL Links

Link between apps using standard anchor tags:

```html
<!-- In www.cbcberry.com -->
<a href="https://cultivars.cbcberry.com">Explore Cultivars</a>

<!-- In cultivars.cbcberry.com -->
<a href="https://www.cbcberry.com">Home</a>
```

### Navigation Component

If you extract `TopNav.tsx`, you can add navigation links:

```tsx
<Link href="https://cultivars.cbcberry.com">Products</Link>
<Link href="https://www.cbcberry.com">Home</Link>
```

## Dependencies

### Required

- Next.js 15+ (App Router)
- Tailwind CSS 4
- Space Grotesk font (loaded via Google Fonts)

### Optional

- Same font stack for consistency
- Same background images (if using glassmorphism effects)

## Customization

### For Homepage

You may want to:

1. **Simplify button styles**: Remove cultivar-specific premium-button variants
2. **Customize colors**: Update CSS variables in `variables.css`
3. **Add new components**: Create homepage-specific styles in your app's CSS

### Example: Simple Button

Instead of using cultivar theme variables, create simpler buttons:

```css
/* In your homepage app/globals.css */
.btn-primary {
  background: linear-gradient(135deg, #00ff88 0%, #00d4aa 100%);
  border: 1px solid rgba(0, 255, 136, 0.3);
  /* ... */
}
```

## Testing

After extraction:

1. ✅ Verify all shared styles load correctly
2. ✅ Test glassmorphism effects work
3. ✅ Check responsive design (mobile, tablet, desktop)
4. ✅ Verify font loading
5. ✅ Test navigation links between apps

## Notes

- The shared theme is designed to be minimal and reusable
- Product-specific styles stay in the cultivars app
- You can extend the shared theme in your homepage app as needed
- Keep the same design language for brand consistency

## Extraction Date

Extracted during Phase 1 refactoring (2025) for code reduction and reusability.

