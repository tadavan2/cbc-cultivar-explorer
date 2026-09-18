import { getExplorerSeo } from './explorer-seo';

/**
 * The Explorer intentionally uses replaceState, not a route navigation, to keep
 * filters, comparisons, scroll and animations intact. Synchronize its existing
 * head tags at the same boundary. Crawlers receive matching server metadata.
 */
export function syncExplorerMetadata(cultivarId?: string) {
  const seo = getExplorerSeo(cultivarId);
  document.title = seo.title;

  const tags = [
    ['name', 'description', seo.description],
    ['property', 'og:title', seo.title],
    ['property', 'og:description', seo.description],
    ['property', 'og:url', seo.url],
    ['property', 'og:image', seo.image],
    ['name', 'twitter:title', seo.title],
    ['name', 'twitter:description', seo.description],
    ['name', 'twitter:image', seo.image],
  ];
  for (const [attribute, key, value] of tags) {
    const meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (meta) meta.content = value;
  }
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = seo.url;
}
