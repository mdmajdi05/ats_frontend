import type { Metadata } from 'next';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact AeroTurbineSpare for parts inquiries, RFQs & AOG emergencies. Phone, email, or form. Our procurement specialists respond within 24 hours. Call now.',
  keywords: 'contact aerospace parts supplier, AOG emergency parts, turbine parts inquiry, RFQ submission, aerospace procurement contact, AeroTurbineSpare phone number',
  alternates: {
    canonical: 'https://aeroturbinespare.com/contact',
    languages: buildHreflang('/contact'),
  },
  openGraph: {
    title: 'Contact Us',
    description: 'Reach our aerospace procurement specialists for parts inquiries, RFQ submissions, and AOG emergency assistance.',
    url: 'https://aeroturbinespare.com/contact',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us',
    description: 'Reach our aerospace procurement specialists for parts inquiries, RFQ submissions, and AOG emergency assistance.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
