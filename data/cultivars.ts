import { Cultivar } from '../types/cultivar';

export const cultivars: Cultivar[] = [
  {
    id: 'debug',
    name: 'CBC Cultivar Explorer',
    emoji: '🌱',
    imageUrl: '/images/icons/open_card_icon.png',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['premium quality', 'excellent flavor'],
    attribute2: ['high yields', 'fusarium resistant'],
    stats: {
      yieldKgPerHa: 50000,
      brix: 9.5,
      shelfLifeDays: 10,
      fruitWeight: 22.0
    },
    description: 'Welcome to the CBC Cultivar Explorer - your gateway to discovering premium strawberry varieties.',
    imageGallery: ['/images/debug-1.jpg', '/images/debug-2.jpg']
  },
  {
    id: 'alturas',
    name: 'Alturas',
    emoji: '🛡️',
    imageUrl: '/images/alturas.jpg',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'premium quality', 'excellent flavor'],
    attribute2: ['high yields'],
    stats: {
      yieldKgPerHa: 45000,
      brix: 8.2,
      shelfLifeDays: 7,
      fruitWeight: 18.5
    },
    description: 'Premium day-neutral variety with exceptional fusarium resistance and high yields potential.',
    imageGallery: ['/images/alturas-1.jpg', '/images/alturas-2.jpg']
  },
  {
    id: 'adelanto',
    name: 'Adelanto',
    emoji: '🌅',
    imageUrl: '/images/adelanto.jpg',
    flowerType: 'SD',
    marketType: 'fall plant',
    attributes: ['ultra early', 'macrophomina resistant'],
    attribute2: ['high yields'],
    stats: {
      yieldKgPerHa: 42000,
      brix: 8.5,
      shelfLifeDays: 8,
      fruitWeight: 19.2
    },
    description: 'Ultra early short-day variety with consistent high yields and excellent fruit quality.',
    imageGallery: ['/images/adelanto-1.jpg', '/images/adelanto-2.jpg']
  },
  {
    id: 'alhambra',
    name: 'Alhambra',
    emoji: '😋',
    imageUrl: '/images/alhambra.jpg',
    flowerType: 'DN',
    marketType: 'summer plant',
    attributes: ['premium quality', 'excellent flavor'],
    attribute2: ['macrophomina resistant'],
    stats: {
      yieldKgPerHa: 38000,
      brix: 9.1,
      shelfLifeDays: 6,
      fruitWeight: 17.8
    },
    description: 'Summer plant variety renowned for its exceptional flavor profile and premium quality.',
    imageGallery: ['/images/alhambra-1.jpg', '/images/alhambra-2.jpg']
  },
  {
    id: 'artesia',
    name: 'Artesia',
    emoji: '💎',
    imageUrl: '/images/artesia.jpg',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'excellent flavor', 'organic'],
    attribute2: ['macrophomina resistant'],
    stats: {
      yieldKgPerHa: 40000,
      brix: 8.8,
      shelfLifeDays: 7,
      fruitWeight: 18.9
    },
    description: 'Premium quality day-neutral variety with excellent market appeal.',
    imageGallery: ['/images/artesia-1.jpg', '/images/artesia-2.jpg']
  },
  {
    id: 'belvedere',
    name: 'Belvedere',
    emoji: '💎',
    imageUrl: '/images/belvedere.jpg',
    flowerType: 'SD',
    marketType: 'fall plant',
    attributes: ['premium quality', 'excellent flavor'],
    attribute2: ['macrophomina resistant', 'high yields'],
    stats: {
      yieldKgPerHa: 35000,
      brix: 8.9,
      shelfLifeDays: 8,
      fruitWeight: 20.1
    },
    description: 'Short-day variety with premium quality fruit and excellent disease resistance.',
    imageGallery: ['/images/belvedere-1.jpg', '/images/belvedere-2.jpg']
  },
  {
    id: 'brisbane',
    name: 'Brisbane',
    emoji: '🌿',
    imageUrl: '/images/brisbane.jpg',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'premium quality', 'excellent flavor'],
    attribute2: ['high yields'],
    stats: {
      yieldKgPerHa: 41000,
      brix: 8.6,
      shelfLifeDays: 7,
      fruitWeight: 18.3
    },
    description: 'Moderate day-neutral variety with excellent appearance and superior taste test rankings.',
    imageGallery: ['/images/brisbane-1.jpg', '/images/brisbane-2.jpg']
  },
  {
    id: 'castaic',
    name: 'Castaic',
    emoji: '📈',
    imageUrl: '/images/castaic.jpg',
    flowerType: 'SD',
    marketType: 'fall plant',
    attributes: ['premium quality'],
    attribute2: ['high yields'],
    stats: {
      yieldKgPerHa: 48000,
      brix: 8.1,
      shelfLifeDays: 6,
      fruitWeight: 19.5
    },
    description: 'High-yielding short-day variety with excellent production potential.',
    imageGallery: ['/images/castaic-1.jpg', '/images/castaic-2.jpg']
  },
  {
    id: 'carpinteria',
    name: 'Carpinteria',
    emoji: '💪',
    imageUrl: '/images/carpinteria.jpg',
    flowerType: 'DN',
    marketType: 'fall plant',
    attributes: ['fusarium resistant', 'premium quality', 'excellent flavor'],
    attribute2: ['high yields'],
    stats: {
      yieldKgPerHa: 43000,
      brix: 8.4,
      shelfLifeDays: 8,
      fruitWeight: 18.7
    },
    description: 'Day-neutral variety with fusarium resistance and reliable performance.',
    imageGallery: ['/images/carpinteria-1.jpg', '/images/carpinteria-2.jpg']
  },
  {
    id: 'sweet-carolina',
    name: 'Sweet Carolina',
    emoji: '❄️',
    imageUrl: '/images/sweet-carolina.jpg',
    flowerType: 'DN',
    marketType: 'eastern fall plant',
    attributes: ['premium quality', 'excellent flavor', 'cold tolerant'],
    attribute2: ['high yields'],
    stats: {
      yieldKgPerHa: 39000,
      brix: 8.7,
      shelfLifeDays: 7,
      fruitWeight: 17.9
    },
    description: 'Cold-tolerant eastern variety with regional adaptation.',
    imageGallery: ['/images/sweet-carolina-1.jpg', '/images/sweet-carolina-2.jpg']
  }
];

// Extract unique values for filters
export const allFlowerTypes = Array.from(new Set(cultivars.map(c => c.flowerType)));
export const allMarketTypes = Array.from(new Set(cultivars.map(c => c.marketType)));
export const allAttributes = Array.from(new Set(cultivars.flatMap(c => c.attributes)));
export const allAttribute2 = Array.from(new Set(cultivars.flatMap(c => c.attribute2).filter(Boolean))); 