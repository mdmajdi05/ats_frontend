import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Sell Excess Aerospace & Turbine Parts',
  description: 'Sell surplus aerospace parts to AeroTurbineSpare. Fair market-rate offers within 2 business days. We buy turbine blades, avionics, landing gear & more.',
  path: '/inventory',
  keywords: 'sell excess aerospace parts, surplus turbine inventory, sell aircraft parts, aerospace inventory buyer, excess MRO parts, sell surplus aviation components',
  ogDescription: 'Sell surplus aerospace parts and excess inventory. Get fair market-rate offers within 2 business days.',
});

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
