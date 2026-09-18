import type { MetadataRoute } from 'next';
import { EXPLORER_ORIGIN } from '../lib/explorer-seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${EXPLORER_ORIGIN}/sitemap.xml`,
  };
}
