import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industries We Serve | Gas Turbine Parts for Aviation, Military, Marine',
  description:
    'AeroTurbineSpare supplies gas turbine spare parts to commercial aviation, military defense, marine propulsion, power generation, oil & gas, and industrial sectors. GE, Siemens, Rolls-Royce, Solar Turbines parts. ISO 9001 & AS9120 certified. 150+ countries.',
  keywords: [
    'gas turbine parts supplier', 'aerospace parts by industry',
    'aviation turbine components', 'military defense turbine parts',
    'marine gas turbine spares', 'power generation turbine parts',
    'oil gas turbine components', 'industrial turbine spare parts',
    'GE turbine parts', 'Siemens turbine components',
    'Rolls-Royce spare parts', 'Solar Turbines parts',
  ],
  openGraph: {
    title: 'Industries We Serve | AeroTurbineSpare',
    description:
      'Gas turbine spare parts for aviation, military, marine, power generation, oil & gas. ISO 9001 & AS9120 certified. 5 Million+ parts. 150+ countries.',
  },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
