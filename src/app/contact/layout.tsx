import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | AeroTurbineSpare Gas Turbine Parts Supplier',
  description:
    'Contact AeroTurbineSpare for gas turbine spare parts inquiries. Call +91 9354764587, email sales@aeroturbinespare.com, or submit an RFQ online. AOG emergency line available 24/7. 24-hour quote guarantee.',
  keywords: [
    'contact turbine parts supplier', 'gas turbine parts inquiry',
    'AOG turbine parts', 'emergency turbine component sourcing',
    'turbine spare parts RFQ', 'GE turbine parts contact',
    'Siemens turbine parts quote', 'aerospace parts supplier contact',
  ],
  openGraph: {
    title: 'Contact Us | AeroTurbineSpare',
    description:
      'Get in touch for gas turbine spare parts. 24-hour quote response. AOG emergency line 24/7. ISO 9001 & AS9120 certified.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
