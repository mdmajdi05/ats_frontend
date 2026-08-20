import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to Your AeroTurbineSpare Account',
  description:
    'Sign in to your AeroTurbineSpare account to request quotes, track RFQs, download certifications, and manage gas turbine spare parts sourcing.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
