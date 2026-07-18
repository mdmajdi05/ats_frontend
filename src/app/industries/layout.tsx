import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Industries We Serve | AeroTurbineSpare',
  description: 'AeroTurbineSpare serves aviation, defense, oil & gas, power generation, marine, and medical industries with certified turbine spare parts and MRO components.',
  keywords: 'aerospace industry parts, aviation parts supplier, defense parts distributor, oil gas turbine parts, power generation components, marine turbine parts, military aircraft parts',
  alternates: {
    canonical: 'https://aeroturbinespare.com/industries',
    languages: buildHreflang('/industries'),
  },
  openGraph: {
    title: 'Industries We Serve | AeroTurbineSpare',
    description: 'Serving aviation, defense, oil & gas, power generation, marine, and medical industries with certified parts.',
    url: 'https://aeroturbinespare.com/industries',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industries We Serve | AeroTurbineSpare',
    description: 'Serving aviation, defense, oil & gas, power generation, marine, and medical industries with certified parts.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
