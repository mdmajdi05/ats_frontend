import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aerospace Parts Blog & Industry Insights',
  description: 'Expert aerospace procurement guides, MRO best practices, NSN decoding tutorials, AS9120 quality insights, and aviation industry news from AeroTurbineSpare.',
  openGraph: {
    title: 'Aerospace Parts Blog & Industry Insights | AeroTurbineSpare',
    description: 'Expert aerospace procurement guides, MRO best practices, NSN decoding tutorials, and AS9120 quality insights from AeroTurbineSpare.',
    type: 'website',
    url: 'https://aeroturbinespare.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aerospace Parts Blog & Industry Insights | AeroTurbineSpare',
    description: 'Expert aerospace procurement guides, MRO best practices, and NSN decoding tutorials from AeroTurbineSpare.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
