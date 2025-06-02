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

export async function getCultivarContent(cultivarId: string): Promise<CultivarContent | null> {
  // Check cache first
  if (contentCache[cultivarId] !== undefined) {
    return contentCache[cultivarId];
  }
  
  try {
    const response = await fetch(`/data/cultivars/${cultivarId}/content.json`);
    
    if (!response.ok) {
      contentCache[cultivarId] = null;
      return null;
    }
    
    const content: CultivarContent = await response.json();
    
    // Cache the result
    contentCache[cultivarId] = content;
    return content;
  } catch (error) {
    console.error('Error loading cultivar content for:', cultivarId, error);
    contentCache[cultivarId] = null;
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