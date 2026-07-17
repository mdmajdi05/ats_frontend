import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request for Quote | Gas Turbine Spare Parts RFQ',
  description:
    'Submit an RFQ for gas turbine spare parts. GE, Siemens, Rolls-Royce, Solar Turbines components. 24-hour quote guarantee. ISO 9001 & AS9120 certified. AOG emergency sourcing available. NSN/CAGE-referenced parts.',
  keywords: [
    'gas turbine parts RFQ', 'turbine spare parts quote',
    'GE turbine parts price', 'Siemens turbine components quote',
    'aerospace parts RFQ', 'AOG turbine parts request',
    'NSN parts quote', 'turbine blade pricing',
  ],
  openGraph: {
    title: 'Request for Quote | AeroTurbineSpare',
    description:
      'Get a quote for gas turbine spare parts within 24 hours. ISO 9001 & AS9120 certified. AOG emergency sourcing.',
  },
};

export default function RFQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
