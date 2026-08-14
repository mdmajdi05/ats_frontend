import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Gas Turbine Parts RFQ — 24-Hour Quotes',
  description:
    'Get a quote for gas turbine spare parts in 24 hours. GE, Siemens, Rolls-Royce & Solar Turbines. ISO 9001 & AS9120 certified. Submit your RFQ.',
  path: '/rfq',
  keywords: [
    'gas turbine parts RFQ', 'turbine spare parts quote',
    'GE turbine parts price', 'Siemens turbine components quote',
    'aerospace parts RFQ', 'AOG turbine parts request',
    'NSN parts quote', 'turbine blade pricing',
  ],
  ogTitle: 'Gas Turbine Parts RFQ — 24-Hour Quotes',
  ogDescription:
    'Get a quote for gas turbine spare parts within 24 hours. ISO 9001 & AS9120 certified. AOG emergency sourcing.',
  twitterTitle: 'Gas Turbine Parts RFQ',
  twitterDescription: 'Get a quote for gas turbine spare parts within 24 hours. ISO 9001 & AS9120 certified.',
});

export default function RFQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
