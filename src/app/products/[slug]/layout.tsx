import type { Metadata } from 'next';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:5000/api').replace(/\/$/, '');
const SITE_URL = 'https://aeroturbinespare.com';

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

async function getProductCategory(slug: string): Promise<NavCategory | null> {
  try {
    const res = await fetch(`${API}/nav-categories`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const tree: NavCategoryTree = json.data;
    return tree.productCategories?.find((c) => c.slug === slug) ?? null;
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
  const category = await getProductCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: true },
    };
  }

  const title = category.name;
  const description = category.description
    ? category.description.slice(0, 160)
    : `Browse ${category.name} products and components${category.manufacturer ? ` by ${category.manufacturer}` : ''}. ${category.partCount ?? ''} items available. ISO 9001 & AS9120 certified.`;

  const keywords = [
    category.name,
    'aerospace products',
    'turbine products',
    category.manufacturer || '',
    'gas turbine parts',
    'MRO supplies',
    'NSN parts',
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}/products/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${category.slug}`,
      siteName: 'AeroTurbineSpare',
      type: 'website',
      locale: 'en_US',
      images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-cover.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export default function ProductCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
