export interface CultivarDescription {
  title: string;
  paragraphs: string[];
}

export interface CultivarImageSet {
  banner: string;
  carousel: string[];
}

export interface CultivarPerformanceMetrics {
  yield: string;
  size: string;
  appearance: string;
  firmness: string;
}

export interface CultivarRecommendations {
  plantingDate: string;
  chill: string;
  fertility: string;
  other: string;
}

export interface CultivarContent {
  id: string;
  name: string;
  displayName: string;
  type: 'day-neutral' | 'short-day' | 'summer-plant-day-neutral';
  description: CultivarDescription;
  images: CultivarImageSet;
  performanceMetrics: CultivarPerformanceMetrics;
  recommendations: CultivarRecommendations;
  // Future expansion fields
  features?: string[];
  specifications?: Record<string, string>;
  growingTips?: string[];
}

// Cache for loaded content
const contentCache: Record<string, CultivarContent | null> = {};

export async function getCultivarContent(cultivarId: string, lang: string): Promise<CultivarContent | null> {
  const cacheKey = `${cultivarId}_${lang}`;
  if (contentCache[cacheKey] !== undefined) {
    return contentCache[cacheKey];
  }
  let url: string;
  let response: Response;
  try {
    if (lang === 'en') {
      // For English, always use content.json
      url = `/data/cultivars/${cultivarId}/content.json`;
      response = await fetch(url);
    } else {
      // For other languages, try content.{lang}.json first
      url = `/data/cultivars/${cultivarId}/content.${lang}.json`;
      response = await fetch(url);
      if (!response.ok) {
        // Fallback to English
        url = `/data/cultivars/${cultivarId}/content.json`;
        response = await fetch(url);
      }
    }
    if (!response.ok) {
      contentCache[cacheKey] = null;
      return null;
    }
    const content: CultivarContent = await response.json();
    contentCache[cacheKey] = content;
    return content;
  } catch (error) {
    console.error('Error loading cultivar content for:', cultivarId, lang, error);
    contentCache[cacheKey] = null;
    return null;
  }
}

export function getAllCultivarIds(): string[] {
  // This would need to be updated to scan the directory or maintain a list
  return ['debug', 'alturas', 'adelanto', 'alhambra', 'artesia', 'belvedere'];
}

export function getCultivarsByType(type: CultivarContent['type']): Promise<CultivarContent[]> {
  // This would need to be implemented to load all cultivars and filter by type
  return Promise.resolve([]);
} 