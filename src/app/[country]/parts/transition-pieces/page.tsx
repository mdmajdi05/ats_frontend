import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Zap, Truck, ClipboardCheck, Search, Package, RefreshCw, Wrench, ArrowRight, Thermometer, Layers } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import RelatedPages from '@/components/seo/RelatedPages';
import { buildHreflang } from '@/lib/seo';
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Gas Turbine Transition Pieces for Sale',
  description: 'Source gas turbine transition pieces for GE Frame 6B, 7FA, 9E, Siemens & Solar turbines. New & refurbished. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'gas turbine transition pieces', 'GE transition pieces', 'transition piece for sale',
    'Frame 6B transition piece', 'Frame 7FA transition piece', 'Frame 9E transition piece',
    'Siemens transition piece', 'Solar Turbines transition piece',
    'transition piece support', 'transition piece bullhorns', 'cross-fire tube transition piece',
    'new transition pieces', 'refurbished transition pieces',
    'gas turbine combustion transition ducts',
    'frame 6b transition piece part number 117e8207g004',
    'frame 6b transition piece set', 'frame 7fa transition piece price',
    'frame 9e transition piece for sale', 'transition piece repair and TBC',
    'FR6B transition pieces refurbished', '6B transition piece impingement cooling',
  ],
  alternates: {
    canonical: `${SITE_URL}/parts/transition-pieces`,
    languages: buildHreflang('/parts/transition-pieces'),
  },
  openGraph: {
    title: 'Gas Turbine Transition Pieces — GE Frame 6B, 7FA & 9E',
    description: 'Source gas turbine transition pieces for GE Frame 6B, 7FA, 9E, Siemens & Solar turbines. New & refurbished. ISO 9001 & AS9120. 24-hour quotes.',
    url: `${SITE_URL}/parts/transition-pieces`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Transition Pieces — GE Frame 6B, 7FA & 9E',
    description: 'Gas turbine transition pieces for GE, Siemens & Solar. New & refurbished. ISO 9001 & AS9120.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const FRAMES = [
  {
    oem: 'GE Gas Turbines',
    models: [
      { frame: 'GE Frame 6B', models: 'MS6001B — 6B.03, 6B.04, 6B.05' },
      { frame: 'GE Frame 7E / 7EA', models: 'MS7001E / MS7001EA' },
      { frame: 'GE Frame 7FA', models: 'MS7001FA — 7FA.03, 7FA.04' },
      { frame: 'GE Frame 9E', models: 'MS9001E / MS9001EA' },
      { frame: 'GE Frame 9FA', models: 'MS9001FA — 9FA.03, 9FA.04' },
    ],
  },
  {
    oem: 'Siemens Gas Turbines',
    models: [
      { frame: 'Siemens SGT-800', models: 'SGT-800 (GTX100)' },
      { frame: 'Siemens SGT-600', models: 'SGT-600 (GT10)' },
      { frame: 'Siemens SGT-700', models: 'SGT-700' },
    ],
  },
  {
    oem: 'Solar Turbines',
    models: [
      { frame: 'Solar Taurus 60 / 70', models: 'Taurus 60, Taurus 70' },
      { frame: 'Solar Mars 90 / 100', models: 'Mars 90, Mars 100' },
      { frame: 'Solar Titan 130', models: 'Titan 130' },
    ],
  },
];

const CONDITIONS = [
  {
    icon: Package,
    title: 'New',
    description: 'OEM-new and OEM-licensed transition pieces in original packaging with full material traceability, dimensional inspection reports, and manufacturer warranty.',
  },
  {
    icon: RefreshCw,
    title: 'Refurbished',
    description: 'Refurbished transition pieces cleaned, NDT-inspected, weld-repaired, and recoated at certified repair shops to restore OEM geometry and service life.',
  },
  {
    icon: Wrench,
    title: 'Serviceable',
    description: 'Used transition pieces with verified remaining life, full inspection records, and documented service history — a cost-effective bridge for unplanned outages.',
  },
];

const WHY_US = [
  {
    icon: ClipboardCheck,
    title: 'Certified Quality',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every transition piece ships with material certs, dimensional inspection reports, and full chain-of-custody documentation.',
  },
  {
    icon: Search,
    title: 'Deep Cross-OEM Coverage',
    description: 'Inventory spans GE frames, Siemens SGT series, and Solar turbines with OEM cross-reference to drawing numbers and superseded revisions.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'Submit your RFQ with drawing number, serial number, or TIL reference and receive a binding quote within 24 hours. AOG escalated same-day.',
  },
  {
    icon: Truck,
    title: 'Global Logistics',
    description: 'Door-to-door delivery to 150+ countries with full export compliance, ITAR documentation, and AOG air-freight options for emergency outages.',
  },
];

export default async function TransitionPiecesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Parts', url: `${prefix || ''}/parts` },
        { name: 'Transition Pieces', url: `${prefix || ''}/parts/transition-pieces` },
      ]} />
      <SchemaInjector pageKey="transition-pieces" />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Combustion Hardware
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              Gas Turbine Transition Pieces
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              New, refurbished, and serviceable transition pieces for GE Frame 6B, 7FA, 9E,
              Siemens, and Solar turbines. 5M+ NSN/CAGE parts. ISO 9001 &amp; AS9120 certified.
              24-hour quote response.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Overview
            </div>
            <h2 className="text-3xl font-black text-text mb-6">What Is a Gas Turbine Transition Piece?</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                The transition piece is the duct that channels hot combustion gas from the
                combustion liner into the first-stage turbine nozzles in can-annular gas
                turbine combustion systems. Fabricated from high-temperature superalloys such
                as Hastelloy-X with thermal barrier coatings, it must withstand extreme firing
                temperatures, thermal cycling, and pressure loads across every operating cycle.
              </p>
              <p>
                Transition pieces are among the most frequently replaced hot gas path
                components, typically swapped during combustion inspections (CI) and hot gas
                path inspections (HGP). Cracks at the aft end, oxidation, and distortion around
                the cross-fire tube connection are common wear modes. Sourcing the correct
                OEM-equivalent transition piece — matched by drawing number, build level, and
                firing temperature — is critical to maintain heat rate, emissions compliance,
                and reliable outage windows.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Turbine Frames
              </div>
              <h2 className="text-3xl font-black text-text">Transition Pieces by Frame and Model</h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                We stock new, refurbished, and serviceable transition pieces for all major
                can-annular turbine frames across GE, Siemens, and Solar.
              </p>
            </div>
            <div className="space-y-8">
              {FRAMES.map((group) => (
                <div key={group.oem} className="bg-white border border-silver rounded-2xl overflow-hidden">
                  <div className="bg-navy text-white px-6 py-4">
                    <h3 className="text-lg font-bold">{group.oem}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-silver bg-bg">
                          <th className="text-left px-6 py-3 font-semibold text-text">Turbine Frame</th>
                          <th className="text-left px-6 py-3 font-semibold text-text">Model / Series</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.models.map((m) => (
                          <tr key={m.frame} className="border-b border-silver last:border-b-0 hover:bg-bg/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-text">{m.frame}</td>
                            <td className="px-6 py-4 text-text-muted">{m.models}</td>
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
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Part Conditions
              </div>
              <h2 className="text-3xl font-black text-text">Conditions We Offer</h2>
              <p className="text-text-muted mt-2">
                Every transition piece is inspected, documented, and classified by condition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONDITIONS.map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.title} className="bg-bg border border-silver rounded-2xl p-6 hover:border-orange/30 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">{c.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{c.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why AeroTurbineSpare
              </div>
              <h2 className="text-3xl font-black text-text">Why Choose Us for Transition Pieces</h2>
              <p className="text-text-muted mt-2">
                We combine deep cross-OEM inventory with rigorous quality processes to keep
                your combustion system online.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="bg-white border border-silver rounded-2xl p-6 text-center hover:border-orange/30 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-base font-bold text-text mb-2">{item.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Get a Quote
            </div>
            <h2 className="text-3xl font-black text-text mb-4">Need a Transition Piece Fast?</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Submit your RFQ with the drawing number, serial number, or TIL reference and
              receive a competitive, certified quote within 24 hours. AOG inquiries are
              escalated for same-day response. No minimum order quantities.
            </p>
            <a
              href={`${prefix || ''}/contact`}
              className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 rounded-xl hover:bg-orange/90 transition-colors text-lg"
            >
              Request a Quote
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

        <RelatedPages
          prefix={prefix}
          links={[
            { href: '/parts/combustion-liners', label: 'Combustion Liners', description: 'Can-annular combustion liners for GE, Siemens, Rolls-Royce, and Solar turbines.' },
            { href: '/parts/fuel-nozzles', label: 'Fuel Nozzles', description: 'DLN and conventional fuel nozzle assemblies with OEM-equivalent flow numbers.' },
            { href: '/parts/turbine-shrouds', label: 'Turbine Shrouds', description: 'Stage 1-3 shroud blocks, seals, and retention hardware for every major frame.' },
            { href: '/ge-frame-6b-parts', label: 'GE Frame 6B Parts', description: 'MS6001B hot gas path and combustion components for the 42 MW platform.' },
            { href: '/ms6001-parts', label: 'GE MS6001 Parts', description: 'Frame 6 turbine spares and components for the full MS6001 series.' },
            { href: '/ge-frame-7fa-parts', label: 'GE Frame 7FA Parts', description: 'MS7001FA hot gas path, combustion, and turbine components for the 7FA platform.' },
            { href: '/ge-frame-9e-parts', label: 'GE Frame 9E Parts', description: 'MS9001E buckets, nozzles, transition pieces, and combustion hardware.' },
            { href: '/catalog', label: 'Browse Full Catalog', description: 'Search 5M+ NSN/CAGE parts across every turbine platform we support.' },
            { href: '/contact', label: 'Request a Quote', description: 'Submit your part numbers or NSNs for a binding quote within 24 hours.' },
          ]}
        />

      <Footer />
    </div>
  );
}
