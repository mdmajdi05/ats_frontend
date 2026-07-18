import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Parts Categories',
  description: 'Explore aerospace parts by category. Aero-derivative gas turbines, heavy-duty turbines, hot gas path components, control systems, rotating parts, and more.',
  keywords: 'turbine parts categories, gas turbine components, aero-derivative parts, heavy-duty turbine parts, hot gas path components, turbine control systems, aerospace part categories',
  alternates: {
    canonical: 'https://aeroturbinespare.com/categories',
    languages: buildHreflang('/categories'),
  },
  openGraph: {
    title: 'Parts Categories',
    description: 'Explore aerospace parts by category. Aero-derivative, heavy-duty, hot gas path, controls, and more.',
    url: 'https://aeroturbinespare.com/categories',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parts Categories',
    description: 'Explore aerospace parts by category. Aero-derivative, heavy-duty, hot gas path, controls, and more.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
