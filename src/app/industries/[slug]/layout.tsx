import type { Metadata } from 'next';
import { seoMeta, clampDescription } from '@/lib/seo';
import industriesJson from '@/data/industries/industries.json';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:5000/api').replace(/\/$/, '');

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
    if (res.ok) {
      const json = await res.json();
      const industries = json.data ?? [];
      if (industries.length) return industries.map((ind: { slug: string }) => ({ slug: ind.slug }));
    }
  } catch { /* fall through to bundled data */ }
  return (industriesJson as Industry[]).map((ind) => ({ slug: ind.slug }));
}

async function getIndustry(slug: string): Promise<Industry | null> {
  try {
    const res = await fetch(`${API}/industries/${slug}`, {
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
  return (industriesJson as Industry[]).find((i) => i.slug === slug) ?? null;
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
    ? clampDescription(industry.description)
    : `Source certified ${industry.name} spare parts and components. NSN/CAGE-referenced, ISO 9001 & AS9120 certified. 24-hour quote response.`;

  const TURBINE_INDUSTRIES = ['power-generation', 'oil-gas', 'utilities-cogeneration', 'industrial-manufacturing'];
  const isTurbine = TURBINE_INDUSTRIES.includes(industry.slug);

  const keywords = [
    `${industry.name} parts`,
    `${industry.name} spare parts`,
    `${industry.name} components`,
    'aerospace parts supplier',
    ...(isTurbine ? ['turbine parts', 'gas turbine components'] : []),
    'NSN parts',
    'MRO supplies',
  ];

  return seoMeta({
    title,
    description,
    path: `/industries/${industry.slug}`,
    keywords: keywords.join(', '),
  });
}

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
