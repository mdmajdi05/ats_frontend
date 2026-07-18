import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'AeroTurbineSpare terms and conditions for gas turbine spare parts procurement and platform use.',
  openGraph: {
    title: 'Terms & Conditions',
    description:
      'AeroTurbineSpare terms and conditions for gas turbine parts procurement.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
