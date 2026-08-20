import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an AeroTurbineSpare Account',
  description:
    'Create your AeroTurbineSpare account to request certified gas turbine spare parts quotes, track RFQs, and access ISO 9001 & AS9120 documentation.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
