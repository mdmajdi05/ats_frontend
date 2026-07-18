import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, Box, Wind, Flame, Gauge, Cog, Activity, Cpu } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import CountriesWeServe from '@/components/country/CountriesWeServe';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'GE LM2500 Parts — Gas Generator, Power Turbine & Hot Section Components',
  description: 'Source GE LM2500, LM2500+, LM2500+G4 & LM2500 DLE gas turbine parts. 5M+ NSN/CAGE parts. ISO 9001/AS9120. 24-hour quotes. Worldwide shipping.',
  keywords: [
    'GE LM2500 parts', 'LM2500+ gas turbine parts', 'LM2500+G4 parts',
    'LM2500 DLE parts', 'gas generator module', 'power turbine blades',
    'combustor parts LM2500', 'fuel nozzles GE', 'aeroderivative turbine parts',
    'marine gas turbine parts', 'industrial gas turbine components',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/ge-lm2500-parts',
    languages: buildHreflang('/ge-lm2500-parts'),
  },
  openGraph: {
    title: 'GE LM2500 Parts — Gas Generator, Power Turbine & Hot Section Components',
    description: 'Source GE LM2500, LM2500+, LM2500+G4 & LM2500 DLE gas turbine parts. 5M+ NSN/CAGE parts. ISO 9001/AS9120. 24-hour quotes. Worldwide shipping.',
    url: 'https://aeroturbinespare.com/ge-lm2500-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GE LM2500 Parts — Gas Generator, Power Turbine & Hot Section Components',
    description: 'Source GE LM2500, LM2500+, LM2500+G4 & LM2500 DLE gas turbine parts. ISO 9001/AS9120. 24-hour quotes. Worldwide shipping.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const VARIANTS = [
  { name: 'LM2500', power: '21 MW', efficiency: '36%', applications: 'Marine propulsion, industrial power, pipeline compression' },
  { name: 'LM2500+', power: '30 MW', efficiency: '38%', applications: 'Naval, cruise ships, oil & gas platforms' },
  { name: 'LM2500+G4', power: '33 MW', efficiency: '39%', applications: 'High-output marine, combined-cycle, LNG carriers' },
  { name: 'LM2500 DLE', power: '21-30 MW', efficiency: '36-38%', applications: 'Onshore pipelines, power gen requiring low NOx emissions' },
];

const PARTS_CATEGORIES = [
  {
    icon: Wind,
    title: 'Gas Generator Module Components',
    items: ['Compressor rotor assemblies & stator vanes', 'Variable inlet guide vanes (VIGV)', 'High-pressure compressor blades & discs', 'Turbine center frame & diffuser', 'Accessory gearbox & drive train parts'],
  },
  {
    icon: Cog,
    title: 'Power Turbine Blades & Nozzles',
    items: ['Stage 1 & 2 power turbine blades (N5/N5A single crystal)', 'Power turbine nozzle assemblies & shrouds', 'Turbine exhaust frame & strut fairings', 'Tip seals, honeycomb seals & abradable coatings', 'Disk & spacer assemblies for LP turbine'],
  },
  {
    icon: Flame,
    title: 'Combustor Parts',
    items: ['Annular combustor liner assemblies', 'Combustion casing & inner/outer support rings', 'Cross-fire tubes & igniter plugs', 'Dilution & cooling hole panels', 'Combustor dome assemblies & heat shields'],
  },
  {
    icon: Gauge,
    title: 'Fuel Nozzles & Fuel Manifolds',
    items: ['Gas & liquid fuel nozzles', 'Dual-fuel nozzle assemblies', 'Fuel manifold & distribution tubes', 'Atomizer & check valve components', 'Fuel purge & drain systems'],
  },
  {
    icon: Box,
    title: 'Bearings & Seals',
    items: ['Thrust & journal bearings (tilting pad)', 'Carbon face & labyrinth seals', 'Squeeze film damper bearings', 'Bearing housings & support structures', 'Oil seals & buffer air seals'],
  },
  {
    icon: Activity,
    title: 'Sensors & Instrumentation',
    items: ['Gas path thermocouples & RTDs', 'Vibration probes & accelerometers', 'Speed pickups & magnetic sensors', 'Pressure transmitters & differential pressure switches', 'Flame detectors & exhaust gas temperature sensors'],
  },
  {
    icon: Cpu,
    title: 'Control System Parts',
    items: ['Speedtronic Mark V & Mark VI control modules', 'Servo valves & actuators', 'LVDT position sensors', 'I/O cards & power supply modules', 'HMI panels & communication interface boards'],
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Certified Quality',
    description: 'ISO 9001:2015 & AS9120 Rev B certified. Every LM2500 part is fully traceable and inspected to OEM specifications. Full documentation with every shipment.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'RFQ response within 24 hours — same day for AOG and emergency outage situations. Our team knows the LM2500 platform inside and out.',
  },
  {
    icon: Award,
    title: 'Massive Inventory',
    description: '5M+ line items across NSN, CAGE, and OEM part numbers. Dedicated LM2500 stocking program covers gas generator, power turbine, and hot section components.',
  },
  {
    icon: Globe,
    title: 'Global Logistics',
    description: 'Ship to 150+ countries. ITAR, EAR, and dual-use export compliance handled in-house. Doral, FL headquarters with overnight reach to Miami International Airport.',
  },
];

export default async function GeLm2500PartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'GE LM2500 Parts', url: `${prefix || ''}/ge-lm2500-parts` },
      ]} />
      <SchemaInjector
        pageKey="ge-lm2500-parts"
        staticSchemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'GE LM2500 Gas Turbine Parts',
            description: 'New, refurbished, and serviceable GE LM2500, LM2500+, LM2500+G4, and LM2500 DLE gas turbine parts. Gas generator modules, power turbine blades, combustor hardware, fuel nozzles, bearings, seals, sensors, and control system components.',
            brand: { '@type': 'Brand', name: 'GE Aerospace' },
            manufacturer: { '@type': 'Organization', name: 'General Electric' },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              areaServed: 'Worldwide',
            },
          },
        ]}
      />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              GE LM2500 Series
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              GE LM2500 Parts — All Variants
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Certified gas generator, power turbine, and hot section components for LM2500, LM2500+, LM2500+G4, and LM2500 DLE. New, refurbished, and serviceable parts sourced from verified OEM and aftermarket supply chains.
            </p>
            <a
              href={`${prefix || ''}/rfq`}
              className="inline-block bg-orange text-white font-bold px-8 py-3 rounded-lg hover:bg-orange/90 transition-colors"
            >
              Request a Quote
            </a>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Platform Overview
              </div>
              <h2 className="text-3xl font-black text-text">The GE LM2500 Aeroderivative Family</h2>
              <p className="text-text-muted mt-3 max-w-2xl mx-auto">
                Derived from the CF6-6 aircraft engine, the LM2500 is GE&apos;s most successful aeroderivative gas turbine platform — spanning 21-33 MW with proven reliability across marine, industrial, and pipeline applications.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VARIANTS.map((v) => (
                <div key={v.name} className="bg-bg border border-silver rounded-2xl p-6 hover:border-orange/30 transition-colors">
                  <h3 className="text-xl font-black text-text mb-3">{v.name}</h3>
                  <div className="space-y-2 text-sm text-text-muted mb-4">
                    <div className="flex justify-between">
                      <span>Power Output</span>
                      <span className="font-semibold text-text">{v.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency</span>
                      <span className="font-semibold text-text">{v.efficiency}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{v.applications}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Parts Catalog
              </div>
              <h2 className="text-3xl font-black text-text">LM2500 Parts We Supply</h2>
              <p className="text-text-muted mt-3 max-w-2xl mx-auto">
                Full coverage across all LM2500 variants. Every part is traceable to OEM standards and backed by our ISO 9001 / AS9120 quality system.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PARTS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.title} className="bg-white border border-silver rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-3">{cat.title}</h3>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li key={item} className="text-sm text-text-muted flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why AeroTurbineSpare
              </div>
              <h2 className="text-3xl font-black text-text">Why Choose Us for LM2500 Parts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-bg border border-silver rounded-2xl p-6 text-center hover:border-orange/30 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-base font-bold text-text mb-2">{item.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CountriesWeServe />

        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Need LM2500 Parts? Let&apos;s Talk.</h2>
            <p className="text-silver/80 text-lg mb-8 leading-relaxed">
              Whether you need a single fuel nozzle or a complete gas generator module, our team can source it. 24-hour quote turnaround. No minimum order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${prefix || ''}/rfq`}
                className="inline-block bg-orange text-white font-bold px-8 py-3 rounded-lg hover:bg-orange/90 transition-colors"
              >
                Request a Quote
              </a>
              <a
                href={`${prefix || ''}/contact`}
                className="inline-block border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
