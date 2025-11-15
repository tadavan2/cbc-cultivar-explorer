# Code Structure Guide - CBC Cultivar Explorer

This document provides a comprehensive file-by-file guide for AI-assisted development. Each section explains the purpose, key functions, dependencies, and relationships of important files.

## Table of Contents
1. [Application Entry Points](#application-entry-points)
2. [Core Components](#core-components)
3. [Data Layer](#data-layer)
4. [Styling System](#styling-system)
5. [Type Definitions](#type-definitions)
6. [API Routes](#api-routes)
7. [Public Assets](#public-assets)

---

## Application Entry Points

### `app/page.tsx`
**Purpose**: Main application page and router

**Key Responsibilities:**
- Manages selected cultivar state
- Handles responsive layout detection (mobile/desktop/landscape)
- Renders either Homepage or CultivarDetailCardV2 based on selection
- Manages filter state and filtered cultivar list
- Provides cultivar card grid with theme-based styling

**Key Functions:**
- `getCultivarThemeClass(cultivarId)`: Returns CSS theme class for cultivar cards
- Filter logic: AND-based filtering for attributes

**Dependencies:**
- `data/cultivars.ts`: Cultivar data source
- `components/CultivarDetailCardV2.tsx`: Detail view
- `components/Homepage.tsx`: Welcome page
- `components/CultivarFilterPanel.tsx`: Filter controls
- `components/CultivarIcon.tsx`: Icon rendering
- `components/LanguageContext.tsx`: i18n support

**State Management:**
- `selectedCultivar`: Currently selected cultivar
- `filters`: Active filter state
- `isMobile`, `isLandscape`: Responsive flags
- `isFilterPanelDocked`: Desktop filter panel state

---

### `app/layout.tsx`
**Purpose**: Root layout with providers and global configuration

**Key Features:**
- Wraps app with LanguageProvider and TranslationProvider
- Imports global CSS files
- Sets up metadata and favicon
- Includes Vercel Analytics

**Dependencies:**
- `components/LanguageContext.tsx`: Language providers
- `app/globals.css`: Global styles
- `app/cultivar-themes.css`: Theme styles

---

## Core Components

### `components/CultivarDetailCardV2.tsx`
**Purpose**: Primary detail view component for cultivar information

**Key Features:**
- Responsive layouts (mobile portrait, mobile landscape, desktop)
- Image carousels with auto-rotation
- Performance comparison charts
- Spider/radar charts for trait comparison
- Info overlay system
- Contact form
- Multi-language support

**Key State:**
- `cultivarContent`: Loaded from JSON files
- `comparisonCultivar`: Selected comparison cultivar
- `infoOverlay`: Active info overlay content
- `cultivarConfig`: Memoized cultivar-specific configuration

**Key Patterns:**
- Uses `useMemo` for `cultivarConfig` to centralize cultivar-specific logic
- Consolidated `useEffect` hooks for comparison and selection logic
- Content loaded asynchronously from JSON files

**Dependencies:**
- `data/cultivarContent.ts`: Content loading
- `data/chartData.ts`: Chart data
- `data/infoOverlayContent.ts`: Info overlay system
- `components/CultivarChart.tsx`: Chart visualization
- `components/SpiderChart.tsx`: Radar charts
- `components/ImageCarousel.tsx`: Image display
- `components/ContactForm.tsx`: Inquiry form

---

### `components/CultivarIcon.tsx`
**Purpose**: Reusable icon rendering component

**Key Features:**
- Renders custom PNG icons for 10 cultivars
- Falls back to emoji + name for other cultivars
- Supports multi-language icon variants
- Handles responsive sizing

**Icon Mapping:**
- Custom icons: adelanto, debug, alhambra, alturas, artesia, belvedere, brisbane, castaic, carpinteria, sweet-carolina
- Icon paths: `public/images/icons/{cultivar-id}_card_icon.png`

**Usage:**
Used in `app/page.tsx` for cultivar card displays. Eliminates 256+ lines of duplicated code.

---

### `components/Homepage.tsx`
**Purpose**: Welcome/intro page

**Key Features:**
- Responsive layouts for different screen sizes
- Welcome message with cultivar explorer introduction
- Multi-language support

**Dependencies:**
- `components/LanguageContext.tsx`: i18n

---

### `components/CultivarFilterPanel.tsx`
**Purpose**: Filter controls for cultivar selection

**Key Features:**
- Filter by flower type, market type, and attributes
- Auto-generates filter options from cultivar data
- Theme-based button styling
- Responsive: sidebar (desktop) or drawer (mobile)

**Key Functions:**
- `getFilterThemeClass(value, category)`: Returns CSS theme class for filter buttons

**Dependencies:**
- `data/cultivars.ts`: Cultivar data source
- `app/cultivar-themes.css`: Theme classes

---

### `components/CultivarChart.tsx`
**Purpose**: Performance comparison chart visualization

**Key Features:**
- Displays yield, firmness, size, or appearance metrics
- Supports primary and comparison cultivars
- Cumulative line charts for yield
- Trend lines for other metrics

**Dependencies:**
- `data/chartData.ts`: Chart data source
- Recharts library for visualization

---

### `components/SpiderChart.tsx`
**Purpose**: Trait radar/spider chart visualization

**Key Features:**
- 8-trait radar chart (1-5 scale)
- Traits: Yield, Size, Appearance, Flavor, Shelf Life, Disease Resistance, Firmness, Earliness
- Loads data from CSV file

**Dependencies:**
- `public/data/csv/spider_traits.csv`: Trait data
- Recharts library

---

### `components/ImageCarousel.tsx`
**Purpose**: Auto-rotating image carousel

**Key Features:**
- Fade transitions between images
- Auto-rotation with configurable interval
- Manual navigation support

---

### `components/ContactForm.tsx`
**Purpose**: Inquiry form for cultivar information

**Key Features:**
- Expandable form
- Collects user information and message
- Submits to API endpoint

**Dependencies:**
- `app/api/contact/route.ts`: API endpoint

---

### `components/LanguageContext.tsx`
**Purpose**: Internationalization (i18n) support

**Key Features:**
- Manages current language state (en, es, pt)
- Provides translation function `t(key)`
- Provides info overlay content function `getInfoOverlay(key)`
- Loads translations from JSON files

**Dependencies:**
- `data/i18n/*.json`: Translation files

---

## Data Layer

### `data/cultivars.ts`
**Purpose**: Core cultivar data definitions

**Data Structure:**
- Array of Cultivar objects
- Each cultivar has: id, name, emoji, flowerType, marketType, attributes, stats
- Currently 11 cultivars: debug, alturas, adelanto, alhambra, artesia, belvedere, brisbane, castaic, carpinteria, sweet-carolina

**Usage:**
- Imported by `app/page.tsx` for cultivar list
- Used by filter panel to generate filter options

**Related Files:**
- `types/cultivar.ts`: TypeScript interface
- `public/data/cultivars/{id}/content.json`: Rich content (separate)

---

### `data/cultivarContent.ts`
**Purpose**: Content loading system for rich cultivar content

**Key Functions:**
- `getCultivarContent(cultivarId, lang)`: Loads content from JSON files
- Implements caching to avoid repeated fetches

**Content Structure:**
- Files: `public/data/cultivars/{id}/content.json` (English)
- Files: `public/data/cultivars/{id}/content.{lang}.json` (Spanish/Portuguese)
- Contains: description, images, performance metrics, recommendations

**Usage:**
- Called from `CultivarDetailCardV2` to load rich content

---

### `data/chartData.ts`
**Purpose**: Chart data and comparison logic

**Key Functions:**
- `getChartData(cultivarId, metricId, comparisonCultivarId)`: Main chart data function
- `loadCultivarDataFromCSV(cultivarId)`: Loads chart data from CSV
- `getChartDataFromCSV(cultivarId, metric, comparisonCultivarId)`: Wrapper with CSV fallback
- `getDefaultComparisonCultivar(cultivarId)`: Returns default comparison cultivar

**Data Sources:**
1. Hardcoded data: `cultivarChartData` object (fallback)
2. CSV files: `public/data/csv/{cultivarId}.csv` (preferred)

**Chart Metrics:**
- Yield: Cumulative line + monthly bars (Y-axis max: 3000)
- Firmness: Trend line + monthly bars (Y-axis max: 10)
- Size: Trend line + monthly bars (Y-axis max: 25)
- Appearance: Trend line + monthly bars (Y-axis max: 10)

**Cultivar-Specific Configurations:**
- `cultivarYieldMax`: Override Y-axis max for yield charts
- `cultivarFirmnessRange`: Custom firmness ranges

---

### `data/infoOverlayContent.ts`
**Purpose**: Info overlay content system

**Key Functions:**
- `generateButtonConfigs(cultivar)`: Auto-generates info buttons based on cultivar attributes
- `getInfoOverlayData(cultivar, lang)`: Returns overlay content for a key

**Content Sources:**
- `baseInfoOverlayData`: General educational content
- `cultivarSpecificInfoData`: Cultivar-specific content
- `data/i18n/infoOverlay.{lang}.json`: Language-specific content

**Usage:**
- Used by `CultivarDetailCardV2` to generate info buttons and display overlays

---

### `data/csvParser.ts`
**Purpose**: CSV parsing utilities

**Key Functions:**
- `parseChartDataFromCSV(csvContent)`: Parses CSV content into chart data
- `loadChartDataFromCSVFile(filePath)`: Loads and parses CSV file

**CSV Format:**
```
cultivar,month,yield,firmness,size,appearance
alturas,Sep,1406,8.2,18.5,9.1
```

---

## Styling System

### `app/globals.css`
**Purpose**: Global styles and theme system

**Structure:**
1. Font imports (Space Grotesk)
2. Tailwind CSS directives
3. CSS variables (color palette, design tokens)
4. Base HTML/body styles
5. Glassmorphism base styles
6. Custom component styles
7. Animation keyframes
8. Scrollbar styling
9. Responsive media queries

**Key Design Systems:**
- Glassmorphism: Translucent panels with backdrop-filter blur
- Premium buttons: Gradient backgrounds with shadows
- Modern cards: Rounded corners, subtle shadows, hover effects

**Animations:**
- `pulse-glow-glass`: Selected cultivar indicator
- `light-sweep`, `sensor-glint`: Background effects
- `holographic-sweep`, `edge-pulse`: Banner effects
- `airport-lights-down`, `airport-lights-up`: Mobile drawer arrows

**Related Files:**
- `app/cultivar-themes.css`: Cultivar-specific themes
- `tailwind.config.ts`: Tailwind configuration
- `docs/CSS_THEME_SYSTEM.md`: Comprehensive CSS documentation

---

### `app/cultivar-themes.css`
**Purpose**: Cultivar-specific color themes

**Theme Categories:**
- Day-Neutral (Yellow): Alturas, Alhambra, Brisbane, Carpinteria
- Short-Day (Orange): Adelanto
- Organic (Green): Artesia
- Cold-Tolerant (Blue): Belvedere
- Home/Debug (Red): Debug cultivar

**Usage:**
- Applied via `getCultivarThemeClass()` in `app/page.tsx`
- Applied via `getFilterThemeClass()` in `components/CultivarFilterPanel.tsx`

---

## Type Definitions

### `types/cultivar.ts`
**Purpose**: TypeScript type definitions for cultivars

**Key Interfaces:**
- `Cultivar`: Main cultivar object structure
- `FilterState`: Filter state structure
- `CultivarStats`: Performance stats structure

---

### `types/background.ts`
**Purpose**: Background image type definitions

---

## API Routes

### `app/api/contact/route.ts`
**Purpose**: Contact form submission endpoint

**Key Features:**
- Handles POST requests from contact form
- Sends email via Resend API
- Includes user location data (IP-based)
- Returns success/error response

**Dependencies:**
- Resend API for email sending
- External IP geolocation service

---

## Public Assets

### `public/images/`
**Image Organization:**
- `cultivars/{id}/`: Cultivar-specific images
  - `banner.jpg`: Marketing banner (3:1 aspect ratio)
  - `{id}_1.jpg`, `{id}_2.jpg`, `{id}_3.jpg`: Carousel images
- `icons/`: Card icons
  - `{cultivar-id}_card_icon.png`: English icons
  - `{cultivar-id}_{lang}_card_icon.png`: Language-specific icons
- `backgrounds/`: Background images
  - `bg_blue_swirl.jpg`: Main background
  - `open_page_bg.jpg`: Homepage background

---

### `public/data/`
**Data Organization:**
- `cultivars/{id}/`: Rich content JSON files
  - `content.json`: English content
  - `content.es.json`: Spanish content
  - `content.pt.json`: Portuguese content
- `csv/`: Chart data CSV files
  - `{cultivar-id}.csv`: Individual cultivar chart data
  - `spider_traits.csv`: Spider chart trait data

---

## Import/Export Relationships

### Main Data Flow
```
app/page.tsx
  ├── data/cultivars.ts (cultivar list)
  ├── components/CultivarDetailCardV2.tsx
  │   ├── data/cultivarContent.ts (loads JSON)
  │   ├── data/chartData.ts (chart data)
  │   ├── data/infoOverlayContent.ts (info overlays)
  │   └── components/* (various UI components)
  └── components/CultivarFilterPanel.tsx
      └── data/cultivars.ts (filter options)
```

### Content Loading Flow
```
CultivarDetailCardV2
  → getCultivarContent(cultivarId, lang)
  → fetch(/data/cultivars/{id}/content.{lang}.json)
  → public/data/cultivars/{id}/content.{lang}.json
```

### Chart Data Flow
```
CultivarDetailCardV2
  → getChartDataFromCSV(cultivarId, metric, comparisonId)
  → loadCultivarDataFromCSV(cultivarId)
  → fetch(/data/csv/{id}.csv)
  → public/data/csv/{id}.csv
  → parseChartDataFromCSV()
```

---

## Common Patterns

### Memoization
- `cultivarConfig` in `CultivarDetailCardV2`: Memoized cultivar-specific configuration
- `mobileFixedPair` in `CultivarDetailCardV2`: Memoized mobile pair configuration

### State Management
- Local state with `useState` for component-specific state
- Context API (`LanguageContext`) for global language state
- No external state management library (Redux, Zustand, etc.)

### Error Handling
- Try-catch blocks in async functions
- Console.error for production error logging (console.log removed)
- Graceful fallbacks (e.g., fallback to hardcoded chart data if CSV fails)

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Separate layouts for mobile portrait, mobile landscape, and desktop

---

## File Naming Conventions

- Components: PascalCase (e.g., `CultivarDetailCardV2.tsx`)
- Data files: camelCase (e.g., `cultivarContent.ts`)
- Type files: camelCase (e.g., `cultivar.ts`)
- CSS files: kebab-case (e.g., `cultivar-themes.css`)
- JSON files: kebab-case (e.g., `content.es.json`)
- CSV files: kebab-case (e.g., `spider_traits.csv`)

---

## Key Design Decisions

1. **Single View System**: All cultivars use `CultivarDetailCardV2` (no fallback views)
2. **Data-Driven**: Content loaded from JSON files, charts from CSV files
3. **Component Reusability**: CultivarIcon component eliminates duplication
4. **Memoization**: Used for expensive computations and cultivar-specific configs
5. **CSS Architecture**: Tailwind + custom CSS for glassmorphism effects
6. **i18n**: JSON-based translation system with context provider

---

## Related Documentation

- `docs/INDEX.md`: Master documentation index
- `README.md`: Project overview
- `DEPLOYMENT_GUIDE.md`: Deployment and update procedures
- `data/README_ArchitectureGuide.md`: Detailed architecture guide
- `docs/CSS_THEME_SYSTEM.md`: CSS architecture documentation
- `data/README_ChartSystem.md`: Chart system documentation
- `data/README_InfoOverlaySystem.md`: Info overlay system documentation

