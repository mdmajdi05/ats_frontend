import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Cross-Reference Tool — Find Interchangeable Parts',
  description:
    'Find interchangeable aerospace & gas turbine parts by part number, NSN, or CAGE code. Search 2,200+ verified parts and their OEM cross-references to identify equivalents.',
  path: '/cross-reference',
  keywords: [
    'part cross reference', 'interchangeable parts lookup',
    'turbine part cross reference', 'OEM equivalent parts',
    'NSN cross reference', 'CAGE code lookup',
    'gas turbine parts search', 'aerospace parts interchangeability',
  ],
});

export default function CrossReferenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}