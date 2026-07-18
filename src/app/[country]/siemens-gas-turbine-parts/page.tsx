import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Clock, BadgeCheck, PackageSearch, Award, Cog, Flame, Gauge, Wind, ArrowRight, CheckCircle, Fuel, Thermometer, Fan, Settings2 } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Siemens Gas Turbine Spare Parts — SGT-100 to SGT-8000H',
  description: 'Source Siemens gas turbine spare parts for SGT-100, SGT-300, SGT-400, SGT-600, SGT-750, SGT-800, SGT5-2000E, SGT5-4000F & SGT5-8000H. 5M+ NSN/CAGE parts. ISO 9001 & AS9120 certified. 24-hour quotes.',
  keywords: [
    'Siemens gas turbine spare parts', 'SGT-100', 'SGT-300',
    'SGT-400', 'SGT-600', 'SGT-750', 'SGT-800',
    'SGT5-2000E', 'SGT5-4000F', 'SGT5-8000H',
    'Siemens V64.3', 'Siemens V94.2', 'Siemens V94.3',
    'SGT-A05', 'SGT-A35 RB211', 'Siemens turbine parts distributor',
    'Siemens combustion parts', 'Siemens hot gas path',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/siemens-gas-turbine-parts',
    languages: buildHreflang('/siemens-gas-turbine-parts'),
  },
  openGraph: {
    title: 'Siemens Gas Turbine Spare Parts — SGT-100 to SGT-8000H',
    description: 'Source Siemens gas turbine spare parts for SGT-100, SGT-300, SGT-400, SGT-600, SGT-750, SGT-800, SGT5-2000E, SGT5-4000F & SGT5-8000H. 5M+ NSN/CAGE parts. ISO 9001 & AS9120 certified.',
    url: 'https://aeroturbinespare.com/siemens-gas-turbine-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siemens Gas Turbine Spare Parts — SGT-100 to SGT-8000H',
    description: 'Source Siemens gas turbine spare parts for all SGT models. ISO 9001 & AS9120 certified. CAGE 8ATR9. 5M+ parts. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const SIEMENS_MODELS = [
  {
    model: 'SGT-100',
    class: 'Industrial',
    power: '5.2 MW',
    parts: ['Combustion Hardware', 'Fuel Nozzles', 'Control System Modules', 'Speedtronic Mark V/VI Cards', 'Flame Detectors', 'Servo Valves'],
  },
  {
    model: 'SGT-300',
    class: 'Industrial',
    power: '7.9 MW',
    parts: ['Hot Gas Path Components', 'Stage 1 & 2 Blades', 'Vanes', 'Tip Seals', 'Bearing Assemblies', 'Lube Oil Pumps'],
  },
  {
    model: 'SGT-400',
    class: 'Industrial',
    power: '12.9 MW',
    parts: ['Combustion Chambers', 'Transition Pieces', 'Thermocouples', 'Pressure Sensors', 'Actuators', 'IGV Systems'],
  },
  {
    model: 'SGT-600',
    class: 'Industrial',
    power: '24.0 MW',
    parts: ['Compressor Blades & Vanes', 'Turbine Discs', 'Bearings & Seals', 'Lube Oil Coolers', 'Hydraulic Power Units', 'Fuel Gas Skids'],
  },
  {
    model: 'SGT-750',
    class: 'Industrial',
    power: '37.0 MW',
    parts: ['Hot Gas Path Kits', 'Rotor Assemblies', 'Lube Oil Systems', 'Control Valves', 'Vibration Probes', 'Speed Pickups'],
  },
  {
    model: 'SGT-800',
    class: 'Industrial',
    power: '50.5 MW',
    parts: ['Combustion Liners', 'Burner Assemblies', 'IGV Actuators', 'Starter Motors', 'Air Filters', 'Electronic Controllers'],
  },
  {
    model: 'V64.3',
    class: 'Legacy Frame',
    power: '60+ MW',
    parts: ['Combustion Parts', 'Control Cards', 'Speed Sensors', 'Hydraulic Actuators', 'Fuel Valves', 'Exhaust Thermocouples'],
  },
  {
    model: 'SGT5-2000E / V94.2',
    class: 'Heavy-Duty',
    power: '160 MW',
    parts: ['Burners & Atomizers', 'Flame Detectors', 'Servo Valves', 'Turbine Blades', 'Guide Vanes', 'Hydraulic Skids'],
  },
  {
    model: 'SGT5-4000F / V94.3',
    class: 'Heavy-Duty',
    power: '270 MW',
    parts: ['Hot Gas Path', 'Blade 1 (Row 1)', 'Cooling Systems', 'Combustion Chambers', 'Exhaust Diffusers', 'Generator Breakers'],
  },
  {
    model: 'SGT5-8000H',
    class: 'Heavy-Duty',
    power: '450 MW',
    parts: ['Combustion System', 'Rotor Components', 'Exhaust Diffuser', 'Compressor Blades', 'Turbine Vanes', 'Control Systems'],
  },
  {
    model: 'SGT-A05',
    class: 'Aeroderivative',
    power: '5.4 MW',
    parts: ['Gas Generator', 'Power Turbine Blades', 'Fuel Manifolds', 'Ignition Exciter', 'Torque Meters', 'Control Modules'],
  },
  {
    model: 'SGT-A35 / RB211',
    class: 'Aeroderivative',
    power: '32 MW',
    parts: ['RB211 Gas Generator Parts', 'Power Turbine Assembly', 'Combustion Liners', 'Fuel Nozzles', 'Lube Oil Pumps', 'Control Systems'],
  },
];

const WHY_CHOOSE = [
  {
    icon: Shield,
    title: 'Zero Counterfeit Policy',
    description: 'Every Siemens part is verified through our multi-stage inspection process. We reject any component without full chain-of-custody documentation and OEM traceability.',
  },
  {
    icon: Clock,
    title: '24-Hour Quote Guarantee',
    description: 'Submit your Siemens RFQ and receive a firm quote within 24 hours. AOG requests are prioritized for same-day turnaround.',
  },
  {
    icon: BadgeCheck,
    title: 'CAGE Code 8ATR9',
    description: 'Our US DoD-registered CAGE code confirms we are an approved government contractor authorized to supply Siemens-compatible parts to defense and energy projects.',
  },
  {
    icon: Award,
    title: 'ISO 9001 & AS9120 Certified',
    description: 'Independently audited quality management system covering procurement, inspection, storage, and worldwide distribution of turbine components.',
  },
  {
    icon: PackageSearch,
    title: '5 Million+ Parts Available',
    description: 'One of the largest independent inventories of Siemens gas turbine components — including NSN-referenced, OEM-surplus, and certified aftermarket parts.',
  },
];

const INDUSTRIAL_PARTS = [
  { model: 'SGT-100', parts: ['DLE Fuel Nozzles', 'Combustion Chambers', 'Mark V/VI Control Cards', 'Flame Detectors'], icon: Flame },
  { model: 'SGT-300', parts: ['Compressor Blades', 'Turbine Vanes', 'Journal Bearings', 'Lube Oil Pumps'], icon: Cog },
  { model: 'SGT-400', parts: ['Transition Pieces', 'Thermocouple Assemblies', 'Servo Valves', 'IGV Positioners'], icon: Gauge },
  { model: 'SGT-600', parts: ['Turbine Discs', 'Balance Pistons', 'Fuel Gas Regulators', 'Hydraulic Actuators'], icon: Wind },
  { model: 'SGT-750', parts: ['Hot Gas Path Kits', 'Vibration Probes', 'Speed Sensors', 'Rotor Components'], icon: Fan },
  { model: 'SGT-800', parts: ['Combustion Liners', 'Burner Tips', 'Starter Motors', 'Electronic Controllers'], icon: Cog },
];

const HEAVY_DUTY_PARTS = [
  { model: 'SGT5-2000E / V94.2', parts: ['Burner Assemblies', 'Flame Detectors', 'Servo Valves', 'Turbine Blades', 'Compressor Vanes', 'Hydraulic Actuators', 'Lube Oil Systems'] },
  { model: 'SGT5-4000F / V94.3', parts: ['Hot Gas Path Components', 'Stage 1 Blades', 'Cooling Air Systems', 'Combustion Chambers', 'Exhaust Diffusers', 'Control Valves', 'Vibration Monitoring'] },
  { model: 'SGT5-8000H', parts: ['Combustion Systems', 'Rotor Assemblies', 'Exhaust Diffusers', 'Compressor Blading', 'Turbine Vanes', 'Advanced Control Systems', 'Generator Components'] },
];

const AERO_PARTS = [
  { model: 'SGT-A05', parts: ['Gas Generator Module', 'Power Turbine Nozzle', 'Fuel Manifolds', 'Ignition System', 'Digital Control', 'Torque Meter'] },
  { model: 'SGT-A35 / RB211', parts: ['RB211 Gas Generator', 'Power Turbine Blades', 'Combustion Hardware', 'Fuel Metering', 'Lube Oil System', 'Electronic Governor'] },
];

export default async function SiemensGasTurbinePage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Siemens Gas Turbine Parts', url: `${prefix || ''}/siemens-gas-turbine-parts` },
      ]} />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Siemens Gas Turbines
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
              Siemens Gas Turbine Spare Parts
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed mb-4">
              Certified spare parts for every major Siemens gas turbine platform —
              from the <strong className="text-white">SGT-100</strong> to the <strong className="text-white">SGT5-8000H</strong>, including legacy V-frame models.
            </p>
            <p className="text-silver/60 max-w-2xl mx-auto">
              Combustion hardware, hot gas path components, control systems, rotating assemblies, and lube oil systems.
              ISO 9001 &amp; AS9120 certified. CAGE 8ATR9. 24-hour quotes.
            </p>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Model Reference
              </div>
              <h2 className="text-3xl font-black text-text">Siemens SGT Engine &amp; Frame Overview</h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Complete parts support across the full Siemens gas turbine portfolio — industrial, heavy-duty legacy frames, and aeroderivative.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left py-3 px-4 font-bold">Model</th>
                    <th className="text-left py-3 px-4 font-bold">Class</th>
                    <th className="text-left py-3 px-4 font-bold hidden sm:table-cell">Power Output</th>
                    <th className="text-left py-3 px-4 font-bold">Available Part Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {SIEMENS_MODELS.map((m, i) => (
                    <tr key={m.model} className={i % 2 === 0 ? 'bg-white' : 'bg-bg'}>
                      <td className="py-3 px-4 font-semibold text-text whitespace-nowrap">{m.model}</td>
                      <td className="py-3 px-4 text-text-muted">{m.class}</td>
                      <td className="py-3 px-4 text-text-muted hidden sm:table-cell">{m.power}</td>
                      <td className="py-3 px-4 text-text-muted max-w-md">
                        <div className="flex flex-wrap gap-1">
                          {m.parts.slice(0, 4).map((p) => (
                            <span key={p} className="inline-block bg-orange/10 text-orange text-xs font-medium px-2 py-0.5 rounded-full">
                              {p}
                            </span>
                          ))}
                          {m.parts.length > 4 && (
                            <span className="inline-block text-text-muted text-xs px-1 py-0.5">
                              +{m.parts.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted text-center mt-4">
              Legacy Siemens designations V64.3, V94.2, and V94.3 are fully supported under their current SGT model numbers.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why AeroTurbineSpare
              </div>
              <h2 className="text-3xl font-black text-text">Why Choose Us for Siemens Parts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {WHY_CHOOSE.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-bg border border-silver rounded-2xl p-6 text-center hover:border-orange/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-sm font-bold text-text mb-2">{item.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Industrial Class
              </div>
              <h2 className="text-3xl font-black text-text">Siemens Industrial Gas Turbines — SGT-100 to SGT-800</h2>
              <p className="text-text-muted mt-2 max-w-3xl mx-auto">
                Our inventory covers every major sub-system for Siemens industrial gas turbines used in oil &amp; gas,
                power generation, cogeneration, and mechanical drive applications worldwide.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INDUSTRIAL_PARTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.model} className="bg-white border border-silver rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-orange" />
                      </div>
                      <h3 className="text-lg font-bold text-text">{item.model}</h3>
                    </div>
                    <ul className="space-y-2">
                      {item.parts.map((part) => (
                        <li key={part} className="flex items-start gap-2 text-sm text-text-muted">
                          <CheckCircle className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                          {part}
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Heavy-Duty Frame
              </div>
              <h2 className="text-3xl font-black text-text">Siemens Heavy-Duty Gas Turbines</h2>
              <p className="text-text-muted mt-2 max-w-3xl mx-auto">
                Large-frame Siemens turbines power the world&apos;s most demanding combined cycle and simple cycle
                power plants. We supply certified parts for planned outages, forced derates, and AOG situations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HEAVY_DUTY_PARTS.map((item) => (
                <div key={item.model} className="bg-bg border border-silver rounded-2xl p-6 hover:border-orange/30 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                      <Cog className="w-5 h-5 text-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-text">{item.model}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.parts.map((part) => (
                      <li key={part} className="flex items-start gap-2 text-sm text-text-muted">
                        <CheckCircle className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                        {part}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Aeroderivative
              </div>
              <h2 className="text-3xl font-black text-text">Siemens Aeroderivative Gas Turbines</h2>
              <p className="text-text-muted mt-2 max-w-3xl mx-auto">
                Derived from proven aircraft engine cores, Siemens aeroderivative turbines deliver high power density
                for offshore, pipeline, and peaking power applications where compact footprint and rapid start-up are critical.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {AERO_PARTS.map((item) => (
                <div key={item.model} className="bg-white border border-silver rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                      <Wind className="w-5 h-5 text-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-text">{item.model}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.parts.map((part) => (
                      <li key={part} className="flex items-start gap-2 text-sm text-text-muted">
                        <CheckCircle className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                        {part}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-6">
              Need Siemens Gas Turbine Parts?
            </h2>
            <p className="text-silver/80 text-lg mb-8 max-w-2xl mx-auto">
              Submit your RFQ today for a firm quote within 24 hours. AOG requests receive priority handling.
              Every part ships with full traceability and certification documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${prefix || ''}/contact`}
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-dark transition-colors text-lg"
              >
                Request a Quote
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={`${prefix || ''}/catalog`}
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
              >
                Browse Siemens Parts
                <PackageSearch className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <SchemaInjector pageKey="siemens-gas-turbine-parts" />
      </main>

      <Footer />
    </div>
  );
}
