import type { MetadataRoute } from 'next';

const BASE = 'https://aeroturbinespare.com';
const API  = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                         lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/catalog`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/rfq`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/inventory`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/quality`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/industries`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/industries/aerospace`,         lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/industries/aircraft-components-accessories`,  lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/industries/aircraft-launching-landing-ground-handling`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/industries/engines-turbines-components`,  lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/industries/engine-accessories`,           lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/industries/switches-electrical-connectors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/industries/microcircuits-electrical-hardware`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/login`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/register`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/terms`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/privacy`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/blog`,               lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  ];

  // Product pages (from static product data) — lazily imported so ye JSON module
  // graph me eagerly na aaye
  const { default: productsData } = await import('@/data/products.json');
  const productPages: MetadataRoute.Sitemap = (productsData as Array<{ id: string; updatedAt: string }>).map((p) => ({
    url: `${BASE}/catalog/${p.id}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Category pages (from static category data)
  const { default: categoriesData } = await import('@/data/categories.json');
  const categoryPages: MetadataRoute.Sitemap = (categoriesData as { fsgCategories: Array<{ id: string; name: string }> }).fsgCategories.map((cat) => ({
    url: `${BASE}/catalog?fsg=cat-${cat.id.split('-')[1]}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Industry pages (from static industry data)
  const industryPages: MetadataRoute.Sitemap = (categoriesData as { industries: Array<{ slug: string }> }).industries
    .filter((ind) => ind.slug)
    .map((ind) => ({
      url: `${BASE}/industries/${ind.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  // Blog posts (fetched from backend at request time)
  let blogPages: MetadataRoute.Sitemap = [];
  let blogCategoryPages: MetadataRoute.Sitemap = [];
  let tagPages: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${API}/blog/sitemap`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    const json = await res.json();
    if (json.success) {
      const { posts, categories, tags } = json.data;

      blogPages = (posts as Array<{ slug: string; updatedAt: string; publishedAt: string }>)
        .filter((p) => p.slug)
        .map((p) => ({
          url: `${BASE}/blog/${p.slug}`,
          lastModified: new Date(p.updatedAt || p.publishedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));

      blogCategoryPages = (categories as Array<{ slug: string }>)
        .filter((c) => c.slug)
        .map((c) => ({
          url: `${BASE}/blog/category/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        }));

      tagPages = (tags as Array<{ slug: string }>)
        .filter((t) => t.slug)
        .map((t) => ({
          url: `${BASE}/blog/tag/${t.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.4,
        }));
    }
  } catch {
    // Backend unavailable — skip blog sitemap entries
  }

  return [...staticPages, ...productPages, ...categoryPages, ...industryPages, ...blogPages, ...blogCategoryPages, ...tagPages];
}
