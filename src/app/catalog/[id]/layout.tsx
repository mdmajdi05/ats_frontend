import type { Metadata } from 'next';
import { seoMeta, truncateSeo, clampDescription } from '@/lib/seo';
import { SEO_TITLE_MAX } from '@/lib/constants';
import productsJson from '@/data/products/products.json';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:5000/api').replace(/\/$/, '');

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
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // fall through to bundled data
  }
  return (productsJson as Product[]).find((p) => p.id === id) ?? null;
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
      title: 'Part Not Found',
      robots: { index: false, follow: true },
    };
  }

  const title = `${product.partNumber} — ${product.shortDescription || truncateSeo(product.description || '', SEO_TITLE_MAX)}`;
  const description = product.description
    ? clampDescription(product.description)
    : `Buy ${product.partNumber} (${product.manufacturer}) — NSN ${product.nsn}, CAGE ${product.cage}. ${product.stockStatus}. ISO 9001 & AS9120 certified.`;

  const TURBINE_MAKERS = ['GE', 'General Electric', 'Siemens', 'Rolls-Royce', 'Solar', 'Alstom', 'Ansaldo', 'Mitsubishi', 'Pratt & Whitney', 'Nuovo Pignone'];
  const isTurbine = TURBINE_MAKERS.some((m) => product.manufacturer?.toLowerCase().includes(m.toLowerCase()))
    || ['turbine', 'blade', 'bucket', 'nozzle', 'combust', 'liner', 'gas', 'shroud', 'rotor', 'disc'].some((t) => product.category?.toLowerCase().includes(t));

  const keywords = [
    product.partNumber,
    product.nsn,
    product.cage,
    product.manufacturer,
    product.category,
    'aerospace parts',
    'NSN parts',
    'CAGE code parts',
    product.condition === 'New' ? 'new aerospace parts' : 'overhauled aerospace parts',
    ...(isTurbine ? ['gas turbine spare parts', 'turbine components'] : []),
  ];

  return seoMeta({
    title,
    description,
    path: `/catalog/${product.id}`,
    keywords: keywords.join(', '),
    ogImage: product.imageUrl || undefined,
    openGraph: {
      images: product.imageUrl ? [{ url: product.imageUrl, width: 800, height: 600 }] : undefined,
    },
  });
}

export default function CatalogItemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
