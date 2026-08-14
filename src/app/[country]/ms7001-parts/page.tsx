import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, CheckCircle, Cpu, Thermometer, Wind, Cog, Gauge, Package, Wrench } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import RelatedPages from '@/components/seo/RelatedPages';
import { buildHreflang } from '@/lib/seo';
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'GE MS7001 Parts — Frame 7 Turbine Spares',
  description: 'Source GE MS7001 gas turbine spare parts: buckets, nozzles, transition pieces & combustion components for Frame 7. ISO 9001 & AS9120 certified. 24-hour quotes.',
  keywords: [
    'GE MS7001 parts', 'MS7001 parts', 'MS7001FA spare parts',
    'GE Frame 7 parts', 'GE Frame 7EA parts', '7FA buckets',
    '7FA nozzles', '7FA transition pieces', '7FA combustion liners',
    'DLN 2.6 fuel nozzles', 'MS7001 hot gas path', 'MS7001 turbine components',
    'MS7001 shrouds and seals',
    'frame 7fa 1st stage bucket', 'frame 7fa 1st stage nozzle',
    'frame 7fa transition piece', '7FA.03 combustion parts',
    'frame 7ea buckets nozzles', '7FA hot gas path kit',
    'ms7001fa stage 1 bucket price', 'frame 7 DLN 2.6 fuel nozzle',
    '7FA spares for planned outage',
  ],
  alternates: {
    canonical: `${SITE_URL}/ms7001-parts`,
    languages: buildHreflang('/ms7001-parts'),
  },
  openGraph: {
    title: 'GE MS7001 Parts — Frame 7 Turbine Spares & Components',
    description: 'Source GE MS7001 gas turbine spare parts: buckets, nozzles, transition pieces & combustion components for Frame 7. ISO 9001 & AS9120 certified. 24-hour quotes.',
    url: `${SITE_URL}/ms7001-parts`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GE MS7001 Parts — Frame 7 Turbine Spares',
    description: 'Source GE MS7001 gas turbine spare parts. ISO 9001 & AS9120. 24-hour quotes.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const PARTS_TABLE = [
  {
    category: 'Hot Gas Path — Buckets',
    items: [
      { part: 'Stage 1 Bucket', description: 'Directionally solidified superalloy, TBC-coated, fir tree root attachment. Available with cooling hole configurations for MS7001 build levels.' },
      { part: 'Stage 2 Bucket', description: 'Equiaxed or DS material options, integral tip shroud, multi-pass internal cooling circuit.' },
      { part: 'Stage 3 Bucket', description: 'Longer airfoil design for low-pressure extraction, corrosion-resistant coatings available.' },
    ],
  },
  {
    category: 'Hot Gas Path — Nozzles',
    items: [
      { part: 'Stage 1 Nozzle', description: 'Single-vane segment design, film-cooled, cobalt-base superalloy with TBC. Includes inner/outer sidewalls and rail seals.' },
      { part: 'Stage 2 Nozzle', description: 'Two-vane segment, convective and film cooling, platform with angel wing seals.' },
      { part: 'Stage 3 Nozzle', description: 'Two-vane segment, convective cooling, ruggedized for extended hot gas path intervals.' },
    ],
  },
  {
    category: 'Combustion Hardware',
    items: [
      { part: 'Transition Piece', description: 'One-piece, single-tube design with impingement cooling sleeve and cross-fire tube connection for DLN combustion systems.' },
      { part: 'Combustion Liner', description: 'Advanced can-annular liner for DLN 2.6+ combustion system. Multi-hole primary zone for premixed flame stability.' },
      { part: 'Fuel Nozzle (DLN 2.6+)', description: 'Premixed fuel nozzle assembly with cartridge and tip. OEM equivalent flow number and spray pattern.' },
      { part: 'Cross-Fire Tubes', description: 'Flame propagation tubes with retention hardware. Inconel 625 construction.' },
    ],
  },
  {
    category: 'Shrouds, Seals & Hardware',
    items: [
      { part: 'Stage 1 Shroud', description: 'Turbine shroud block, honeycomb land, HGP compliant, with full set of feather seals and pin hardware.' },
      { part: 'Stage 2 Shroud', description: 'Shroud segments with abradable coating, spring clips and retention hardware included.' },
      { part: 'Stage 3 Shroud', description: 'Exhaust-end shroud blocks, standard and oversized bore configurations.' },
      { part: 'Seal Kits', description: 'Complete seal retrofit kits including interstage, brush, labyrinth, and carbon ring seals.' },
      { part: 'Retention Hardware', description: 'Locking plates, pins, clips, bolts, and nuts per GE specification GEK-107121 and GEK-110472.' },
    ],
  },
];

const WHY_US = [
  {
    icon: Package,
    title: 'Deep MS7001 Inventory',
    description: 'Over 5,000 unique MS7001 line items in stock across buckets, nozzles, combustion hardware, and seals. Same-day dispatch for in-stock orders.',
  },
  {
    icon: Shield,
    title: 'Certified & Traceable',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every MS7001 part ships with full chain-of-custody documentation, OEM cross-reference, and material certs.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'Submit your RFQ and receive a binding quote within 24 hours. AOG emergency requests routed directly to our MS7001 product specialists.',
  },
  {
    icon: Cpu,
    title: 'Technical Matching',
    description: 'Our engineers cross-reference OEM part numbers against 7FA.e, 7FA.05, and legacy 7FA build levels to ensure form-fit-function match.',
  },
  {
    icon: Award,
    title: 'OEM Equivalent Quality',
    description: 'All MS7001 hardware sourced from OEM-licensed manufacturers and NADCAP-approved coating houses. No grey-market or uncertified alternatives.',
  },
  {
    icon: Wrench,
    title: 'Field Support',
    description: 'Backed by a team of former GE field engineers who understand outage schedules, bolting torques, and installation sequencing.',
  },
];

const FRAME_SPECS = [
  { label: 'Model', value: 'MS7001B / 7E / 7EA / 7FA' },
  { label: 'Power Output', value: '50–171 MW (ISO, simple cycle)' },
  { label: 'Frequency', value: '60 Hz' },
  { label: 'Heat Rate', value: '~9,200–10,500 Btu/kWh (LHV, simple cycle)' },
  { label: 'Combustor Type', value: 'DLN 2.6+ / Conventional (can-annular)' },
  { label: 'Turbine Stages', value: '3' },
  { label: 'Compressor Stages', value: '17–18' },
  { label: 'Platform', value: '7B, 7E, 7EA, 7FA.e, 7FA.05, 7FA.04, 7FA.03' },
  { label: 'Applications', value: 'Simple cycle, combined cycle, cogeneration' },
];

export default async function Ms7001PartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'GE MS7001 Gas Turbine Spare Parts',
    description: 'Complete range of GE MS7001 hot gas path, combustion, and turbine components including buckets, nozzles, transition pieces, combustion liners, fuel nozzles, shrouds, seals, and retention hardware.',
    brand: { '@type': 'Brand', name: 'GE / General Electric' },
    category: 'Gas Turbine Spare Parts',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: '5000+',
      offeredBy: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: SITE_URL,
      },
    },
    manufacturer: { '@type': 'Organization', name: 'General Electric' },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'GE MS7001 Parts', url: `${prefix || ''}/ms7001-parts` },
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
              GE MS7001 Parts — Frame 7 Turbine Spares
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Complete hot gas path, combustion, and turbine components for the
              GE MS7001 / Frame 7 series heavy-duty gas turbine. ISO 9001 &amp; AS9120 certified.
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
              The MS7001 / Frame 7 Series
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <p className="text-text-muted leading-relaxed mb-6">
                  The GE MS7001 series — commonly known as Frame 7, spanning the
                  MS7001B (7B), 7E, 7EA, and 7FA variants — is a 50 to 171 MW, 60 Hz
                  heavy-duty gas turbine family widely deployed in simple cycle, combined
                  cycle, and cogeneration plants across North America, the Middle East,
                  and Asia-Pacific. With an 18-stage compressor and 3-stage turbine, the
                  MS7001 platform delivers competitive heat rates and supports DLN 2.6+
                  combustion for ultra-low NOx emissions.
                </p>
                <p className="text-text-muted leading-relaxed">
                  Common build levels include 7FA.e, 7FA.05, 7FA.04, 7FA.03, and 7EA.
                  Our inventory covers all major MS7001 variants with OEM-licensed and
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
                Complete GE MS7001 Parts Table
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Comprehensive inventory covering hot gas path, combustion, and
                turbine hardware for all MS7001 build levels.
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
                Why Choose Us for MS7001 Parts
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Certified quality, deep inventory, and engineering expertise
                purpose-built for the GE MS7001 platform.
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
              Need GE MS7001 Parts?
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

        <RelatedPages
          prefix={prefix}
          links={[
            { href: '/ms6001-parts', label: 'GE MS6001 Parts', description: 'MS6001B hot gas path and combustion components for the Frame 6 platform.' },
            { href: '/ge-frame-9e-parts', label: 'GE Frame 9E Parts', description: 'MS9001E buckets, nozzles, transition pieces, and combustion hardware.' },
            { href: '/ge-lm2500-parts', label: 'GE LM2500 Parts', description: 'Aeroderivative LM2500 / LM2500+ / LM2500+G4 turbine spare parts.' },
            { href: '/parts/combustion-liners', label: 'Combustion Liners', description: 'Can-annular combustion liners for GE, Siemens, Rolls-Royce, and Solar turbines.' },
            { href: '/parts/fuel-nozzles', label: 'Fuel Nozzles', description: 'DLN and conventional fuel nozzle assemblies with OEM-equivalent flow numbers.' },
            { href: '/parts/turbine-blades', label: 'Turbine Blades', description: 'Stage 1-3 buckets and nozzles with DS/single-crystal material options.' },
            { href: '/catalog', label: 'Browse Full Catalog', description: 'Search 5M+ NSN/CAGE parts across every turbine platform we support.' },
            { href: '/contact', label: 'Request a Quote', description: 'Submit your part numbers or NSNs for a binding quote within 24 hours.' },
          ]}
        />

      <Footer />

      <SchemaInjector
        pageKey="ms7001-parts"
        staticSchemas={[productSchema]}
      />
    </div>
  );
}
