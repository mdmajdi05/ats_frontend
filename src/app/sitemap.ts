import type { MetadataRoute } from 'next';
import { COUNTRY_CODES } from '@/lib/countries';

const BASE = 'https://aeroturbinespare.com';
const API  = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const cc of COUNTRY_CODES) {
    const prefix = `/${cc}`;

    // Static pages per country
    entries.push(
      { url: `${BASE}${prefix}`,                         lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
      { url: `${BASE}${prefix}/about`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE}${prefix}/quality`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE}${prefix}/contact`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE}${prefix}/industries`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
      { url: `${BASE}${prefix}/blog`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    );

    // Products per country
    try {
      const { default: productsData } = await import('@/data/products.json');
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
      const { default: catsData } = await import('@/data/categories.json');
      ((catsData as { industries: Array<{ slug: string }> }).industries || []).forEach((ind) => {
        if (ind.slug) {
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
        .filter((p) => p.slug)
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
        .filter((c) => c.slug)
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
        .filter((t) => t.slug)
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
