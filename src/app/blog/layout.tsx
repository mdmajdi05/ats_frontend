import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Gas Turbine Parts Blog — MRO Insights',
  description:
    'Expert articles on gas turbine parts, MRO best practices & supply chain intelligence. ISO 9001 & AS9120 certified insights from AeroTurbineSpare. Read now.',
  path: '/blog',
  keywords: [
    'gas turbine blog', 'aerospace parts news', 'MRO best practices',
    'turbine spare parts insights', 'aviation supply chain', 'GE turbine maintenance',
    'Siemens turbine news', 'turbine industry updates', 'aerospace procurement tips',
    'gas turbine parts sourcing', 'turbine MRO blog', 'aerospace parts blog',
  ],
  ogDescription:
    'Expert articles on gas turbine spare parts, MRO best practices, and supply chain intelligence.',
  twitterDescription: 'Expert articles on gas turbine spare parts, MRO, and supply chain intelligence.',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
