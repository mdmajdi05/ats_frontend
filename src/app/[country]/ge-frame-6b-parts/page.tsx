import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, CheckCircle, Cpu, Thermometer, Wind, Cog, Gauge, Package, Wrench } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'GE Frame 6B Parts — MS6001B Hot Gas Path & Combustion Components',
  description: 'Source GE Frame 6B (MS6001B) gas turbine spare parts including buckets, nozzles, transition pieces, combustion liners & fuel nozzles. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'GE Frame 6B parts', 'MS6001B spare parts',
    '6B buckets', '6B nozzles', '6B transition pieces',
    '6B combustion liners', 'DLN 1 fuel nozzles',
    '6B hot gas path', 'GE 6B turbine components',
    '6B shrouds and seals',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/ge-frame-6b-parts',
    languages: buildHreflang('/ge-frame-6b-parts'),
  },
  openGraph: {
    title: 'GE Frame 6B Parts — MS6001B Hot Gas Path & Combustion Components',
    description: 'Source GE Frame 6B (MS6001B) gas turbine spare parts including buckets, nozzles, transition pieces, combustion liners & fuel nozzles. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/ge-frame-6b-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GE Frame 6B Parts — MS6001B Hot Gas Path & Combustion Components',
    description: 'Source GE Frame 6B (MS6001B) gas turbine spare parts. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const PARTS_TABLE = [
  {
    category: 'Hot Gas Path — Buckets',
    items: [
      { part: 'Stage 1 Bucket', description: 'Directionally solidified superalloy, TBC-coated, fir tree root attachment. Available with and without cooling hole configurations for 6B applications.' },
      { part: 'Stage 2 Bucket', description: 'Equiaxed or DS material options, integral tip shroud, internal cooling circuit for extended service life.' },
      { part: 'Stage 3 Bucket', description: 'Low-pressure stage design, corrosion-resistant coatings available, standard and Z-notch configurations.' },
    ],
  },
  {
    category: 'Hot Gas Path — Nozzles',
    items: [
      { part: 'Stage 1 Nozzle', description: 'Single-vane segment design, cobalt-base superalloy with TBC. Includes inner/outer sidewalls and rail seals.' },
      { part: 'Stage 2 Nozzle', description: 'Two-vane segment, convective cooling, platform with angel wing seals and anti-rotation hardware.' },
      { part: 'Stage 3 Nozzle', description: 'Two-vane segment, ruggedized for extended hot gas path intervals. Standard O-ring and seal configuration.' },
    ],
  },
  {
    category: 'Combustion Hardware',
    items: [
      { part: 'Transition Piece', description: 'One-piece design with impingement cooling sleeve and cross-fire tube connection. Compatible with DLN 1 and conventional combustion systems.' },
      { part: 'Combustion Liner', description: 'Can-annular liner for 6B combustion system. Multi-hole primary zone design available in Hastelloy-X and 304SS.' },
      { part: 'Fuel Nozzle (DLN 1)', description: 'Premix fuel nozzle assembly with cartridge and tip. OEM equivalent flow number and spray pattern for MS6001B.' },
      { part: 'Cross-Fire Tubes', description: 'Flame propagation tubes with retention hardware. Inconel 625 construction per GE specification.' },
      { part: 'Spark Plug & Flame Detector', description: 'Ignition system components including spark plugs, igniter tips, and UV flame detectors.' },
    ],
  },
  {
    category: 'Shrouds, Seals & Hardware',
    items: [
      { part: 'Stage 1 Shroud', description: 'Turbine shroud block, honeycomb land, HGP compliant, with feather seals and pin hardware.' },
      { part: 'Stage 2 Shroud', description: 'Shroud segments with abradable coating, spring clips and retention hardware included.' },
      { part: 'Stage 3 Shroud', description: 'Exhaust-end shroud blocks, standard and oversized bore configurations available.' },
      { part: 'Seal Kits', description: 'Complete seal retrofit kits including interstage, brush, labyrinth, and carbon ring seals.' },
      { part: 'Retention Hardware', description: 'Locking plates, pins, clips, bolts, and nuts per GE specification GEK-107121 and GEK-110472.' },
    ],
  },
];

const WHY_US = [
  {
    icon: Package,
    title: 'Deep 6B Inventory',
    description: 'Over 3,000 unique 6B line items in stock across buckets, nozzles, combustion hardware, and seals. Same-day dispatch for in-stock orders.',
  },
  {
    icon: Shield,
    title: 'Certified & Traceable',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every 6B part ships with full chain-of-custody documentation, OEM cross-reference, and material certs.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'Submit your RFQ and receive a binding quote within 24 hours. AOG emergency requests routed directly to our 6B product specialists.',
  },
  {
    icon: Cpu,
    title: 'Technical Matching',
    description: 'Our engineers cross-reference OEM part numbers against 6B build levels and serial number ranges to ensure form-fit-function match.',
  },
  {
    icon: Award,
    title: 'OEM Equivalent Quality',
    description: 'All 6B hardware sourced from OEM-licensed manufacturers and NADCAP-approved coating houses. No grey-market or uncertified alternatives.',
  },
  {
    icon: Wrench,
    title: 'Field Support',
    description: 'Backed by a team of former GE field engineers who understand 6B outage schedules, bolting torques, and installation sequencing.',
  },
];

const FRAME_SPECS = [
  { label: 'Model', value: 'MS6001B (6B)' },
  { label: 'Power Output', value: '42 MW (ISO, simple cycle)' },
  { label: 'Frequency', value: '50 / 60 Hz' },
  { label: 'Heat Rate', value: '~10,900 Btu/kWh (LHV, simple cycle)' },
  { label: 'Combustor Type', value: 'DLN 1 / Conventional (can-annular, 6 burners)' },
  { label: 'Turbine Stages', value: '3' },
  { label: 'Compressor Stages', value: '11' },
  { label: 'Platform', value: '6B.03, 6B.04, 6B.05' },
  { label: 'Applications', value: 'Simple cycle, combined cycle, cogeneration, mechanical drive' },
];

export default async function GeFrame6bPartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'GE Frame 6B (MS6001B) Gas Turbine Spare Parts',
    description: 'Complete range of GE Frame 6B hot gas path, combustion, and turbine components including buckets, nozzles, transition pieces, combustion liners, fuel nozzles, shrouds, seals, and retention hardware.',
    brand: { '@type': 'Brand', name: 'GE / General Electric' },
    category: 'Gas Turbine Spare Parts',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: '3000+',
      offeredBy: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: 'https://aeroturbinespare.com',
      },
    },
    manufacturer: { '@type': 'Organization', name: 'General Electric' },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'GE Frame 6B Parts', url: `${prefix || ''}/ge-frame-6b-parts` },
      ]} />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Gas Turbine Parts
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              GE Frame 6B Parts — MS6001B Platform
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Complete hot gas path, combustion, and turbine components for the
              42 MW class GE Frame 6B heavy-duty gas turbine. ISO 9001 &amp; AS9120 certified.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-orange" />
              Frame Overview
            </div>
            <h2 className="text-3xl font-black text-text mb-8">
              42 MW Class Heavy-Duty Gas Turbine
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <p className="text-text-muted leading-relaxed mb-6">
                  The GE Frame 6B (MS6001B) is a 42 MW, 50/60 Hz heavy-duty gas turbine
                  widely deployed in simple cycle, combined cycle, cogeneration, and
                  mechanical drive applications across the Middle East, Asia, Latin America,
                  and Africa. With an 11-stage compressor and 3-stage turbine, the 6B platform
                  delivers a heat rate of approximately 10,900 Btu/kWh (LHV) and supports
                  DLN 1 or conventional combustion systems.
                </p>
                <p className="text-text-muted leading-relaxed">
                  Common build levels include 6B.03, 6B.04, and 6B.05.
                  Our inventory covers all major variants with OEM-licensed and
                  aftermarket-certified components backed by full traceability.
                </p>
              </div>
              <div className="lg:col-span-2 bg-bg border border-silver rounded-2xl p-6">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <Cog className="w-5 h-5 text-orange" />
                  Specifications
                </h3>
                <dl className="space-y-3 text-sm">
                  {FRAME_SPECS.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-2">
                      <dt className="text-text-muted font-medium">{spec.label}</dt>
                      <dd className="text-text font-semibold text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
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
              <h2 className="text-3xl font-black text-text">
                Complete GE Frame 6B Parts Table
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Comprehensive inventory covering hot gas path, combustion, and
                turbine hardware for all 6B build levels.
              </p>
            </div>

            <div className="space-y-8">
              {PARTS_TABLE.map((group) => (
                <div key={group.category} className="bg-white border border-silver rounded-2xl overflow-hidden">
                  <div className="bg-navy text-white px-6 py-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange" />
                      {group.category}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-silver bg-bg">
                          <th className="text-left px-6 py-3 font-semibold text-text w-1/4">Part</th>
                          <th className="text-left px-6 py-3 font-semibold text-text">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <tr key={item.part} className={`border-b border-silver/60 ${idx % 2 === 1 ? 'bg-bg/50' : ''}`}>
                            <td className="px-6 py-4 font-bold text-text whitespace-nowrap">{item.part}</td>
                            <td className="px-6 py-4 text-text-muted leading-relaxed">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why Us
              </div>
              <h2 className="text-3xl font-black text-text">
                Why Choose Us for 6B Parts
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Certified quality, deep inventory, and engineering expertise
                purpose-built for the GE Frame 6B platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-bg border border-silver rounded-2xl p-6 hover:border-orange/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
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

        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Get a Quote
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
              Need GE Frame 6B Parts?
            </h2>
            <p className="text-silver/80 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Submit your part numbers or NSNs for a competitive quote within 24 hours.
              AOG and emergency outage requirements handled same-day.
            </p>
            <a
              href={`${prefix || ''}/contact`}
              className="inline-block bg-orange text-white font-bold px-10 py-4 rounded-full hover:bg-orange/90 transition-colors text-base shadow-lg"
            >
              Request 24-Hour Quote
            </a>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaInjector
        pageKey="ge-frame-6b-parts"
        staticSchemas={[productSchema]}
      />
    </div>
  );
}
