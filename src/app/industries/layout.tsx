import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Industries We Serve — Power, Oil & Gas',
  description: 'AeroTurbineSpare serves aviation, defense, oil & gas, power generation, and marine industries with certified gas turbine spare parts and MRO components.',
  path: '/industries',
  keywords: 'aerospace industry parts, aviation parts supplier, defense parts distributor, oil gas turbine parts, power generation components, marine turbine parts, military aircraft parts',
  ogDescription: 'Serving aviation, defense, oil & gas, power generation, marine, and medical industries with certified parts.',
});

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
