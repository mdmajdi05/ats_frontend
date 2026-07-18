import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Clock, Award, Globe, PackageSearch, FileCheck, ChevronRight, ArrowRight, Search, CheckCircle, Cog, Gauge, Fuel, Wind, Flame, Filter, Boxes, Droplet, Thermometer, Wrench } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Solar Turbines Parts — Saturn, Centaur, Mercury, Taurus, Mars & Titan',
  description: 'Source Solar Turbines spare parts for Saturn, Centaur, Mercury, Taurus 60/70, Mars 90/100 & Titan 130. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes. CAGE 8ATR9.',
  keywords: [
    'Solar Turbines parts', 'Saturn turbine parts',
    'Centaur turbine parts', 'Mercury 50 parts',
    'Taurus 60 parts', 'Taurus 70 parts',
    'Mars 90 parts', 'Mars 100 parts',
    'Titan 130 parts', 'Solar gas turbine spare parts',
    'Solar Turbines compressor blades', 'Solar Turbines fuel nozzles',
    'Solar Turbines combustion liners', 'CAGE 8ATR9 Solar',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/solar-turbines-parts',
    languages: buildHreflang('/solar-turbines-parts'),
  },
  openGraph: {
    title: 'Solar Turbines Parts — Saturn, Centaur, Mercury, Taurus, Mars & Titan',
    description: 'Source Solar Turbines spare parts for all major models. 5M+ NSN/CAGE parts. ISO 9001 & AS9120 certified. 24-hour quotes. CAGE 8ATR9.',
    url: 'https://aeroturbinespare.com/solar-turbines-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Turbines Parts — Saturn, Centaur, Mercury, Taurus, Mars & Titan',
    description: 'Source Solar Turbines spare parts for all major models. 5M+ NSN/CAGE parts. ISO 9001 & AS9120 certified. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const SOLAR_MODELS = [
  {
    model: 'Saturn',
    power: '1.1–1.5 MW',
    applications: 'Gas compression, mechanical drive, power generation',
    parts: ['Compressor Rotor & Stator Blades', 'Turbine Nozzles & Buckets', 'Combustion Liners & Cross-Fire Tubes', 'Fuel Nozzles & Atomizers', 'Centrifugal Compressor Impellers', 'Bearings & Labyrinth Seals', 'Lube Oil Pumps & Filters', 'Governor & Fuel Control Valves'],
  },
  {
    model: 'Centaur',
    power: '3.5–4.6 MW',
    applications: 'Pipeline compression, cogeneration, industrial CHP',
    parts: ['Compressor Blades & Variable Guide Vanes', 'Stage 1–2 Turbine Buckets & Nozzles', 'Combustion Liners & End Covers', 'Fuel Nozzle Assemblies', 'Centrifugal Compressor Wheels', 'Thrust & Journal Bearings', 'Speedtronic Control Modules', 'Hydraulic Actuators & Servo Valves'],
  },
  {
    model: 'Mercury 50',
    power: '4.6–5.7 MW',
    applications: 'Power generation, oil & gas, marine',
    parts: ['Compressor Blades & Stators', 'Turbine Rotor Blades & Nozzles', 'SAC Combustion Liners & Fuel Nozzles', 'Recuperator Core Sections', 'Bearings & Carbon Seals', 'Fuel Metering Valve Assemblies', 'Ignition Exciter & Leads', 'Digital Control System Cards'],
  },
  {
    model: 'Taurus 60',
    power: '5.5–6.3 MW',
    applications: 'Power gen, gas compression, CHP',
    parts: ['Compressor Blades & Inlet Guide Vanes', 'Stage 1–3 Turbine Buckets & Nozzles', 'DLN Combustion Liners & Fuel Nozzles', 'Transition Pieces & Flow Sleeves', 'Bearings & Seal Kits', 'Fuel Gas Control Valves', 'Mark V Control Modules', 'Starter Motor & Generator Parts'],
  },
  {
    model: 'Taurus 70',
    power: '7.0–8.3 MW',
    applications: 'Power generation, pipeline, offshore',
    parts: ['Compressor Blades & Variable Stators', 'Turbine Stage 1–3 Bucket Assemblies', 'DLN Combustion Hardware', 'Fuel Nozzles & Premix Tubes', 'Bearings & Labyrinth Seals', 'Hydraulic Skid Components', 'Turbine Control System Cards', 'Oil Cooler & Filter Assemblies'],
  },
  {
    model: 'Mars 90',
    power: '9.4–10.7 MW',
    applications: 'Pipeline compression, power generation, offshore',
    parts: ['Compressor Rotor Blades & Stators', 'Stage 1–3 Turbine Nozzles & Buckets', 'Combustion Liners & End Caps', 'Fuel Nozzle & Gas Metering Assemblies', 'Centrifugal Compressor Impellers', 'Journal & Thrust Bearings', 'Mark VI Control System Parts', 'Lube Oil Pumps & Accumulators'],
  },
  {
    model: 'Mars 100',
    power: '10.7–11.9 MW',
    applications: 'Gas compression, marine propulsion, industrial',
    parts: ['Compressor Blades & Variable Guide Vanes', 'Stage 1–3 Turbine Buckets & Shrouds', 'DLN Combustion Liners & Fuel Nozzles', 'Transition Pieces & Impingement Tubes', 'Bearings & Seal Assemblies', 'Fuel Gas Skid Components', 'Vibration Monitoring Probes', 'Exhaust Thermocouple Harnesses'],
  },
  {
    model: 'Titan 130',
    power: '15.0–17.0 MW',
    applications: 'Large pipeline compression, power gen, marine',
    parts: ['Compressor Blades & Stators', 'Turbine Nozzle & Bucket Sets', 'SAC/DLN Combustion Liners', 'Fuel Nozzles & Gas Control Valves', 'Centrifugal Compressor Components', 'Bearing Assemblies & Seals', 'Hydraulic Power Units', 'Titan Control System Modules'],
  },
];

const ADVANTAGES = [
  {
    icon: Shield,
    title: 'Zero Counterfeit Policy',
    description: 'Every Solar Turbines part is verified against OEM specifications with full chain-of-custody documentation. We never compromise on authenticity, even under AOG pressure.',
  },
  {
    icon: Clock,
    title: '24-Hour Quote Response',
    description: 'Submit an RFQ for any Solar Turbines part and receive a competitive quote within 24 hours. Emergency outage requests get priority same-day turnaround.',
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
    description: 'Access to over 5 million line items including new, overhauled, and refurbished Solar Turbines components. In-stock parts ship same day from our Doral, FL warehouse.',
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
  { label: 'Compressor', icon: Wind, parts: 'Blades, vanes, impellers, variable guide vanes' },
  { label: 'Controls & I&C', icon: Gauge, parts: 'Speedtronic, Mark V/VI, sensors, thermocouples' },
  { label: 'Fuel Systems', icon: Fuel, parts: 'Fuel nozzles, gas control valves, metering assemblies' },
  { label: 'Rotors & Bearings', icon: Cog, parts: 'Turbine rotors, bearing assemblies, seals, couplings' },
  { label: 'Lube Oil & Hydraulics', icon: Droplet, parts: 'Pumps, filters, coolers, servo valves, actuators' },
  { label: 'Enclosures & Accessories', icon: Boxes, parts: 'Inlet housings, exhaust diffusers, enclosures, ducts' },
];

const siteUrl = 'https://aeroturbinespare.com';

const solarSchemas: Record<string, unknown>[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Solar Turbines Spare Parts',
    description: 'Certified Solar Turbines spare parts for Saturn, Centaur, Mercury 50, Taurus 60, Taurus 70, Mars 90, Mars 100, and Titan 130 platforms. Hot gas path, combustion, compressor, and control system components.',
    brand: {
      '@type': 'Brand',
      name: 'Solar Turbines',
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
    name: 'Solar Turbines Parts — Saturn, Centaur, Mercury, Taurus, Mars & Titan',
    description: 'Source Solar Turbines spare parts for Saturn, Centaur, Mercury 50, Taurus 60/70, Mars 90/100 & Titan 130. ISO 9001 & AS9120 certified. 24-hour quotes.',
    url: `${siteUrl}/solar-turbines-parts`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Solar Turbines Parts', item: `${siteUrl}/solar-turbines-parts` },
      ],
    },
    mainEntity: {
      '@type': 'Service',
      serviceType: 'Solar Turbines Spare Parts Sourcing & Supply',
      provider: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: siteUrl,
      },
      areaServed: 'Worldwide',
    },
  },
];

export default async function SolarTurbinesPartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Solar Turbines Parts', url: `${prefix || ''}/solar-turbines-parts` },
      ]} />

      <main id="main-content" className="flex-1">
        <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#1E1B4B] to-[#312E81]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 text-[#818CF8] text-sm font-semibold uppercase tracking-wider mb-4">
                <span className="w-6 h-px bg-[#818CF8]" />
                Solar Turbines Parts
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                Solar Turbines Spare Parts — Saturn, Centaur, Mercury, Taurus, Mars &amp; Titan
              </h1>
              <p className="text-[#C0C9D5] text-lg sm:text-xl max-w-3xl leading-relaxed mb-8">
                Certified Solar Turbines spare parts for Saturn, Centaur, Mercury 50, Taurus 60, Taurus 70, Mars 90, Mars 100, and Titan 130 gas turbines. Hot gas path, combustion, compressor, and control components. ISO 9001:2015 &amp; AS9120 Rev B certified. CAGE 8ATR9.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={`${prefix}/rfq`}>
                  <Button variant="blue" size="lg">
                    Request a Quote <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#model-table">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
                    Browse Models <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="model-table" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-[#4F46E5]" />
                Solar Turbines Models
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
                Complete Solar Turbines Coverage
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                Every Solar Turbines gas turbine model from the legacy Saturn to the Titan 130. We stock and source buckets, nozzles, combustion hardware, control modules, and rotating components.
              </p>
            </div>
            <div className="space-y-4">
              {SOLAR_MODELS.map((model) => (
                <div key={model.model} className="bg-[#F8F9FF] border border-[#E8EDF2] rounded-2xl overflow-hidden hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-200">
                  <details className="group">
                    <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                          <Cog className="w-5 h-5 text-[#4F46E5]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0A1628]">{model.model}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4A4A6A] mt-0.5">
                            <span>{model.power}</span>
                            <span className="text-[#E8EDF2]">|</span>
                            <span>{model.applications}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#4F46E5]">
                        <span className="hidden sm:inline">{model.parts.length} part categories</span>
                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                      </div>
                    </summary>
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-[#E8EDF2] pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {model.parts.map((part) => (
                          <div key={part} className="flex items-center gap-2 text-sm text-[#4A4A6A] p-2 rounded-lg hover:bg-white">
                            <CheckCircle className="w-3.5 h-3.5 text-[#4F46E5] flex-shrink-0" />
                            <span>{part}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E8EDF2] flex justify-end">
                        <a href={`${prefix}/catalog?search=${encodeURIComponent(model.model)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline">
                          <Search className="w-3 h-3" />
                          Search {model.model} parts in catalog
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
                Trusted for Solar Turbines Parts
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                Oil &amp; gas, power generation, and marine operators worldwide rely on us for certified Solar Turbines components. Here is why.
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
                Parts Categories
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
                Solar Turbines Component Categories
              </h2>
              <p className="text-[#4A4A6A] max-w-2xl mx-auto">
                From hot gas path to control systems, we cover every major component category for Solar Turbines gas turbines.
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
              Need a Solar Turbines Part?
            </h2>
            <p className="text-[#C0C9D5] text-lg mb-8 max-w-2xl mx-auto">
              Whether you need a turbine bucket for a Titan 130, a fuel nozzle for a Taurus 60, or a control module for a Mars 100 — we can source it. ISO 9001 &amp; AS9120 certified. 24-hour quote response.
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

        <SchemaInjector pageKey="solar-turbines-parts" staticSchemas={solarSchemas} />
      </main>

      <Footer />
    </div>
  );
}
