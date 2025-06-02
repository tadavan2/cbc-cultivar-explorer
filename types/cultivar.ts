export interface CultivarStats {
  yieldKgPerHa: number;
  brix: number;
  shelfLifeDays: number;
  fruitWeight: number;
}

export interface Cultivar {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  flowerType: "DN" | "SD"; // Day-Neutral or Short-Day
  marketType: "fall plant" | "summer plant" | "eastern fall plant";
  attributes: string[]; // fusarium resistant, ultra early, etc.
  attribute2: string[]; // high yield, good flavor, etc.
  stats: CultivarStats;
  description: string;
  imageGallery: string[];
}

export interface FilterState {
  flowerType: string[];
  marketType: string[];
  attributes: string[];
  attribute2: string[];
} 