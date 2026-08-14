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
  title: 'Gas Turbine Shrouds — Stage 1-3 & Seals',
  description: 'Source gas turbine shrouds for GE Frame 6B, 7FA, 9E, LM2500, Siemens & Solar. Stage 1-3 shroud blocks, honeycomb seals & hardware. ISO 9001 & AS9120.',
  keywords: [
    'gas turbine shrouds', 'turbine shroud blocks', 'shroud segments for sale',
    'Frame 6B shroud', 'Frame 7FA shroud', 'Frame 9E shroud',
    'LM2500 shrouds', 'LM6000 shrouds', 'Siemens SGT shrouds', 'Solar Turbines shroud',
    'stage 1 shroud', 'stage 2 shroud', 'stage 3 shroud',
    'honeycomb shroud seals', 'abradable seal segments', 'shroud retention hardware',
    'new turbine shrouds', 'refurbished shrouds',
    'frame 6b stage 1 shroud', 'frame 7fa stage 2 shroud block',
    'frame 9e shroud segments', 'LM2500 stage 3 shroud',
    'turbine shroud block honeycomb land', '6B shroud and seal retrofit',
    'shroud blocks for GE MS6001',
  ],
  alternates: {
    canonical: `${SITE_URL}/parts/turbine-shrouds`,
    languages: buildHreflang('/parts/turbine-shrouds'),
  },
  openGraph: {
    title: 'Gas Turbine Shrouds — Stage 1-3 Shroud Blocks & Seals',
    description: 'Source gas turbine shrouds for GE Frame 6B, 7FA, 9E, LM2500, Siemens & Solar. Stage 1-3 shroud blocks, honeycomb seals & hardware. ISO 9001 & AS9120.',
    url: `${SITE_URL}/parts/turbine-shrouds`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Shrouds — Stage 1-3 Shroud Blocks & Seals',
    description: 'Gas turbine shrouds for GE, Siemens & Solar. Stage 1-3 shroud blocks & honeycomb seals. ISO 9001 & AS9120.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const FRAMES = [
  {
    oem: 'GE Gas Turbines',
    models: [
      { frame: 'GE Frame 6B', models: 'MS6001B — 6B.03, 6B.04, 6B.05', stages: 'Stage 1, 2, 3' },
      { frame: 'GE Frame 7E / 7EA', models: 'MS7001E / MS7001EA', stages: 'Stage 1, 2, 3' },
      { frame: 'GE Frame 7FA', models: 'MS7001FA — 7FA.03, 7FA.04', stages: 'Stage 1, 2, 3' },
      { frame: 'GE Frame 9E', models: 'MS9001E / MS9001EA', stages: 'Stage 1, 2, 3' },
      { frame: 'GE Frame 9FA', models: 'MS9001FA — 9FA.03, 9FA.04', stages: 'Stage 1, 2, 3' },
      { frame: 'GE LM2500', models: 'LM2500 / LM2500+ / LM2500+G4', stages: 'Stage 1, 2, 3' },
      { frame: 'GE LM6000', models: 'LM6000 / LM6000-PC / LM6000-PF', stages: 'Stage 1, 2, 3' },
    ],
  },
  {
    oem: 'Siemens Gas Turbines',
    models: [
      { frame: 'Siemens SGT-600', models: 'SGT-600 (GT10)', stages: 'Stage 1, 2, 3' },
      { frame: 'Siemens SGT-700', models: 'SGT-700', stages: 'Stage 1, 2, 3' },
      { frame: 'Siemens SGT-800', models: 'SGT-800 (GTX100)', stages: 'Stage 1, 2, 3' },
    ],
  },
  {
    oem: 'Solar Turbines',
    models: [
      { frame: 'Solar Taurus 60 / 70', models: 'Taurus 60, Taurus 70', stages: 'Stage 1, 2, 3' },
      { frame: 'Solar Mars 90 / 100', models: 'Mars 90, Mars 100', stages: 'Stage 1, 2, 3' },
      { frame: 'Solar Titan 130', models: 'Titan 130', stages: 'Stage 1, 2, 3' },
    ],
  },
];

const CONDITIONS = [
  {
    icon: Package,
    title: 'New',
    description: 'OEM-new and OEM-licensed shroud blocks and seal segments in original packaging with full material traceability, dimensional inspection reports, and manufacturer warranty.',
  },
  {
    icon: RefreshCw,
    title: 'Refurbished',
    description: 'Refurbished shrouds cleaned, NDT-inspected, weld-repaired, and recoated at certified repair shops to restore honeycomb land geometry and service life.',
  },
  {
    icon: Wrench,
    title: 'Serviceable',
    description: 'Used shroud segments with verified remaining life, full inspection records, and documented service history — a cost-effective bridge for unplanned outages.',
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

export default async function TurbineShroudsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Parts', url: `${prefix || ''}/parts` },
        { name: 'Turbine Shrouds', url: `${prefix || ''}/parts/turbine-shrouds` },
      ]} />
      <SchemaInjector pageKey="turbine-shrouds" />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Hot Gas Path
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              Gas Turbine Shrouds — Stage 1-3 Shroud Blocks
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              New, refurbished, and serviceable turbine shrouds for GE Frame 6B, 7FA, 9E,
              LM2500, Siemens, and Solar turbines. 5M+ NSN/CAGE parts. ISO 9001 &amp; AS9120
              certified. 24-hour quote response.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Overview
            </div>
            <h2 className="text-3xl font-black text-text mb-6">What Are Gas Turbine Shrouds?</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                Turbine shrouds (shroud blocks) are the stationary ring segments mounted on
                the nozzle platform directly above the rotating blade tips in each turbine
                stage. They define the flow-path outer diameter and carry a honeycomb or
                abradable land that the blade tips cut into during service, sealing the
                blade-tip gap against hot gas leakage. Every stage — 1, 2, and 3 — uses a
                distinct shroud block configuration with its own retention hardware, feather
                seals, and spring clips.
              </p>
              <p>
                Shrouds are among the most frequently replaced hot gas path components,
                typically swapped during combustion inspections (CI) and hot gas path
                inspections (HGP). Oxidation, distortion, and honeycomb wear at firing
                temperatures are common failure modes. Sourcing the correct OEM-equivalent
                shroud — matched by drawing number, build level, and firing temperature — is
                critical to maintain turbine clearances, heat rate, and emissions compliance.
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
              <h2 className="text-3xl font-black text-text">Shrouds by Frame, Model &amp; Stage</h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                We stock new, refurbished, and serviceable stage 1-3 shroud blocks and
                seal segments for all major turbine frames across GE, Siemens, and Solar.
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
                          <th className="text-left px-6 py-3 font-semibold text-text">Stages</th>
                          <th className="text-left px-6 py-3 font-semibold text-text">Model / Series</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.models.map((m) => (
                          <tr key={m.frame} className="border-b border-silver last:border-b-0 hover:bg-bg/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-text">{m.frame}</td>
                            <td className="px-6 py-4 text-text-muted">{m.stages}</td>
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
                Every shroud block and seal segment is inspected, documented, and classified by condition.
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
              <h2 className="text-3xl font-black text-text">Why Choose Us for Turbine Shrouds</h2>
              <p className="text-text-muted mt-2">
                We combine deep cross-OEM inventory with rigorous quality processes to keep
                your hot gas path sealed and your turbine online.
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
            <h2 className="text-3xl font-black text-text mb-4">Need a Shroud Block Fast?</h2>
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
            { href: '/parts/transition-pieces', label: 'Transition Pieces', description: 'Transition pieces and combustion ducts for can-annular turbine frames.' },
            { href: '/parts/fuel-nozzles', label: 'Fuel Nozzles', description: 'DLN and conventional fuel nozzle assemblies with OEM-equivalent flow numbers.' },
            { href: '/ge-frame-6b-parts', label: 'GE Frame 6B Parts', description: 'MS6001B hot gas path and combustion components for the 42 MW platform.' },
            { href: '/ms6001-parts', label: 'GE MS6001 Parts', description: 'Frame 6 turbine spares and components for the full MS6001 series.' },
            { href: '/ge-frame-7fa-parts', label: 'GE Frame 7FA Parts', description: 'MS7001FA hot gas path, combustion, and turbine components for the 7FA platform.' },
            { href: '/ms7001-parts', label: 'GE MS7001 Parts', description: 'Frame 7 turbine spares and components for the full MS7001 series.' },
            { href: '/ge-frame-9e-parts', label: 'GE Frame 9E Parts', description: 'MS9001E buckets, nozzles, transition pieces, and combustion hardware.' },
            { href: '/catalog', label: 'Browse Full Catalog', description: 'Search 5M+ NSN/CAGE parts across every turbine platform we support.' },
            { href: '/contact', label: 'Request a Quote', description: 'Submit your part numbers or NSNs for a binding quote within 24 hours.' },
          ]}
        />

      <Footer />
    </div>
  );
}
