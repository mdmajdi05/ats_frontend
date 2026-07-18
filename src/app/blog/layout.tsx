import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Gas Turbine Parts Blog',
  description:
    'Expert articles on gas turbine parts, MRO best practices & supply chain intelligence. ISO 9001 & AS9120 certified insights from AeroTurbineSpare. Read now.',
  keywords: [
    'gas turbine blog', 'aerospace parts news', 'MRO best practices',
    'turbine spare parts insights', 'aviation supply chain', 'GE turbine maintenance',
    'Siemens turbine news', 'turbine industry updates', 'aerospace procurement tips',
    'gas turbine parts sourcing', 'turbine MRO blog', 'aerospace parts blog',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/blog',
    languages: buildHreflang('/blog'),
  },
  openGraph: {
    title: 'Gas Turbine Parts Blog',
    description:
      'Expert articles on gas turbine spare parts, MRO best practices, and supply chain intelligence.',
    url: 'https://aeroturbinespare.com/blog',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Parts Blog',
    description: 'Expert articles on gas turbine spare parts, MRO, and supply chain intelligence.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
