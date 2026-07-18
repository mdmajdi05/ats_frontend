import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} | Gas Turbine Parts Blog`,
    description: `Read expert articles about ${name.toLowerCase()} in the gas turbine and aerospace industry. MRO tips, supply chain insights, and technical guides from AeroTurbineSpare.`,
    alternates: {
      canonical: `https://aeroturbinespare.com/blog/category/${slug}`,
      languages: buildHreflang(`/blog/category/${slug}`),
    },
    openGraph: {
      title: `${name} | AeroTurbineSpare Blog`,
      description: `Expert articles about ${name.toLowerCase()}. Gas turbine parts insights from ISO 9001 & AS9120 certified experts.`,
      url: `https://aeroturbinespare.com/blog/category/${slug}`,
      siteName: 'AeroTurbineSpare',
      type: 'website',
      locale: 'en_US',
      images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | AeroTurbineSpare Blog`,
      description: `Expert articles about ${name.toLowerCase()}.`,
      images: ['/images/og-cover.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export default function BlogCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
