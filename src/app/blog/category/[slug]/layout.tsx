import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return seoMeta({
    title: `${name} | Gas Turbine Parts Blog`,
    description: `Read expert articles about ${name.toLowerCase()} in the gas turbine and aerospace industry. MRO tips, supply chain insights, and technical guides from AeroTurbineSpare.`,
    path: `/blog/category/${slug}`,
    ogDescription: `Expert articles about ${name.toLowerCase()}. Gas turbine parts insights from ISO 9001 & AS9120 certified experts.`,
    twitterDescription: `Expert articles about ${name.toLowerCase()}.`,
  });
}

export default function BlogCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
