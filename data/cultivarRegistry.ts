/**
 * UNIFIED CULTIVAR REGISTRY — single source of truth for the 2026 rebuild.
 *
 * STATUS: NOT YET WIRED INTO THE LIVE APP. The legacy files below remain
 * authoritative for the running explorer until the rebuild cuts over.
 * This file consolidates every scattered per-cultivar list in the codebase,
 * verified against the June 2026 audit (see REFACTOR_AUDIT_2026-06.md §1D #27).
 *
 * CONSOLIDATES (provenance):
 *  - data/cultivars.ts                 → id, name, emoji, flowerType, marketType,
 *                                        attributes, attribute2, description
 *                                        (stats/imageUrl/imageGallery dropped — dead, audit #29)
 *  - data/chartData.ts:333-342         → getAvailableCultivarsFromCSV()  → hasChartCsv
 *  - data/chartData.ts:345-371         → getCultivarInfo() taxonomy      → group, seasonMonths
 *  - data/chartData.ts:112-123         → cultivarYieldMax                → chart.yieldAxisMax
 *  - data/chartData.ts:126-136         → cultivarFirmnessRange           → chart.firmnessRange
 *  - CultivarDetailCardV2.tsx:85-98    → cultivarConfig                  → comparison.options/hasDefault
 *  - CultivarDetailCardV2.tsx:115-128  → mobileFixedPair                 → comparison.mobileFixed
 *  - components/CultivarIcon.tsx:43-117→ iconMap/customIconCultivars     → iconBase (note the
 *                                        'sweetcarolina' irregularity — no hyphen in asset names)
 *  - app/page.tsx:49-64                → getCultivarThemeClass()         → theme
 *  - next.config.ts:13-20              → rewrite ids                     → routable
 *
 * KNOWN LEGACY DISCREPANCY (preserved deliberately, fix at cutover):
 *  - 'sweet-carolina' is absent from chartData.ts taxonomy lists, so legacy
 *    getCultivarInfo() returns type 'Unknown' for it. Its true group is
 *    day-neutral (eastern). Recorded correctly here; the legacy app never
 *    notices because its selector is hard-coded in V2.
 */

export type CultivarGroup = 'day-neutral' | 'short-day' | 'summer-plant';
export type FlowerType = 'DN' | 'SD';
export type MarketType = 'fall plant' | 'summer plant' | 'eastern fall plant';
export type CultivarTheme =
  | 'day-neutral'   // yellow
  | 'short-day'     // orange
  | 'organic'       // green
  | 'cold-tolerant' // blue
  | 'home';         // white/red (home tile)

export interface CultivarRecord {
  id: string;
  name: string;            // display name ('Sweet Carolina', not 'sweet-carolina')
  emoji: string;
  group: CultivarGroup;
  flowerType: FlowerType;
  marketType: MarketType;
  attributes: string[];    // legacy split kept; rebuild may merge into one traits[]
  attribute2: string[];
  description: string;
  theme: CultivarTheme;
  routable: boolean;       // gets a /[cultivarId] route (legacy: next.config rewrites)
  iconBase: string | null; // public/images/icons/{iconBase}_card_icon.png (+ _es/_pt variants)
  imageDir: string | null; // public/images/cultivars/{imageDir}/
  contentDir: string | null; // public/data/cultivars/{contentDir}/content[.lang].json
  chart: {
    csv: string | null;          // public/data/csv/{csv}.csv
    yieldAxisMax: number;        // legacy default 1000
    firmnessRange: [number, number]; // legacy default [0.75, 1.75]
  };
  comparison: {
    options: string[];           // ids offered in the comparison selector
    defaultComparison: string | null; // preselected on desktop (legacy: only alturas→monterey)
    mobileFixed: string | null;  // fixed pair on mobile (no selector shown)
  };
}

/** CSV-only cultivars that exist purely as comparison baselines (no page/card). */
export interface ReferenceCultivarRecord {
  id: string;
  name: string;
  group: CultivarGroup;
  csv: string;
}

export const referenceCultivars: ReferenceCultivarRecord[] = [
  { id: 'monterey',    name: 'Monterey',    group: 'day-neutral',  csv: 'monterey' },
  { id: 'cabrillo',    name: 'Cabrillo',    group: 'day-neutral',  csv: 'cabrillo' },
  { id: 'san-andreas', name: 'San Andreas', group: 'day-neutral',  csv: 'san-andreas' },
  { id: 'fronteras',   name: 'Fronteras',   group: 'short-day',    csv: 'fronteras' },
  { id: 'portola',     name: 'Portola',     group: 'summer-plant', csv: 'portola' },
  { id: 'ruby-june',   name: 'Ruby June',   group: 'day-neutral',  csv: 'ruby-june' },
];

export const cultivarRegistry: CultivarRecord[] = [
  {
    id: 'alturas',
    name: 'Alturas',
    emoji: '🛡️',
    group: 'day-neutral',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'premium quality', 'excellent flavor'],
    attribute2: ['high yields'],
    description: 'Premium day-neutral variety with exceptional fusarium resistance and high yields potential.',
    theme: 'day-neutral',
    routable: true,
    iconBase: 'alturas',
    imageDir: 'alturas',
    contentDir: 'alturas',
    chart: { csv: 'alturas', yieldAxisMax: 1250, firmnessRange: [1, 1.4] },
    comparison: {
      options: ['monterey', 'cabrillo', 'carpinteria'],
      defaultComparison: 'monterey', // legacy hasDefaultComparison:true resolved via getDefaultComparisonCultivar
      mobileFixed: 'monterey',
    },
  },
  {
    id: 'adelanto',
    name: 'Adelanto',
    emoji: '🌅',
    group: 'short-day',
    flowerType: 'SD',
    marketType: 'fall plant',
    attributes: ['ultra early', 'macrophomina resistant'],
    attribute2: ['high yields'],
    description: 'Ultra early short-day variety with consistent high yields and excellent fruit quality.',
    theme: 'short-day',
    routable: true,
    iconBase: 'adelanto',
    imageDir: 'adelanto',
    contentDir: 'adelanto',
    chart: { csv: 'adelanto', yieldAxisMax: 900, firmnessRange: [1.1, 1.6] },
    comparison: {
      options: ['belvedere', 'castaic', 'fronteras'],
      defaultComparison: null,
      mobileFixed: 'belvedere',
    },
  },
  {
    id: 'alhambra',
    name: 'Alhambra',
    emoji: '😋',
    group: 'summer-plant',
    flowerType: 'DN',
    marketType: 'summer plant',
    attributes: ['excellent flavor'],
    attribute2: ['macrophomina resistant'],
    description: 'Summer plant variety renowned for its exceptional flavor profile and premium quality.',
    theme: 'day-neutral',
    routable: true,
    iconBase: 'alhambra',
    imageDir: 'alhambra',
    contentDir: 'alhambra',
    chart: { csv: 'alhambra', yieldAxisMax: 500, firmnessRange: [1, 1.4] },
    comparison: {
      options: ['portola'],
      defaultComparison: null,
      mobileFixed: 'portola',
    },
  },
  {
    id: 'artesia',
    name: 'Artesia',
    emoji: '💎',
    group: 'day-neutral',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'organic'],
    attribute2: ['macrophomina resistant'],
    description: 'Premium quality day-neutral variety with excellent market appeal.',
    theme: 'organic',
    routable: true,
    iconBase: 'artesia',
    imageDir: 'artesia',
    contentDir: 'artesia',
    chart: { csv: 'artesia', yieldAxisMax: 1000, firmnessRange: [1, 1.6] },
    comparison: {
      options: ['monterey', 'cabrillo'],
      defaultComparison: null,
      mobileFixed: 'monterey',
    },
  },
  {
    id: 'belvedere',
    name: 'Belvedere',
    emoji: '💎',
    group: 'short-day',
    flowerType: 'SD',
    marketType: 'fall plant',
    attributes: ['premium quality', 'excellent flavor'],
    attribute2: ['macrophomina resistant'],
    description: 'Short-day variety with premium quality fruit and excellent disease resistance.',
    theme: 'short-day',
    routable: true,
    iconBase: 'belvedere',
    imageDir: 'belvedere',
    contentDir: 'belvedere',
    chart: { csv: 'belvedere', yieldAxisMax: 900, firmnessRange: [1, 1.6] },
    comparison: {
      options: ['adelanto', 'castaic', 'fronteras'],
      defaultComparison: null,
      mobileFixed: null, // legacy mobileFixedPair: comparison undefined
    },
  },
  {
    id: 'brisbane',
    name: 'Brisbane',
    emoji: '🌿',
    group: 'day-neutral',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant'],
    attribute2: [],
    description: 'Moderate day-neutral variety with excellent appearance and superior taste test rankings.',
    theme: 'day-neutral',
    routable: true,
    iconBase: 'brisbane',
    imageDir: 'brisbane',
    contentDir: 'brisbane',
    chart: { csv: 'brisbane', yieldAxisMax: 1000, firmnessRange: [1, 1.4] },
    comparison: {
      options: ['monterey', 'cabrillo'],
      defaultComparison: null,
      mobileFixed: 'monterey',
    },
  },
  {
    id: 'castaic',
    name: 'Castaic',
    emoji: '📈',
    group: 'short-day',
    flowerType: 'SD',
    marketType: 'fall plant',
    attributes: ['premium quality'],
    attribute2: ['high yields'],
    description: 'High-yielding short-day variety with excellent production potential.',
    theme: 'short-day',
    routable: true,
    iconBase: 'castaic',
    imageDir: 'castaic',
    contentDir: 'castaic',
    chart: { csv: 'castaic', yieldAxisMax: 1100, firmnessRange: [1.1, 1.5] },
    comparison: {
      options: ['adelanto', 'belvedere', 'fronteras'],
      defaultComparison: null,
      mobileFixed: 'fronteras',
    },
  },
  {
    id: 'carpinteria',
    name: 'Carpinteria',
    emoji: '💪',
    group: 'day-neutral',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'premium quality'],
    attribute2: ['high yields'],
    description: 'Day-neutral variety with fusarium resistance and reliable performance.',
    theme: 'day-neutral',
    routable: true,
    iconBase: 'carpinteria',
    imageDir: 'carpinteria',
    contentDir: 'carpinteria',
    chart: { csv: 'carpinteria', yieldAxisMax: 1000, firmnessRange: [1, 1.5] },
    comparison: {
      options: ['monterey', 'cabrillo', 'alturas'],
      defaultComparison: null,
      mobileFixed: 'monterey',
    },
  },
  {
    id: 'sweet-carolina',
    name: 'Sweet Carolina',
    emoji: '❄️',
    group: 'day-neutral', // eastern DN; legacy chartData taxonomy omits it (see header note)
    flowerType: 'DN',
    marketType: 'eastern fall plant',
    attributes: ['excellent flavor', 'cold tolerant'],
    attribute2: ['high yields'],
    description: 'Cold-tolerant eastern variety with regional adaptation.',
    theme: 'cold-tolerant',
    routable: true,
    iconBase: 'sweetcarolina', // asset names have no hyphen (icons AND public/images/cultivars/sweetcarolina/)
    imageDir: 'sweetcarolina',
    contentDir: 'sweet-carolina', // content dir DOES use the hyphen — irregular pair, verified
    chart: { csv: 'sweet-carolina', yieldAxisMax: 500, firmnessRange: [0.75, 1.75] },
    comparison: {
      options: ['ruby-june'],
      defaultComparison: null,
      mobileFixed: 'ruby-june',
    },
  },
];

// ---------------------------------------------------------------------------
// Derived views — these replace the legacy scattered lists at cutover.
// ---------------------------------------------------------------------------

export const cultivarById: Record<string, CultivarRecord> = Object.fromEntries(
  cultivarRegistry.map((c) => [c.id, c]),
);

export const referenceById: Record<string, ReferenceCultivarRecord> = Object.fromEntries(
  referenceCultivars.map((c) => [c.id, c]),
);

/** Display name for any id (registry, reference, or fallback prettify). */
export function displayName(id: string): string {
  return (
    cultivarById[id]?.name ??
    referenceById[id]?.name ??
    id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
  );
}

/** Replaces chartData.getAvailableCultivarsFromCSV() */
export const allChartIds: string[] = [
  ...cultivarRegistry.filter((c) => c.chart.csv).map((c) => c.id),
  ...referenceCultivars.map((c) => c.id),
];

/** Replaces the 3 hard-coded taxonomy lists in chartData.ts */
export function groupOf(id: string): CultivarGroup | null {
  return cultivarById[id]?.group ?? referenceById[id]?.group ?? null;
}

export const groupMeta: Record<CultivarGroup, { label: string; season: string; months: string[] }> = {
  'day-neutral':  { label: 'Day-Neutral',              season: 'Spring-Fall',   months: ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'] },
  'short-day':    { label: 'Short-Day',                season: 'Winter-Spring', months: ['Dec','Jan','Feb','Mar','Apr','May'] },
  'summer-plant': { label: 'Summer Plant Day-Neutral', season: 'Fall-Winter',   months: ['Oct','Nov','Dec','Jan'] },
};

/** Replaces next.config.ts rewrite list / drives app/[cultivarId] static params. */
export const routableIds: string[] = cultivarRegistry.filter((c) => c.routable).map((c) => c.id);
