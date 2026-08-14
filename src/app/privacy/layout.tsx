import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the AeroTurbineSpare privacy policy covering data collection, EAR & ITAR export compliance, cookie usage, and how we protect your procurement and RFQ data.',
  openGraph: {
    title: 'Privacy Policy — AeroTurbineSpare',
    description:
      'How AeroTurbineSpare collects, uses, and protects your data. GDPR compliant, EAR & ITAR export compliance.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
