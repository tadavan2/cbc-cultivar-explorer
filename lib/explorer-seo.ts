import { cultivars } from '../data/cultivars';

export const EXPLORER_ORIGIN = 'https://cultivars.cbcberry.com';
export const publicCultivars = cultivars.filter((cultivar) => cultivar.id !== 'debug');

/** One source for initial server metadata and in-place cultivar selections. */
export function getExplorerSeo(cultivarId?: string) {
  const cultivar = publicCultivars.find((item) => item.id === cultivarId);
  return {
    title: cultivar
      ? `${cultivar.name} Strawberry Variety | California Berry Cultivars`
      : 'CBC Cultivar Explorer - Premium Strawberry Genetics',
    description: cultivar
      ? `${cultivar.name} is a ${cultivar.flowerType === 'DN' ? 'day-neutral' : 'short-day'} strawberry variety from California Berry Cultivars. Explore performance data, growing recommendations, and cultivar comparisons.`
      : "Compare strawberry varieties, analyze performance data, and find the perfect cultivar for your operation. Explore CBC's premium strawberry genetics with detailed insights on yield, size, disease resistance, and growing recommendations.",
    url: cultivar ? `${EXPLORER_ORIGIN}/${cultivar.id}` : EXPLORER_ORIGIN,
    image: `${EXPLORER_ORIGIN}/images/icons/flavicon.png`,
  };
}
