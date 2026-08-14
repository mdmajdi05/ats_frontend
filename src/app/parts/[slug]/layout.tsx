import type { Metadata } from 'next';
import { seoMeta, clampDescription } from '@/lib/seo';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:5000/api').replace(/\/$/, '');

interface NavCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  manufacturer?: string;
  partCount?: number;
}

interface NavCategoryTree {
  partCategories: NavCategory[];
  productCategories: NavCategory[];
}

async function getPartCategory(slug: string): Promise<NavCategory | null> {
  try {
    const res = await fetch(`${API}/nav-categories`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const tree: NavCategoryTree = json.data;
    return tree.partCategories?.find((c) => c.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPartCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: true },
    };
  }

  const title = category.name;
  const description = category.description
    ? clampDescription(category.description)
    : `Browse ${category.name} parts and components${category.manufacturer ? ` by ${category.manufacturer}` : ''}. ${category.partCount ?? ''} items available. ISO 9001 & AS9120 certified.`;

  const isTurbineCategory = !category.slug.startsWith('av-');

  const keywords = [
    category.name,
    'aerospace parts',
    ...(isTurbineCategory ? ['turbine parts', 'gas turbine components'] : []),
    category.manufacturer || '',
    'NSN parts',
    'CAGE code',
    'MRO parts',
  ].filter(Boolean);

  return seoMeta({
    title,
    description,
    path: `/parts/${category.slug}`,
    keywords: keywords.join(', '),
  });
}

export default function PartCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
