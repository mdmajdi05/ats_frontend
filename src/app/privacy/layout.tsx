import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how AeroTurbineSpare collects, uses, and protects your personal data. GDPR compliant.',
  openGraph: {
    title: 'Privacy Policy',
    description:
      'Learn how AeroTurbineSpare collects, uses, and protects your personal data.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
