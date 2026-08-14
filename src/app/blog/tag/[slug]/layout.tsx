import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return seoMeta({
    title: `${name} Articles | Aerospace Parts Blog`,
    description: `Browse all articles tagged "${name}" on the AeroTurbineSpare blog. Expert insights on gas turbine parts, MRO, and aerospace supply chain.`,
    path: `/blog/tag/${slug}`,
    ogTitle: `${name} | Gas Turbine Parts Blog`,
    ogDescription: `Browse articles tagged "${name}". Gas turbine parts insights from ISO 9001 & AS9120 certified experts.`,
    twitterTitle: `${name} | Gas Turbine Parts Blog`,
    twitterDescription: `Browse articles tagged "${name}". Gas turbine parts insights.`,
  });
}

export default function BlogTagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
