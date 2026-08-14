import type { Metadata } from 'next';
import { seoMeta } from '@/lib/seo';

export const metadata: Metadata = seoMeta({
  title: 'Contact Us — Parts RFQ & AOG Support',
  description: 'Contact AeroTurbineSpare for gas turbine parts inquiries, RFQs & AOG emergencies. Phone, email, or form. Our procurement specialists respond within 24 hours.',
  path: '/contact',
  keywords: 'contact aerospace parts supplier, AOG emergency parts, turbine parts inquiry, RFQ submission, aerospace procurement contact, AeroTurbineSpare phone number',
  ogDescription: 'Reach our aerospace procurement specialists for parts inquiries, RFQ submissions, and AOG emergency assistance.',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
