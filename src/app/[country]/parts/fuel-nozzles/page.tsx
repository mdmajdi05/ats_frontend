import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Flame, Shield, Zap, Truck, ClipboardCheck, ArrowRight, RefreshCw, Wrench, Search, Package, Droplets, Wind } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Gas Turbine Fuel Nozzles — GE, Siemens, Rolls-Royce & Solar',
  description: 'Source new, refurbished & serviceable gas turbine fuel nozzles for GE DLN, Siemens SGT, Rolls-Royce & Solar Turbines. 5M+ parts. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'gas turbine fuel nozzles', 'GE fuel nozzle', 'Siemens SGT fuel nozzle',
    'Rolls-Royce fuel nozzle', 'Solar Turbines fuel nozzle',
    'GE DLN fuel nozzle', 'GE Frame 6B fuel nozzle', 'GE Frame 7FA fuel nozzle',
    'LM2500 fuel nozzle', 'LM6000 fuel nozzle',
    'new fuel nozzles', 'refurbished fuel nozzles', 'serviceable fuel nozzles',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/parts/fuel-nozzles',
    languages: buildHreflang('/parts/fuel-nozzles'),
  },
  openGraph: {
    title: 'Gas Turbine Fuel Nozzles — GE, Siemens, Rolls-Royce & Solar',
    description: 'Source new, refurbished & serviceable gas turbine fuel nozzles for GE DLN, Siemens SGT, Rolls-Royce & Solar Turbines. 5M+ parts. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/parts/fuel-nozzles',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Fuel Nozzles — GE, Siemens, Rolls-Royce & Solar',
    description: 'New, refurbished & serviceable gas turbine fuel nozzles for GE, Siemens, Rolls-Royce & Solar Turbines. 5M+ parts. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const TYPES = [
  {
    icon: Flame,
    title: 'DLN Nozzles',
    description: 'Dry Low NOx fuel nozzles designed for lean-premixed combustion. Compatible with GE DLN-1, DLN-2.0, DLN-2.6, and DLN-2.6+ combustion systems for Frame 6B, 7E, 7FA, 9E, and 9FA turbines.',
  },
  {
    icon: Droplets,
    title: 'MNQC Nozzles',
    description: 'Multi-Nozzle Quiet Combustion fuel nozzles for GE HA-class turbines. Precision-engineered for ultra-low emissions and extended maintenance intervals on 7HA and 9HA platforms.',
  },
  {
    icon: Wind,
    title: 'Primary & Secondary Nozzles',
    description: 'Primary (pilot) and secondary (main) fuel nozzles for staged combustion systems. Each nozzle is flow-tested and matched to ensure even fuel distribution across all combustor baskets.',
  },
  {
    icon: Droplets,
    title: 'Liquid Fuel Nozzles',
    description: 'Atomizing fuel nozzles for liquid fuel operation including diesel, heavy fuel oil (HFO), and crude. Designed for dual-fuel turbines requiring reliable liquid fuel backup capability.',
  },
  {
    icon: Wind,
    title: 'Gas Fuel Nozzles',
    description: 'Gas-only and dual-fuel gas nozzles for natural gas, landfill gas, and syngas applications. Available with various tip configurations to match specific fuel composition and heating value.',
  },
];

const FRAMES = [
  {
    oem: 'GE Gas Turbines',
    models: [
      { frame: 'GE Frame 6B', models: 'MS6001B — DLN-1 / DLN-2.0' },
      { frame: 'GE Frame 7E', models: 'MS7001E — DLN-1 / Standard' },
      { frame: 'GE Frame 7EA', models: 'MS7001EA — DLN-1 / DLN-2.0+' },
      { frame: 'GE Frame 7FA', models: 'MS7001FA — DLN-2.0 / DLN-2.6' },
      { frame: 'GE Frame 9E', models: 'MS9001E — DLN-1 / DLN-2.0' },
      { frame: 'GE Frame 9FA', models: 'MS9001FA — DLN-2.0 / DLN-2.6' },
      { frame: 'GE LM2500', models: 'LM2500 / LM2500+ / LM2500+G4' },
      { frame: 'GE LM6000', models: 'LM6000 / LM6000-PC / LM6000-PF' },
    ],
  },
  {
    oem: 'Siemens Gas Turbines',
    models: [
      { frame: 'Siemens SGT-100', models: 'SGT-100' },
      { frame: 'Siemens SGT-200', models: 'SGT-200' },
      { frame: 'Siemens SGT-300', models: 'SGT-300' },
      { frame: 'Siemens SGT-400', models: 'SGT-400' },
      { frame: 'Siemens SGT-500', models: 'SGT-500' },
      { frame: 'Siemens SGT-600', models: 'SGT-600' },
      { frame: 'Siemens SGT-700', models: 'SGT-700' },
      { frame: 'Siemens SGT-800', models: 'SGT-800' },
    ],
  },
  {
    oem: 'Rolls-Royce',
    models: [
      { frame: 'Rolls-Royce Avon', models: 'Avon' },
      { frame: 'Rolls-Royce RB211', models: 'RB211' },
    ],
  },
  {
    oem: 'Solar Turbines',
    models: [
      { frame: 'Solar Saturn', models: 'Saturn' },
      { frame: 'Solar Centaur', models: 'Centaur' },
      { frame: 'Solar Mercury', models: 'Mercury' },
      { frame: 'Solar Taurus', models: 'Taurus' },
      { frame: 'Solar Mars', models: 'Mars' },
      { frame: 'Solar Titan', models: 'Titan' },
    ],
  },
];

const CONDITIONS = [
  {
    icon: Package,
    title: 'New',
    description: 'OEM-new fuel nozzles in original factory packaging with full manufacturer warranty, certified documentation, and complete traceability to the original equipment manufacturer.',
  },
  {
    icon: RefreshCw,
    title: 'Refurbished',
    description: 'Professionally refurbished fuel nozzles that have been cleaned, inspected, flow-tested, and returned to serviceable condition by certified repair facilities. Backed by our service warranty.',
  },
  {
    icon: Wrench,
    title: 'Serviceable',
    description: 'Used fuel nozzles removed from service with remaining life. Each unit is visually inspected, tagged with condition code, and sold with full disclosure of service history and remaining cycles where available.',
  },
];

const WHY_US = [
  {
    icon: ClipboardCheck,
    title: 'Certified Quality',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every fuel nozzle is inspected, documented, and traced to its original source. Full traceability package included with every shipment.',
  },
  {
    icon: Search,
    title: 'Massive Inventory',
    description: 'Access to 5 million+ parts in our catalog including hard-to-find fuel nozzles for legacy turbine frames. We stock parts for GE, Siemens, Rolls-Royce, Solar, and other major OEMs.',
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

export default async function FuelNozzlesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Parts', url: `${prefix || ''}/parts` },
        { name: 'Fuel Nozzles', url: `${prefix || ''}/parts/fuel-nozzles` },
      ]} />
      <SchemaInjector pageKey="fuel-nozzles" />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Fuel System
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              Fuel Nozzles for All Major Turbine Frames
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Source new, refurbished, and serviceable fuel nozzles for GE,
              Siemens, Rolls-Royce, and Solar Turbines. 5M+ parts in catalog.
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
            <h2 className="text-3xl font-black text-text mb-6">What Is a Fuel Nozzle?</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                A fuel nozzle is the precision component that injects and atomizes fuel
                into the combustion chamber of a gas turbine. It determines how efficiently
                fuel mixes with compressed air, directly impacting flame stability, emissions
                output, combustion dynamics, and overall turbine performance. Also referred to
                as a fuel injector or atomizer, it is one of the most critical wear items in
                the hot gas path.
              </p>
              <p>
                Modern gas turbines use advanced nozzle designs such as Dry Low NOx (DLN)
                and Multi-Nozzle Quiet Combustion (MNQC) systems to achieve stringent
                emissions targets while maintaining stable combustion across all load ranges.
                Whether you need a replacement for a scheduled outage, an upgrade to a newer
                emissions-compliant design, or an emergency AOG situation, AeroTurbineSpare
                stocks a wide range of fuel nozzles for the most common industrial and
                aeroderivative gas turbine frames.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Nozzle Types
              </div>
              <h2 className="text-3xl font-black text-text">Fuel Nozzle Types We Supply</h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                From DLN to liquid fuel atomizers, we carry every major fuel nozzle configuration.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TYPES.map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.title} className="bg-white border border-silver rounded-2xl p-6 hover:border-orange/30 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">{t.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{t.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Turbine Frames
              </div>
              <h2 className="text-3xl font-black text-text">Fuel Nozzles by Frame</h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                We stock fuel nozzles for the most widely deployed industrial and
                aeroderivative gas turbine models across every major OEM.
              </p>
            </div>
            <div className="space-y-8">
              {FRAMES.map((group) => (
                <div key={group.oem} className="bg-bg border border-silver rounded-2xl overflow-hidden">
                  <div className="bg-navy text-white px-6 py-4">
                    <h3 className="text-lg font-bold">{group.oem}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-silver bg-white">
                          <th className="text-left px-6 py-3 font-semibold text-text">Turbine Frame</th>
                          <th className="text-left px-6 py-3 font-semibold text-text">Model / Combustion System</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.models.map((m) => (
                          <tr key={m.frame} className="border-b border-silver last:border-b-0 hover:bg-white/50 transition-colors bg-white">
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

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Part Conditions
              </div>
              <h2 className="text-3xl font-black text-text">Conditions We Offer</h2>
              <p className="text-text-muted mt-2">
                Every fuel nozzle is inspected, documented, and classified by condition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONDITIONS.map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.title} className="bg-white border border-silver rounded-2xl p-6 hover:border-orange/30 hover:shadow-md transition-all duration-200">
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

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why AeroTurbineSpare
              </div>
              <h2 className="text-3xl font-black text-text">Why Choose Us for Fuel Nozzles</h2>
              <p className="text-text-muted mt-2">
                We combine deep inventory with rigorous quality processes to deliver the right part, on time, every time.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="bg-bg border border-silver rounded-2xl p-6 text-center hover:border-orange/30 hover:shadow-md transition-all duration-200">
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

        <section className="bg-bg py-16 px-4 border-t border-silver">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Get a Quote
            </div>
            <h2 className="text-3xl font-black text-text mb-4">Need a Fuel Nozzle Fast?</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Submit your RFQ and receive a competitive, certified quote within 24 hours.
              AOG inquiries are escalated for same-day response. No minimum order quantities.
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
