import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an AeroTurbineSpare account to start sourcing aerospace parts.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
