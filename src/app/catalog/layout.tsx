import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Parts Catalog',
  description: 'Browse 5 million+ certified aerospace parts by NSN, CAGE code, or part number. GE, Siemens & Rolls-Royce parts in stock.',
  keywords: 'aerospace parts catalog, NSN parts search, CAGE code lookup, turbine parts catalog, GE parts, Siemens parts, gas turbine spare parts, MRO parts catalog, aviation parts distributor',
  alternates: {
    canonical: 'https://aeroturbinespare.com/catalog',
    languages: buildHreflang('/catalog'),
  },
  openGraph: {
    title: 'Parts Catalog',
    description: 'Browse 5 million+ certified aerospace parts. Search by NSN, CAGE code, part number, or manufacturer.',
    url: 'https://aeroturbinespare.com/catalog',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parts Catalog',
    description: 'Browse 5 million+ certified aerospace parts. Search by NSN, CAGE code, part number, or manufacturer.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
