import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Request for Quote | Gas Turbine Spare Parts RFQ',
  description:
    'Get a quote for gas turbine spare parts in 24 hours. GE, Siemens, Rolls-Royce, Solar Turbines. ISO 9001 & AS9120 certified. AOG emergency sourcing. Submit your RFQ.',
  keywords: [
    'gas turbine parts RFQ', 'turbine spare parts quote',
    'GE turbine parts price', 'Siemens turbine components quote',
    'aerospace parts RFQ', 'AOG turbine parts request',
    'NSN parts quote', 'turbine blade pricing',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/rfq',
    languages: buildHreflang('/rfq'),
  },
  openGraph: {
    title: 'Request for Quote | AeroTurbineSpare',
    description:
      'Get a quote for gas turbine spare parts within 24 hours. ISO 9001 & AS9120 certified. AOG emergency sourcing.',
    url: 'https://aeroturbinespare.com/rfq',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request for Quote | AeroTurbineSpare',
    description: 'Get a quote for gas turbine spare parts within 24 hours. ISO 9001 & AS9120 certified.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RFQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
