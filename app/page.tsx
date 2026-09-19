import type { Metadata } from 'next';
import alturasContent from '../public/data/cultivars/alturas/content.json';
import type { CultivarContent } from '../data/cultivarContent';
import Explorer from '../components/Explorer';
import { getExplorerSeo } from '../lib/explorer-seo';

type Props = {
  searchParams: Promise<{ cultivar?: string | string[]; lang?: string }>;
};

// Existing /:cultivarId rewrites supply this query parameter. Keep those routes
// and the interactive Explorer intact; only their server metadata differs.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { cultivar } = await searchParams;
  const seo = getExplorerSeo(Array.isArray(cultivar) ? cultivar[0] : cultivar);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'CBC Cultivar Explorer',
      title: seo.title,
      description: seo.description,
      url: seo.url,
      images: [{ url: seo.image, width: 512, height: 512, alt: 'CBC Cultivar Explorer' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { cultivar, lang } = await searchParams;
  const id = Array.isArray(cultivar) ? cultivar[0] : cultivar;
  // Bounded pilot: reuse Alturas's published English content in the initial HTML.
  // Other cultivars and explicit non-English query links retain their existing loader.
  const initialContent = id === 'alturas' && (!lang || lang === 'en')
    ? alturasContent as CultivarContent : undefined;
  return <Explorer initialContent={initialContent} />;
}
