import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Gas Turbine Spare Parts Catalog | GE, Siemens, Rolls-Royce Parts',
  description:
    'Browse 5 Million+ gas turbine spare parts. GE LM2500, LM6000, Frame parts. Siemens turbines. Rolls-Royce components. Solar Turbines parts. NSN/CAGE-referenced. ISO 9001 & AS9120 certified. Worldwide shipping.',
  keywords: [
    'gas turbine parts catalog', 'GE turbine parts inventory',
    'Siemens turbine spare parts', 'Rolls-Royce turbine components',
    'Solar Turbines parts catalog', 'LM2500 parts',
    'LM6000 turbine blades', 'GE Frame turbine parts',
    'NSN turbine parts', 'CAGE code parts',
  ],
  openGraph: {
    title: 'Gas Turbine Parts Catalog | AeroTurbineSpare',
    description:
      '5 Million+ certified gas turbine parts. GE, Siemens, Rolls-Royce, Solar Turbines. NSN/CAGE-referenced. 24-hour quotes.',
  },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
