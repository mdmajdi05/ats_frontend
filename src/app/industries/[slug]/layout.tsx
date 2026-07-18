import type { Metadata } from 'next';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:5000/api').replace(/\/$/, '');
const SITE_URL = 'https://aeroturbinespare.com';

interface Industry {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/industries?limit=50`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const industries = json.data ?? [];
    return industries.map((ind: { slug: string }) => ({ slug: ind.slug }));
  } catch {
    return [];
  }
}

async function getIndustry(slug: string): Promise<Industry | null> {
  try {
    const res = await fetch(`${API}/industries/${slug}`, {
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) {
    return {
      title: 'Industry Not Found',
      robots: { index: false, follow: true },
    };
  }

  const title = `${industry.name} Parts & Components`;
  const description = industry.description
    ? industry.description.slice(0, 160)
    : `Source certified ${industry.name} spare parts and components. NSN/CAGE-referenced, ISO 9001 & AS9120 certified. 24-hour quote response.`;

  const keywords = [
    `${industry.name} parts`,
    `${industry.name} spare parts`,
    `${industry.name} components`,
    'aerospace parts supplier',
    'turbine parts',
    'gas turbine components',
    'NSN parts',
    'MRO supplies',
  ];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}/industries/${industry.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/industries/${industry.slug}`,
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

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
