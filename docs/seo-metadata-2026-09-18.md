# Explorer metadata and canonicals

September 18, 2026. Bounded SEO change on top of `7906b13`.

## Problem and result

Existing cultivar URLs already work through `next.config.ts` rewrites, but all
inherited a generic title and a hard-coded canonical pointing at the Explorer
root. Live Alturas and Castaic were checked before implementation. Search Console
also showed Alturas indexed with Google selecting `/alturas` despite the declared
root canonical. This fixes that contradiction; it does not claim those URLs were
previously invisible.

The root and all 11 existing cultivar URLs now have server-generated titles,
descriptions, canonical URLs, and Open Graph/Twitter metadata. Existing in-place
cultivar selection and Home also synchronize these tags. Query aliases identify
the corresponding clean URL as canonical, and now display that cultivar. Existing
path rewrites take precedence over conflicting query values.

Added a sitemap containing exactly those 12 URLs and a robots.txt sitemap reference.
No invented modification dates or cultivar structured data.

## Review boundaries

- `app/page.tsx` is now a small server metadata wrapper. The original interactive
  component moved to `components/Explorer.tsx`, preserving markup, styling,
  filtering, charts, comparisons, language handling, timings, and contact behavior.
- The moved component differs only by the metadata synchronization import/two
  calls and the query-alias fallback in initial cultivar selection (excluding the
  internal `debug` intro item).
- The one hard-coded canonical was removed from `app/layout.tsx`. Its existing
  metadataBase remains correct. Next's page metadata supplies the canonical.
- `lib/explorer-seo.ts` centralizes titles/URLs; cultivar names and flower types
  come from existing data. Descriptions introduce no new performance claims.
- No changes to routes/rewrites, cultivar datasets, dependencies, CSS, analytics,
  contact API, the homepage repository, or Registry.

**Rendering tradeoff:** reading the existing rewrite query through `searchParams`
makes the root/rewrite page dynamically rendered rather than statically
prerendered. This is the smallest change that preserves current routing while
serving distinct metadata. Production build and local production HTTP checks
passed; deployed latency/cost have not been measured. The detailed cultivar body
still resolves after client hydration, as before. Rendering that body on the
server, ordinary crawlable selector links, and language URLs remain separate
follow-up work. This patch does not claim to complete that broader SEO scope.

## Validation

- TypeScript `tsc --noEmit -p tsconfig.json`: passed.
- `next build` (Next 15.3.8): passed, including lint/type checks. Only existing
  `no-img-element` warnings in CultivarIcon and the moved original markup.
- Both development and production servers passed `scripts/check-seo.py`: root +
  11 cultivar URLs with browser and Googlebot user agents, unique titles, exactly
  one canonical, matching descriptions/share tags, query aliases, 12 sitemap
  entries, robots reference, and genuine 404/noindex for invalid/debug paths.
- Browser: direct Alturas, Alturas to Castaic to Home, Castaic refresh, query alias
  Castaic content, Fronteras comparison, Day Neutral filter/clear, Spanish/English
  switching. Metadata matched selected URLs; production console had no captured
  warnings/errors. No contact form submitted.
- Compared the moved component against the original Git blob to confirm the
  small edits above; no UI rewrite hidden in the move.

Repeat the HTTP audit against a running local production build:

```sh
python3 scripts/check-seo.py --origin http://127.0.0.1:3011
```

After deployment, run the same script with
`--origin https://cultivars.cbcberry.com`, then submit the Explorer sitemap and
inspect representative cultivar URLs in Search Console. Indexing changes require
Google to recrawl; no ranking increase is promised. No Search Console submissions
were made during this patch.

## Release status at handoff

Local commit only. Vercel's [status page](https://www.vercel-status.com/) still
reported “Elevated Errors Triggering Deployments” with an investigating update
at 20:56 UTC on September 18 when checked. No push or deployment was triggered.
The separate homepage SEO commit `9857a5e` was not changed or pushed by this patch.
