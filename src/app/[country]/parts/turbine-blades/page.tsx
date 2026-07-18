import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Zap, Truck, ClipboardCheck, Search, Package, RefreshCw, Wrench, ArrowRight } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Gas Turbine Blades & Buckets — Stage 1, 2, 3 for All Major Frames',
  description: 'Source new, refurbished & serviceable gas turbine blades and buckets for GE, Siemens, Rolls-Royce & Solar Turbines. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'gas turbine blades', 'gas turbine buckets', 'turbine blade stage 1', 'turbine blade stage 2', 'turbine blade stage 3',
    'GE turbine blades', 'Siemens turbine blades', 'Rolls-Royce turbine blades', 'Solar Turbines blades',
    'GE Frame 6B blades', 'GE Frame 7FA blades', 'GE Frame 9E blades',
    'LM2500 turbine blades', 'LM6000 turbine blades',
    'new turbine buckets', 'refurbished turbine buckets', 'serviceable turbine buckets',
    'hot gas path blades', 'HGP blades',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/parts/turbine-blades',
    languages: buildHreflang('/parts/turbine-blades'),
  },
  openGraph: {
    title: 'Gas Turbine Blades & Buckets — Stage 1, 2, 3 for All Major Frames',
    description: 'Source new, refurbished & serviceable gas turbine blades and buckets for GE, Siemens, Rolls-Royce & Solar Turbines. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/parts/turbine-blades',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Blades & Buckets — Stage 1, 2, 3 for All Major Frames',
    description: 'Source new, refurbished & serviceable gas turbine blades and buckets for GE, Siemens, Rolls-Royce & Solar Turbines. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const FRAMES = [
  {
    oem: 'GE Gas Turbines',
    models: [
      { frame: 'GE Frame 6B', stages: 'Stage 1, 2, 3', models: 'MS6001B' },
      { frame: 'GE Frame 7E', stages: 'Stage 1, 2, 3', models: 'MS7001E' },
      { frame: 'GE Frame 7EA', stages: 'Stage 1, 2, 3', models: 'MS7001EA' },
      { frame: 'GE Frame 7FA', stages: 'Stage 1, 2, 3', models: 'MS7001FA' },
      { frame: 'GE Frame 9E', stages: 'Stage 1, 2, 3', models: 'MS9001E' },
      { frame: 'GE Frame 9FA', stages: 'Stage 1, 2, 3', models: 'MS9001FA' },
      { frame: 'GE LM2500', stages: 'Stage 1, 2, 3', models: 'LM2500 / LM2500+ / LM2500+G4' },
      { frame: 'GE LM6000', stages: 'Stage 1, 2, 3', models: 'LM6000 / LM6000-PC / LM6000-PF' },
      { frame: 'GE Frame 5', stages: 'Stage 1, 2', models: 'MS5001 / MS5002' },
    ],
  },
  {
    oem: 'Siemens Gas Turbines',
    models: [
      { frame: 'Siemens SGT-100', stages: 'Stage 1, 2, 3', models: 'SGT-100' },
      { frame: 'Siemens SGT-200', stages: 'Stage 1, 2, 3', models: 'SGT-200' },
      { frame: 'Siemens SGT-300', stages: 'Stage 1, 2, 3', models: 'SGT-300' },
      { frame: 'Siemens SGT-400', stages: 'Stage 1, 2, 3', models: 'SGT-400' },
      { frame: 'Siemens SGT-500', stages: 'Stage 1, 2, 3', models: 'SGT-500' },
      { frame: 'Siemens SGT-600', stages: 'Stage 1, 2, 3', models: 'SGT-600' },
      { frame: 'Siemens SGT-700', stages: 'Stage 1, 2, 3', models: 'SGT-700' },
      { frame: 'Siemens SGT-800', stages: 'Stage 1, 2, 3', models: 'SGT-800' },
    ],
  },
  {
    oem: 'Rolls-Royce',
    models: [
      { frame: 'Rolls-Royce Avon', stages: 'Stage 1, 2', models: 'Avon' },
      { frame: 'Rolls-Royce RB211', stages: 'Stage 1, 2, 3', models: 'RB211' },
    ],
  },
  {
    oem: 'Solar Turbines',
    models: [
      { frame: 'Solar Saturn', stages: 'Stage 1, 2', models: 'Saturn' },
      { frame: 'Solar Centaur', stages: 'Stage 1, 2', models: 'Centaur' },
      { frame: 'Solar Mercury', stages: 'Stage 1, 2', models: 'Mercury' },
      { frame: 'Solar Taurus', stages: 'Stage 1, 2, 3', models: 'Taurus' },
      { frame: 'Solar Mars', stages: 'Stage 1, 2, 3', models: 'Mars' },
      { frame: 'Solar Titan', stages: 'Stage 1, 2, 3', models: 'Titan' },
    ],
  },
];

const CONDITIONS = [
  {
    icon: Package,
    title: 'New',
    description: 'OEM-new turbine blades and buckets in original factory packaging with full manufacturer warranty, certified material traceability, and complete documentation from the original equipment manufacturer.',
  },
  {
    icon: RefreshCw,
    title: 'Refurbished',
    description: 'Professionally refurbished blades and buckets that have undergone cleaning, NDT inspection, dimensional verification, and coating restoration by certified repair facilities. Backed by our service warranty.',
  },
  {
    icon: Wrench,
    title: 'Serviceable',
    description: 'Used blades and buckets with verified remaining service life. Each unit is visually and dimensionally inspected, tagged with condition code, and sold with full disclosure of service history and remaining cycles where available.',
  },
];

const WHY_US = [
  {
    icon: ClipboardCheck,
    title: 'Certified Quality',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every blade and bucket is inspected, documented, and traced to its original source. Full traceability package included with every shipment.',
  },
  {
    icon: Search,
    title: 'Massive Inventory',
    description: 'Access to 5 million+ NSN and CAGE-referenced parts including new, refurbished, and serviceable blades and buckets for legacy and current turbine frames across every major OEM.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'Submit an RFQ and receive a competitive, certified quote within 24 hours. AOG situations are escalated for same-day turnaround. No minimum order quantities required.',
  },
  {
    icon: Truck,
    title: 'Global Logistics',
    description: 'Ship to 150+ countries through our logistics network. We handle all export compliance, ITAR documentation, and arrange door-to-door delivery for urgent and scheduled orders alike.',
  },
];

export default async function TurbineBladesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Parts', url: `${prefix || ''}/parts` },
        { name: 'Turbine Blades', url: `${prefix || ''}/parts/turbine-blades` },
      ]} />
      <SchemaInjector pageKey="turbine-blades" />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Hot Gas Path
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              Turbine Blades &amp; Buckets
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Source new, refurbished, and serviceable gas turbine blades and buckets
              for GE, Siemens, Rolls-Royce, and Solar Turbines. 5M+ NSN/CAGE parts in catalog.
              ISO 9001 &amp; AS9120 certified. 24-hour quote response.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Overview
            </div>
            <h2 className="text-3xl font-black text-text mb-6">What Are Turbine Blades &amp; Buckets?</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                Turbine blades (also referred to as buckets in industrial gas turbines) are
                the airfoil-shaped components mounted on the turbine rotor that extract energy
                from the hot combustion gas stream. Each stage consists of a row of stationary
                nozzles (vanes) followed by a row of rotating blades. The expanding gas passes
                through stages 1, 2, and 3 — and in some frames, stage 4 — progressively converting
                thermal and kinetic energy into rotational mechanical power.
              </p>
              <p>
                Because they operate at extreme temperatures and centrifugal loads, blades and
                buckets are manufactured from specialised superalloys with advanced thermal barrier
                coatings, internal cooling channels, and precision airfoil geometry. Over time, they
                are subject to creep, oxidation, thermal-mechanical fatigue, and foreign object damage.
                Regular inspection and stage-specific replacement during planned outages are essential
                for maintaining turbine efficiency, emissions compliance, and safe operation.
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
              <h2 className="text-3xl font-black text-text">Blades &amp; Buckets by Frame and Stage</h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                We stock new, refurbished, and serviceable blades and buckets for all major
                turbine frames — available in stage 1, 2, and 3 configurations.
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
                Every blade and bucket is inspected, documented, and classified by condition.
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
              <h2 className="text-3xl font-black text-text">Why Choose Us for Turbine Blades &amp; Buckets</h2>
              <p className="text-text-muted mt-2">
                We combine deep inventory with rigorous quality processes to deliver the right part, on time, every time.
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
            <h2 className="text-3xl font-black text-text mb-4">Need Blades or Buckets Fast?</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Submit your RFQ with part numbers or NSN references and receive a competitive,
              certified quote within 24 hours. AOG inquiries are escalated for same-day response.
              No minimum order quantities.
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

      <Footer />
    </div>
  );
}
