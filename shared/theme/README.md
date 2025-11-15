# Shared Theme Package

## Purpose

This folder contains reusable CSS theme files that can be extracted and used in multiple apps:
- **Current app**: `cultivars.cbcberry.com` (product explorer)
- **Future app**: `www.cbcberry.com` (homepage + static pages)

## Files

### `variables.css`
Global CSS custom properties (design tokens) for colors, fonts, and spacing.
- **Extracted from**: `app/globals.css` (`:root` variables)
- **Reusable**: Yes - core design tokens
- **Dependencies**: None

### `base.css`
Base glassmorphism styles and HTML/body setup.
- **Extracted from**: `app/globals.css` (base styles, glassmorphism, scrollbars)
- **Reusable**: Yes - foundation styles
- **Dependencies**: `variables.css`

### `components.css`
Reusable component styles (cards, buttons, typography).
- **Extracted from**: `app/globals.css` (modern-card, premium buttons, typography)
- **Reusable**: Yes - common UI components
- **Dependencies**: `variables.css`, `base.css`

## Usage in New App

To use these styles in `www.cbcberry.com`:

1. Copy the `shared/theme/` folder to your new app
2. Import in your main CSS file (e.g., `app/globals.css`):

```css
@import '../shared/theme/variables.css';
@import '../shared/theme/base.css';
@import '../shared/theme/components.css';
```

3. Adjust paths as needed for your folder structure

## What's NOT Included

These files are **product-specific** and stay in the cultivars app:
- `app/cultivar-themes.css` - Cultivar-specific color themes
- Cultivar card styles (`.cultivar-card-glass`, `.cultivar-theme-*`)
- Filter button styles (`.filter-button-glass`, `.filter-theme-*`)
- Product-specific components

## Extraction Date

Extracted during Phase 1 refactoring (2025) for code reduction and reusability.

