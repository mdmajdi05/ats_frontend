import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} Articles | Aerospace Parts Blog`,
    description: `Browse all articles tagged "${name}" on the AeroTurbineSpare blog. Expert insights on gas turbine parts, MRO, and aerospace supply chain.`,
    alternates: {
      canonical: `https://aeroturbinespare.com/blog/tag/${slug}`,
      languages: buildHreflang(`/blog/tag/${slug}`),
    },
    openGraph: {
      title: `${name} | AeroTurbineSpare Blog`,
      description: `Browse articles tagged "${name}". Gas turbine parts insights from ISO 9001 & AS9120 certified experts.`,
      url: `https://aeroturbinespare.com/blog/tag/${slug}`,
      siteName: 'AeroTurbineSpare',
      type: 'website',
      locale: 'en_US',
      images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | AeroTurbineSpare Blog`,
      description: `Browse articles tagged "${name}". Gas turbine parts insights.`,
      images: ['/images/og-cover.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export default function BlogTagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
