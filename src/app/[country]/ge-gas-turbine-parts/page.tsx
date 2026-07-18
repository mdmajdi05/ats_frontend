import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Clock, Award, Globe, PackageSearch, FileCheck, ChevronRight, ArrowRight, Search, CheckCircle, Plane, Cog, Gauge, Fuel, Wind, Flame, Filter, Wind as TurbineIcon, Boxes, Droplet } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'GE Gas Turbine Spare Parts — Frames 3–9H, LM2500 & LM6000',
  description: 'Source GE gas turbine spare parts for Frame 3, 5, 6B, 7E, 7EA, 7FA, 9E, 9FA, LM2500 & LM6000. 5M+ NSN/CAGE parts. ISO 9001 & AS9120 certified. 24-hour quotes.',
  keywords: [
    'GE gas turbine parts', 'GE Frame spare parts',
    'GE turbine components', 'GE heavy duty gas turbine',
    'GE aeroderivative parts', 'GE Frame 7FA parts',
    'GE Frame 6B parts', 'GE LM2500 parts',
    'GE LM6000 parts', 'GE Speedtronic parts',
    'GE gas turbine buckets', 'GE combustion liners',
    'GE transition pieces', 'GE fuel nozzles',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/ge-gas-turbine-parts',
    languages: buildHreflang('/ge-gas-turbine-parts'),
  },
  openGraph: {
    title: 'GE Gas Turbine Spare Parts — Frames 3–9H, LM2500 & LM6000',
    description: '5M+ GE gas turbine parts. Frames 3–9FA. ISO 9001/AS9120 certified. 24-hour quotes. Worldwide shipping.',
    url: 'https://aeroturbinespare.com/ge-gas-turbine-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GE Gas Turbine Spare Parts — Frames 3–9H, LM2500 & LM6000',
    description: '5M+ GE gas turbine parts. Frames 3–9FA. ISO 9001/AS9120 certified. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const GE_FRAMES = [
  {
    model: 'Frame 3',
    power: '10–14 MW',
    applications: 'Mechanical drive, power generation',
    parts: ['Compressor Blades & Vanes', 'Turbine Buckets & Nozzles', 'Combustion Liners & Cross-Fire Tubes', 'Fuel Nozzles & Atomizers', 'Transition Pieces', 'Bearings & Seals', 'Speedtronic Mark I–II Control Cards', 'Lube Oil Pumps & Filters'],
  },
  {
    model: 'Frame 5',
    power: '18–30 MW',
    applications: 'Pipeline compression, industrial CHP',
    parts: ['Compressor Rotor & Stator Blades', 'Stage 1–3 Turbine Buckets', 'Combustion Liners & End Covers', 'Cross-Fire Tubes & Retaining Rings', 'Transition Pieces', 'Fuel Nozzle Assemblies', 'Speedtronic Mark II–IV Controls', 'Hydraulic Servo Valves'],
  },
  {
    model: 'Frame 6B',
    power: '35–42 MW',
    applications: 'Cogeneration, district heating, offshore',
    parts: ['Compressor Variable Guide Vanes', 'Turbine Nozzles & Shrouds', 'DLN Combustion Liners', 'Fuel Nozzles & Premixers', 'Transition Pieces', 'Spark Plugs & Flame Detectors', 'Mark V–VI Control Modules', 'Torque Converter Parts'],
  },
  {
    model: 'Frame 7E',
    power: '70–85 MW',
    applications: 'Combined cycle, peaking plants',
    parts: ['Compressor Blades & Discs', 'Turbine Buckets (Stage 1–3)', 'Combustion Liners & Flow Sleeves', 'Fuel Nozzles & End Covers', 'Transition Pieces', 'Mark V–VI Speedtronic Cards', 'Generator Excitation Parts', 'Inlet Guide Vanes'],
  },
  {
    model: 'Frame 7EA',
    power: '75–85 MW',
    applications: 'Base load, combined cycle',
    parts: ['Compressor Stationary & Rotating Blades', 'Turbine Buckets & Nozzle Assemblies', 'DLN 2.0 Combustion Hardware', 'Fuel Nozzles & Gas Meters', 'Transition Pieces & Liners', 'Mark V–VIe Control Systems', 'Hydraulic Actuators & Servos', 'Lube Oil Coolers & Pumps'],
  },
  {
    model: 'Frame 7FA',
    power: '160–180 MW',
    applications: 'Large combined cycle, 60 Hz markets',
    parts: ['Compressor Blades & Vanes', 'Turbine Stage 1–3 Buckets & Nozzles', 'DLN 2.6+ Combustion Liners', 'Fuel Nozzle Assemblies', 'Transition Pieces', 'Mark VI–VIe Control Modules', 'Bearing & Seal Kits', 'Generator Hydrogen Seals'],
  },
  {
    model: 'Frame 9E',
    power: '100–130 MW',
    applications: '50 Hz power generation, industrial',
    parts: ['Compressor Blades & Stators', 'Turbine Buckets (Stage 1–4)', 'Combustion Liners & End Caps', 'Fuel Nozzles & Gas Control Valves', 'Transition Pieces', 'Mark V–VI Speedtronic Parts', 'Lube Oil System Components', 'Hydraulic Power Units'],
  },
  {
    model: 'Frame 9FA',
    power: '250–270 MW',
    applications: 'Large 50 Hz combined cycle',
    parts: ['Compressor Rotor Blades & Vanes', 'Stage 1–3 Turbine Buckets & Nozzles', 'DLN 2.6 Combustion Liners', 'Fuel Nozzles & Premix Tubes', 'Transition Pieces & Impingement Sleeves', 'Mark VIe Control System', 'Generator Rotor & Stator Parts', 'Exhaust Thermocouples'],
  },
  {
    model: 'Frame 9HA',
    power: '400–570 MW',
    applications: 'HA-class combined cycle, 50 Hz',
    parts: ['Compressor Blades & Variable Vanes', 'Turbine Buckets & Shrouds', 'DLN 2.6e Combustion Hardware', 'Fuel Nozzles & End Covers', 'Transition Pieces', 'Mark VIe Control Modules', 'Bearing & Vibration Probes', 'Hydraulic Skid Components'],
  },
];

const GE_AERODERIVATIVES = [
  {
    model: 'LM2500',
    power: '23–35 MW',
    derived: 'CF6-6 / TF39',
    applications: 'Marine propulsion, power generation, pipeline',
    parts: ['Compressor Rotor & Stator Blades', 'Turbine Nozzles & Buckets', 'Fuel Nozzles & Manifolds', 'Combustion Liners & Cross-Over Tubes', 'Bearings & Seals', 'Main Fuel Control & HMU', 'Ignition Exciters & Leads', 'Lube & Scavenge Pumps', 'Thermocouple Harnesses', 'FADEC & Electronic Controls'],
  },
  {
    model: 'LM6000',
    power: '40–56 MW',
    derived: 'CF6-80C2 / CF6-80E',
    applications: 'Aeroderivative power plants, peaking',
    parts: ['Compressor Blades & Variable Inlet Guide Vanes', 'HPT & LPT Nozzles & Blades', 'DAC Combustion Liners & Fuel Nozzles', 'Bearings & Carbon Seals', 'Fuel Metering Valves & Actuators', 'Main Fuel Pump & HMU', 'Ignition System Components', 'Oil Coolers & Filters', 'Digital Control System Parts', 'Starter Motors & Generators'],
  },
  {
    model: 'LM1600',
    power: '13–15 MW',
    derived: 'F404',
    applications: 'Marine, industrial power, pipeline',
    parts: ['Compressor Blades & Vanes', 'Turbine Rotor & Stator Assemblies', 'Annular Combustor Liners', 'Fuel Nozzles & Spray Bars', 'Bearings & Seals', 'Fuel Control Unit & Accessories', 'Ignition Exciters & Leads', 'Oil Pumps & Filters', 'Starter/Genset Parts', 'Electronic Control Modules'],
  },
  {
    model: 'LMS100',
    power: '100 MW',
    derived: 'CF6 / LM6000 hybrid',
    applications: 'Intermediate & peaking power',
    parts: ['LP & HP Compressor Blades & Vanes', 'HPT & IPT Nozzles & Buckets', 'Can-Annular Combustor Hardware', 'Fuel Nozzles & Manifolds', 'Intercooler Core Parts', 'Bearings & Labyrinth Seals', 'Fuel Control System Parts', 'Lube Oil System Components', 'Borescope Plugs & Access Covers', 'Control System Modules'],
  },
];

const ADVANTAGES = [
  {
    icon: Shield,
    title: 'Zero Counterfeit Policy',
    description: 'Every GE part is verified against OEM specifications with full chain-of-custody documentation. We never compromise on authenticity, even under AOG pressure.',
  },
  {
    icon: Clock,
    title: '24-Hour Quote Response',
    description: 'Submit an RFQ for any GE frame part and receive a competitive quote within 24 hours. Emergency outage requests get priority same-day turnaround.',
  },
  {
    icon: Award,
    title: 'CAGE Code 8ATR9',
    description: 'Registered with the U.S. DoD for direct government and defense contractor transactions. Your assurance of a verified, audited supplier.',
  },
  {
    icon: FileCheck,
    title: 'ISO 9001:2015 & AS9120 Rev B',
    description: 'Independently certified quality management for aerospace and defense distribution. Scope covers procurement, inspection, storage, and global logistics.',
  },
  {
    icon: PackageSearch,
    title: '5M+ Parts Inventory',
    description: 'Access to over 5 million line items including new, overhauled, and refurbished GE turbine components. In-stock parts ship same day from our Doral, FL warehouse.',
  },
  {
    icon: Globe,
    title: 'Direct Trader Access',
    description: 'You get a dedicated account manager who knows your platforms and procurement history. No call centers, no runaround — direct access to your trader.',
  },
];

const PART_CATEGORIES = [
  { label: 'Hot Gas Path', icon: Flame, parts: 'Buckets, nozzles, shrouds, seal segments' },
  { label: 'Combustion', icon: Filter, parts: 'Liners, end caps, cross-fire tubes, flow sleeves' },
  { label: 'Compressor', icon: Wind, parts: 'Blades, vanes, discs, stators, variable guide vanes' },
  { label: 'Controls & I&C', icon: Gauge, parts: 'Speedtronic Mark I–VIe, sensors, thermocouples, servo valves' },
  { label: 'Fuel Systems', icon: Fuel, parts: 'Fuel nozzles, atomizers, gas control valves, manifolds' },
  { label: 'Rotors & Bearings', icon: Cog, parts: 'Turbine rotors, bearing assemblies, seals, couplings' },
  { label: 'Lube Oil & Hydraulics', icon: Droplet, parts: 'Pumps, filters, coolers, servo valves, actuators' },
  { label: 'Enclosures & Accessories', icon: Boxes, parts: 'Inlet housings, exhaust diffusers, enclosures, ducts' },
];

const siteUrl = 'https://aeroturbinespare.com';

const geSchemas: Record<string, unknown>[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'GE Gas Turbine Spare Parts',
    description: 'Certified GE gas turbine spare parts for Frame 3, 5, 6B, 7E, 7EA, 7FA, 9E, 9FA, 9HA, LM2500, LM6000, LM1600, and LMS100 platforms. Hot gas path, combustion, compressor, and control system components.',
    brand: {
      '@type': 'Brand',
      name: 'GE Gas Turbine',
    },
    category: 'Gas Turbine Spare Parts',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offeredBy: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: siteUrl,
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GE Gas Turbine Spare Parts — Frames 3–9H, LM2500 & LM6000',
    description: 'Source GE gas turbine spare parts for all major frames and aeroderivative platforms. ISO 9001 & AS9120 certified. 24-hour quotes.',
    url: `${siteUrl}/ge-gas-turbine-parts`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'GE Gas Turbine Parts', item: `${siteUrl}/ge-gas-turbine-parts` },
      ],
    },
    mainEntity: {
      '@type': 'Service',
      serviceType: 'GE Gas Turbine Spare Parts Sourcing & Supply',
      provider: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: siteUrl,
      },
      areaServed: 'Worldwide',
    },
  },
];

export default async function GEGasTurbinePartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'GE Gas Turbine Parts', url: `${prefix || ''}/ge-gas-turbine-parts` },
      ]} />

      <main id="main-content" className="flex-1">
        <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#1E1B4B] to-[#312E81]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 text-[#818CF8] text-sm font-semibold uppercase tracking-wider mb-4">
                <span className="w-6 h-px bg-[#818CF8]" />
                GE Gas Turbine Parts
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                GE Gas Turbine Spare Parts — Frames 3–9H, LM2500 &amp; LM6000
              </h1>
              <p className="text-[#C0C9D5] text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
                Certified GE gas turbine spare parts for heavy-duty frames and aeroderivative engines. Hot gas path, combustion, compressor, and control components. ISO 9001:2015 &amp; AS9120 Rev B certified. CAGE 8ATR9.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={`${prefix}/rfq`}>
                  <Button variant="blue" size="lg">
                    Request a Quote <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#frame-table">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
                    Browse Frames <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="frame-table" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-[#4F46E5]" />
                GE Heavy-Duty Frames
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
                Complete GE Frame Coverage
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                Every GE heavy-duty gas turbine frame from the legacy Frame 3 to the latest HA-class. We stock and source buckets, nozzles, combustion hardware, control cards, and rotating components.
              </p>
            </div>
            <div className="space-y-4">
              {GE_FRAMES.map((frame) => (
                <div key={frame.model} className="bg-[#F8F9FF] border border-[#E8EDF2] rounded-2xl overflow-hidden hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-200">
                  <details className="group">
                    <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                          <TurbineIcon className="w-5 h-5 text-[#4F46E5]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0A1628]">{frame.model}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4A4A6A] mt-0.5">
                            <span>{frame.power}</span>
                            <span className="text-[#E8EDF2]">|</span>
                            <span>{frame.applications}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#4F46E5]">
                        <span className="hidden sm:inline">{frame.parts.length} part categories</span>
                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                      </div>
                    </summary>
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-[#E8EDF2] pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {frame.parts.map((part) => (
                          <div key={part} className="flex items-center gap-2 text-sm text-[#4A4A6A] p-2 rounded-lg hover:bg-white">
                            <CheckCircle className="w-3.5 h-3.5 text-[#4F46E5] flex-shrink-0" />
                            <span>{part}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E8EDF2] flex justify-end">
                        <a href={`${prefix}/catalog?search=${encodeURIComponent(frame.model)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline">
                          <Search className="w-3 h-3" />
                          Search {frame.model} parts in catalog
                        </a>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-[#4F46E5]" />
                Why Choose AeroTurbineSpare
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
                Trusted for GE Gas Turbine Parts
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                Power generation, oil &amp; gas, and marine operators worldwide rely on us for certified GE turbine components. Here is why.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADVANTAGES.map((adv) => {
                const Icon = adv.icon;
                return (
                  <div key={adv.title} className="bg-white border border-[#E8EDF2] rounded-2xl p-6 hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0A1628] mb-2">{adv.title}</h3>
                    <p className="text-sm text-[#4A4A6A] leading-relaxed">{adv.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-[#4F46E5]" />
                GE Aeroderivative Parts
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
                LM2500, LM6000, LM1600 &amp; LMS100
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                Comprehensive parts for GE aeroderivative gas turbines used in marine propulsion, power generation, and pipeline compression.
              </p>
            </div>
            <div className="space-y-6">
              {GE_AERODERIVATIVES.map((engine) => (
                <div key={engine.model} className="bg-[#F8F9FF] border border-[#E8EDF2] rounded-2xl overflow-hidden hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-200">
                  <details className="group">
                    <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                          <Plane className="w-5 h-5 text-[#4F46E5]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0A1628]">{engine.model}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4A4A6A] mt-0.5">
                            <span>{engine.power}</span>
                            <span className="text-[#E8EDF2]">|</span>
                            <span>Derived from {engine.derived}</span>
                            <span className="text-[#E8EDF2]">|</span>
                            <span>{engine.applications}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#4F46E5]">
                        <span className="hidden sm:inline">{engine.parts.length} part categories</span>
                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                      </div>
                    </summary>
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-[#E8EDF2] pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {engine.parts.map((part) => (
                          <div key={part} className="flex items-center gap-2 text-sm text-[#4A4A6A] p-2 rounded-lg hover:bg-white">
                            <CheckCircle className="w-3.5 h-3.5 text-[#4F46E5] flex-shrink-0" />
                            <span>{part}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E8EDF2] flex justify-end">
                        <a href={`${prefix}/catalog?search=${encodeURIComponent(engine.model)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline">
                          <Search className="w-3 h-3" />
                          Search {engine.model} parts in catalog
                        </a>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-[#4F46E5]" />
                Parts Categories
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
                GE Turbine Component Categories
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                From hot gas path to control systems, we cover every major component category for GE gas turbines.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PART_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="bg-white border border-[#E8EDF2] rounded-2xl p-6 hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-200 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <h3 className="font-bold text-[#0A1628] text-sm mb-1">{cat.label}</h3>
                    <p className="text-xs text-[#4A4A6A] leading-relaxed">{cat.parts}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-[#0A1628] via-[#1E1B4B] to-[#312E81] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <pattern id="cta-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Need a GE Gas Turbine Part?
            </h2>
            <p className="text-[#C0C9D5] text-lg mb-8 max-w-2xl mx-auto">
              Whether you need a Stage 1 bucket for a Frame 7FA, a fuel nozzle for a LM6000, or a Mark VIe control card — we can source it. ISO 9001 &amp; AS9120 certified. 24-hour quote response.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`${prefix}/rfq`}>
                <Button variant="blue" size="xl" className="shadow-lg shadow-indigo-500/25">
                  Request a Quote <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href={`${prefix}/catalog`}>
                <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
                  Browse Full Catalog <Search className="w-5 h-5" />
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#C0C9D5]">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#818CF8]" /> 24-hour quotes</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#818CF8]" /> Zero counterfeit</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#818CF8]" /> CAGE 8ATR9</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#818CF8]" /> Worldwide shipping</span>
            </div>
          </div>
        </section>

        <SchemaInjector pageKey="ge-gas-turbine-parts" staticSchemas={geSchemas} />
      </main>

      <Footer />
    </div>
  );
}
