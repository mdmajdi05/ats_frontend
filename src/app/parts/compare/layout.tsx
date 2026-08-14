import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Compare Gas Turbine Parts — NSN & Pricing',
  description:
    'Compare gas turbine spare parts by NSN, part number, manufacturer, condition & price. Make the right aerospace sourcing decision with AeroTurbineSpare.',
  path: '/parts/compare',
  keywords: [
    'compare aerospace parts', 'turbine parts comparison',
    'compare NSN parts', 'part number comparison',
    'gas turbine parts side by side', 'aerospace parts comparison tool',
    'compare turbine components', 'parts sourcing comparison',
  ],
});

export default function PartsCompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
