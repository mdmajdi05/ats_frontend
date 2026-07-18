import type { Metadata } from 'next';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');
const SITE_URL = 'https://aeroturbinespare.com';

interface Product {
  id: string;
  partNumber: string;
  description: string;
  shortDescription: string;
  manufacturer: string;
  nsn: string;
  cage: string;
  category: string;
  condition: string;
  stockStatus: string;
  unitPrice: number;
  currency: string;
  imageUrl?: string;
  fsg: string;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/products/${id}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Part Not Found | AeroTurbineSpare',
      robots: { index: false, follow: true },
    };
  }

  const title = `${product.partNumber} — ${product.shortDescription || product.description?.slice(0, 80)} | AeroTurbineSpare`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.partNumber} (${product.manufacturer}) — NSN ${product.nsn}, CAGE ${product.cage}. ${product.stockStatus}. ISO 9001 & AS9120 certified.`;

  const keywords = [
    product.partNumber,
    product.nsn,
    product.cage,
    product.manufacturer,
    product.category,
    'aerospace parts',
    'turbine spare parts',
    'gas turbine components',
    'NSN parts',
    'CAGE code parts',
    product.condition === 'New' ? 'new aerospace parts' : 'overhauled aerospace parts',
  ];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}/catalog/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/catalog/${product.id}`,
      siteName: 'AeroTurbineSpare',
      type: 'website',
      locale: 'en_US',
      images: product.imageUrl
        ? [{ url: product.imageUrl, width: 800, height: 600 }]
        : [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : ['/images/og-cover.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export default function CatalogItemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
