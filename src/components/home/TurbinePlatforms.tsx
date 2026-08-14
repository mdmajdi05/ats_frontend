import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const PLATFORMS = [
  { slug: 'ge-gas-turbine-parts', label: 'GE Gas Turbine Parts', desc: 'Frame 6B, 7FA, 9E, LM2500, LM6000 & more' },
  { slug: 'ge-frame-6b-parts', label: 'GE Frame 6B Parts', desc: 'MS6001B hot gas path & combustion' },
  { slug: 'ge-frame-7fa-parts', label: 'GE Frame 7FA Parts', desc: 'MS7001FA turbine components' },
  { slug: 'ge-frame-9e-parts', label: 'GE Frame 9E Parts', desc: 'MS9001E buckets, nozzles & more' },
  { slug: 'ge-lm2500-parts', label: 'GE LM2500 Parts', desc: 'LM2500 / LM2500+ / LM2500+G4' },
  { slug: 'ge-lm6000-parts', label: 'GE LM6000 Parts', desc: 'LM6000-PC / LM6000-PF spares' },
  { slug: 'siemens-gas-turbine-parts', label: 'Siemens Gas Turbine Parts', desc: 'SGT-100 through SGT-800 range' },
  { slug: 'siemens-sgt800-parts', label: 'Siemens SGT-800 Parts', desc: 'SGT-800 blades, vanes & combustion' },
  { slug: 'rolls-royce-turbine-parts', label: 'Rolls-Royce Turbine Parts', desc: 'Industrial & aero-derived spares' },
  { slug: 'rolls-royce-rb211-parts', label: 'Rolls-Royce RB211 Parts', desc: 'RB211 hot section components' },
  { slug: 'solar-turbines-parts', label: 'Solar Turbines Parts', desc: 'Saturn, Centaur, Taurus, Mars, Titan' },
  { slug: 'parts/combustion-liners', label: 'Combustion Liners', desc: 'GE, Siemens, Rolls-Royce & Solar' },
  { slug: 'parts/fuel-nozzles', label: 'Fuel Nozzles', desc: 'DLN & conventional assemblies' },
  { slug: 'parts/turbine-blades', label: 'Turbine Blades', desc: 'Stage 1-3 buckets & nozzles' },
];

export default function TurbinePlatforms() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-[#4F46E5]" /> Turbine Platforms
          </div>
          <h2 className="text-3xl font-bold text-[#0A1628]">Gas Turbine Parts by Platform</h2>
          <p className="text-[#4A4A6A] mt-2 max-w-2xl mx-auto">
            Source certified spare parts for GE, Siemens, Rolls-Royce, and Solar Turbines platforms with full traceability.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PLATFORMS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group flex flex-col justify-between bg-[#F8F9FF] border border-silver/80 hover:border-[#4F46E5] rounded-xl p-5 transition-all duration-200 hover:shadow-md"
            >
              <div>
                <div className="font-bold text-[#0A1628] group-hover:text-[#4F46E5] transition-colors leading-snug">
                  {p.label}
                </div>
                <p className="text-xs text-[#4A4A6A] mt-1 leading-relaxed">{p.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[#4F46E5] text-xs font-semibold mt-3">
                Browse Parts <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
