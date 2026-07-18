/**
 * Per-Cultivar UI Configuration — SINGLE SOURCE OF TRUTH (for the LIVE app)
 *
 * NOTE: data/cultivarRegistry.ts is the richer registry targeted by the 2026
 * rebuild (REBUILD_BRIEF.md) and is NOT yet wired in. THIS file is what the
 * running app consumes today. Until the rebuild cuts over, keep both in sync
 * when adding a cultivar (the registry subsumes this file at cutover).
 *
 * PURPOSE:
 * Everything the UI needs to know about a cultivar besides its display data
 * (which lives in data/cultivars.ts) is declared HERE, in one place:
 *
 * - group:               chart grouping + season months (day-neutral / short-day / summer-plant)
 * - inChartSelector:     whether it appears in the "Select Cultivars" chart panel
 * - cardIconBase:        basename of its custom card icon in public/images/icons/
 *                        (icon files: {base}_card_icon.png, {base}_{lang}_card_icon.png);
 *                        omit to fall back to emoji + name rendering
 * - comparisonOptions:   comparison chips offered on its detail page
 * - hasDefaultComparison:whether a default comparison is preselected (desktop)
 * - mobileFixedPair:     fixed comparison on mobile ('adelanto'), null = fixed
 *                        pair with no comparison; omit = no fixed pair entry
 * - yieldMax:            yield chart y-axis max override (default 1000)
 * - firmnessRange:       firmness chart y-axis range override (default [0.75, 1.75])
 *
 * ADDING A CULTIVAR — the full checklist:
 * 1. data/cultivars.ts        — display entry (name, traits, stats, description)
 * 2. THIS FILE                — one config entry
 * 3. public/data/cultivars/{id}/content.json (+ .es.json, .pt.json)
 * 4. public/data/csv/{id}.csv — monthly chart data (if inChartSelector)
 * 5. public/data/csv/spider_traits.csv — one row
 * 6. public/images/cultivars/{id}/banner.jpg (+ carousel photos)
 * 7. public/images/icons/{id}_card_icon.png (+ _es/_pt) — then set cardIconBase
 * (Deep-link rewrites in next.config.ts derive from data/cultivars.ts automatically.)
 *
 * ORDER MATTERS: the chart selector lists cultivars in the order below.
 *
 * RELATED FILES:
 * - data/cultivars.ts:    display data registry (order of sidebar cards)
 * - data/chartData.ts:    derives groupings/axis config from here
 * - components/CultivarIcon.tsx:        derives icon paths from here
 * - components/CultivarDetailCardV2.tsx: derives comparison config from here
 */

export type CultivarGroup = 'day-neutral' | 'short-day' | 'summer-plant';

export interface CultivarUIConfig {
  id: string;
  group?: CultivarGroup;
  inChartSelector?: boolean;
  cardIconBase?: string;
  comparisonOptions?: string[];
  hasDefaultComparison?: boolean;
  mobileFixedPair?: string | null;
  yieldMax?: number;
  firmnessRange?: [number, number];
}

export const GROUP_INFO: Record<CultivarGroup, { type: string; season: string; months: string[] }> = {
  'day-neutral': {
    type: 'Day-Neutral',
    season: 'Spring-Fall',
    months: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  },
  'short-day': {
    type: 'Short-Day',
    season: 'Winter-Spring',
    months: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
  },
  'summer-plant': {
    type: 'Summer Plant Day-Neutral',
    season: 'Fall-Winter',
    months: ['Oct', 'Nov', 'Dec', 'Jan'],
  },
};

// Ordered list — chart selector display order follows this.
export const cultivarUIConfigs: CultivarUIConfig[] = [
  // ---- Day-Neutral (Spring-Fall) ----
  {
    id: 'alturas',
    group: 'day-neutral',
    inChartSelector: true,
    cardIconBase: 'alturas',
    comparisonOptions: ['monterey', 'cabrillo', 'carpinteria'],
    hasDefaultComparison: true,
    mobileFixedPair: 'monterey',
    yieldMax: 1250,
    firmnessRange: [1, 1.4],
  },
  { id: 'san-andreas', group: 'day-neutral', inChartSelector: true },
  { id: 'cabrillo', group: 'day-neutral', inChartSelector: true },
  { id: 'monterey', group: 'day-neutral', inChartSelector: true },
  {
    id: 'brisbane',
    group: 'day-neutral',
    inChartSelector: true,
    cardIconBase: 'brisbane',
    comparisonOptions: ['monterey', 'cabrillo'],
    mobileFixedPair: 'monterey',
    yieldMax: 1000,
    firmnessRange: [1, 1.4],
  },
  {
    id: 'carpinteria',
    group: 'day-neutral',
    inChartSelector: true,
    cardIconBase: 'carpinteria',
    comparisonOptions: ['monterey', 'cabrillo', 'alturas'],
    mobileFixedPair: 'monterey',
    yieldMax: 1000,
    firmnessRange: [1, 1.5],
  },
  {
    id: 'artesia',
    group: 'day-neutral',
    inChartSelector: true,
    cardIconBase: 'artesia',
    comparisonOptions: ['monterey', 'cabrillo'],
    mobileFixedPair: 'monterey',
    yieldMax: 1000,
    firmnessRange: [1, 1.6],
  },
  // ---- Short-Day (Winter-Spring) ----
  {
    id: 'adelanto',
    group: 'short-day',
    inChartSelector: true,
    cardIconBase: 'adelanto',
    comparisonOptions: ['belvedere', 'castaic', 'fronteras'],
    mobileFixedPair: 'belvedere',
    yieldMax: 900,
    firmnessRange: [1.1, 1.6],
  },
  {
    id: 'belvedere',
    group: 'short-day',
    inChartSelector: true,
    cardIconBase: 'belvedere',
    comparisonOptions: ['adelanto', 'castaic', 'fronteras'],
    mobileFixedPair: null,
    yieldMax: 900,
    firmnessRange: [1, 1.6],
  },
  {
    id: 'castaic',
    group: 'short-day',
    inChartSelector: true,
    cardIconBase: 'castaic',
    comparisonOptions: ['adelanto', 'belvedere', 'fronteras'],
    mobileFixedPair: 'fronteras',
    yieldMax: 1100,
    firmnessRange: [1.1, 1.5],
  },
  { id: 'fronteras', group: 'short-day', inChartSelector: true },
  {
    id: 'dunsmuir',
    group: 'short-day',
    inChartSelector: true,
    cardIconBase: 'dunsmuir',
    comparisonOptions: ['adelanto', 'belvedere', 'fronteras'],
    mobileFixedPair: 'adelanto',
    yieldMax: 900, // OX 2026 peak 837
    firmnessRange: [1, 1.4],
  },
  {
    id: 'elcano',
    group: 'short-day',
    inChartSelector: true,
    cardIconBase: 'elcano',
    comparisonOptions: ['adelanto', 'belvedere', 'castaic'],
    mobileFixedPair: null,
    yieldMax: 600, // Huelva macrotunnel, 2025 peak 484
    firmnessRange: [0.9, 1.3],
  },
  // ---- Summer Plant Day-Neutral (Fall-Winter) ----
  { id: 'portola', group: 'summer-plant', inChartSelector: true },
  {
    id: 'alhambra',
    group: 'summer-plant',
    inChartSelector: true,
    cardIconBase: 'alhambra',
    comparisonOptions: ['portola'],
    mobileFixedPair: 'portola',
    yieldMax: 500,
    firmnessRange: [1, 1.4],
  },
  // ---- Comparison-only / special ----
  { id: 'ruby-june' }, // eastern comparison for sweet-carolina; CSV exists but not in selector
  {
    id: 'sweet-carolina',
    cardIconBase: 'sweetcarolina',
    comparisonOptions: ['ruby-june'],
    mobileFixedPair: 'ruby-june',
    yieldMax: 500,
  },
  { id: 'debug', cardIconBase: 'open' }, // explorer intro card
];

export const cultivarConfigById: { [id: string]: CultivarUIConfig } = Object.fromEntries(
  cultivarUIConfigs.map(c => [c.id, c])
);

export function getCardIconPath(cultivarId: string, lang: string): string | null {
  const base = cultivarConfigById[cultivarId]?.cardIconBase;
  if (!base) return null;
  return lang === 'en' || lang === ''
    ? `/images/icons/${base}_card_icon.png`
    : `/images/icons/${base}_${lang}_card_icon.png`;
}
