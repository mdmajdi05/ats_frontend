import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'AeroTurbineSpare terms and conditions for gas turbine spare parts procurement, sales, returns, and EAR & ITAR export compliance.',
  openGraph: {
    title: 'Terms & Conditions — AeroTurbineSpare',
    description:
      'AeroTurbineSpare terms and conditions for gas turbine parts procurement and EAR & ITAR export compliance.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
