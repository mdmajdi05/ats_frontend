import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Gas Turbine Parts — All Categories',
  description: 'Explore aerospace and gas turbine parts by category. Aero-derivative & heavy-duty turbines, hot gas path components, control systems, rotating parts & more.',
  path: '/categories',
  keywords: 'turbine parts categories, gas turbine components, aero-derivative parts, heavy-duty turbine parts, hot gas path components, turbine control systems, aerospace part categories',
  ogDescription: 'Explore aerospace parts by category. Aero-derivative, heavy-duty, hot gas path, controls, and more.',
});

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
