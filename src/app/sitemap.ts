import type { MetadataRoute } from 'next';
import { COUNTRY_CODES } from '@/lib/countries';
import { SITE_URL } from '@/lib/constants';

const BASE = SITE_URL;
const API  = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

const LANDING_PAGES = [
  'ge-gas-turbine-parts',
  'ge-frame-6b-parts',
  'ge-frame-7fa-parts',
  'ge-frame-9e-parts',
  'ms6001-parts',
  'ms7001-parts',
  'ge-lm2500-parts',
  'ge-lm6000-parts',
  'siemens-gas-turbine-parts',
  'siemens-sgt800-parts',
  'rolls-royce-turbine-parts',
  'rolls-royce-rb211-parts',
  'solar-turbines-parts',
  'parts/combustion-liners',
  'parts/fuel-nozzles',
  'parts/turbine-blades',
  'parts/transition-pieces',
  'parts/turbine-shrouds',
  'parts/turbine-discs',
];

// hreflang alternates across all country versions of the same page
function altLangs(path: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const cc of COUNTRY_CODES) {
    langs[cc] = `${BASE}/${cc}${path}`;
  }
  return langs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const cc of COUNTRY_CODES) {
    const prefix = `/${cc}`;

    // Static pages per country
    entries.push(
      { url: `${BASE}${prefix}`,                         lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0, alternates: { languages: altLangs('/') } },
      { url: `${BASE}${prefix}/about`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: altLangs('/about') } },
      { url: `${BASE}${prefix}/quality`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: altLangs('/quality') } },
      { url: `${BASE}${prefix}/contact`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: altLangs('/contact') } },
      { url: `${BASE}${prefix}/industries`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8, alternates: { languages: altLangs('/industries') } },
      { url: `${BASE}${prefix}/blog`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9, alternates: { languages: altLangs('/blog') } },
      { url: `${BASE}${prefix}/catalog`,                 lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9, alternates: { languages: altLangs('/catalog') } },
      { url: `${BASE}${prefix}/categories`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8, alternates: { languages: altLangs('/categories') } },
      { url: `${BASE}${prefix}/rfq`,                     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: altLangs('/rfq') } },
      { url: `${BASE}${prefix}/inventory`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6, alternates: { languages: altLangs('/inventory') } },
      { url: `${BASE}${prefix}/privacy`,                 lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3, alternates: { languages: altLangs('/privacy') } },
      { url: `${BASE}${prefix}/terms`,                   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3, alternates: { languages: altLangs('/terms') } },
    );

    // Keyword landing pages per country
    LANDING_PAGES.forEach((page) => {
      entries.push({
        url: `${BASE}${prefix}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: { languages: altLangs(`/${page}`) },
      });
    });

    // Products per country
    try {
      const { default: productsData } = await import('@/data/products/products.json');
      (productsData as Array<{ id: string; updatedAt: string }>).forEach((p) => {
        entries.push({
          url: `${BASE}${prefix}/catalog/${p.id}`,
          lastModified: new Date(p.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    } catch { /* skip products */ }

    // Industries per country
    try {
      const { default: catsData } = await import('@/data/categories/categories.json');
      ((catsData as { industries: Array<{ slug: string }> }).industries || []).forEach((ind) => {
        if (ind.slug && isValidSlug(ind.slug)) {
          entries.push({
            url: `${BASE}${prefix}/industries/${ind.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    } catch { /* skip industries */ }
  }

  // Blog posts (fetched from backend — country-agnostic)
  try {
    const res = await fetch(`${API}/blog/sitemap`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    const json = await res.json();
    if (json.success) {
      const { posts, categories, tags } = json.data;

      (posts as Array<{ slug: string; updatedAt: string; publishedAt: string }>)
        .filter((p) => p.slug && isValidSlug(p.slug))
        .forEach((p) => {
          for (const cc of COUNTRY_CODES) {
            entries.push({
              url: `${BASE}/${cc}/blog/${p.slug}`,
              lastModified: new Date(p.updatedAt || p.publishedAt),
              changeFrequency: 'weekly' as const,
              priority: 0.8,
            });
          }
        });

      (categories as Array<{ slug: string }>)
        .filter((c) => c.slug && isValidSlug(c.slug))
        .forEach((c) => {
          for (const cc of COUNTRY_CODES) {
            entries.push({
              url: `${BASE}/${cc}/blog/category/${c.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.5,
            });
          }
        });

      (tags as Array<{ slug: string }>)
        .filter((t) => t.slug && isValidSlug(t.slug))
        .forEach((t) => {
          for (const cc of COUNTRY_CODES) {
            entries.push({
              url: `${BASE}/${cc}/blog/tag/${t.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.4,
            });
          }
        });
    }
  } catch {
    // Backend unavailable — skip blog sitemap entries
  }

  return entries;
}
