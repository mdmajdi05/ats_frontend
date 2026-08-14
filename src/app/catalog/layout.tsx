import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Aerospace Parts Catalog — 5M+ NSN & CAGE',
  description: 'Browse 5 million+ certified aerospace parts by NSN, CAGE code, or part number. GE, Siemens & Rolls-Royce gas turbine parts in stock. 24-hour quotes.',
  path: '/catalog',
  keywords: 'aerospace parts catalog, NSN parts search, CAGE code lookup, turbine parts catalog, GE parts, Siemens parts, gas turbine spare parts, MRO parts catalog, aviation parts distributor',
  ogDescription: 'Browse 5 million+ certified aerospace parts. Search by NSN, CAGE code, part number, or manufacturer.',
});

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
