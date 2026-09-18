import type { MetadataRoute } from 'next';
import { EXPLORER_ORIGIN, publicCultivars } from '../lib/explorer-seo';

export default function sitemap(): MetadataRoute.Sitemap {
  // No fabricated modification dates. Only existing public cultivar URLs.
  return [
    { url: EXPLORER_ORIGIN },
    ...publicCultivars.map((cultivar) => ({ url: `${EXPLORER_ORIGIN}/${cultivar.id}` })),
  ];
}
