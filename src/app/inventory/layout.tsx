import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sell Your Excess Inventory | AeroTurbineSpare',
  description: 'Sell surplus aerospace parts to AeroTurbineSpare. Fair market-rate offers within 2 business days. We buy turbine blades, avionics, landing gear & more.',
  keywords: 'sell excess aerospace parts, surplus turbine inventory, sell aircraft parts, aerospace inventory buyer, excess MRO parts, sell surplus aviation components',
  alternates: {
    canonical: 'https://aeroturbinespare.com/inventory',
    languages: buildHreflang('/inventory'),
  },
  openGraph: {
    title: 'Sell Your Excess Inventory | AeroTurbineSpare',
    description: 'Sell surplus aerospace parts and excess inventory. Get fair market-rate offers within 2 business days.',
    url: 'https://aeroturbinespare.com/inventory',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Excess Inventory | AeroTurbineSpare',
    description: 'Sell surplus aerospace parts and excess inventory. Get fair market-rate offers within 2 business days.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
