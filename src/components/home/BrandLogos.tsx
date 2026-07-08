'use client';

import { useState, useEffect, useRef } from 'react';

const BRAND_LOGOS = [
  { name: 'General Electric', initials: 'GE' },
  { name: 'Pratt & Whitney', initials: 'P&W' },
  { name: 'Rolls-Royce', initials: 'RR' },
  { name: 'Honeywell', initials: 'HON' },
  { name: 'Boeing', initials: 'BOE' },
  { name: 'Airbus', initials: 'AIR' },
  { name: 'Siemens', initials: 'SIE' },
  { name: 'Collins Aerospace', initials: 'COL' },
];

const COLORS = [
  'text-blue-600 bg-blue-50',
  'text-red-600 bg-red-50',
  'text-teal-600 bg-teal-50',
  'text-orange-600 bg-orange-50',
  'text-indigo-600 bg-indigo-50',
  'text-cyan-600 bg-cyan-50',
  'text-green-600 bg-green-50',
  'text-purple-600 bg-purple-50',
];

export default function BrandLogos() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(false);
  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-12 bg-white border-y border-silver">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Trusted OEM &amp; Manufacturer Partners
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {BRAND_LOGOS.map((brand, i) => (
            <div
              key={brand.name}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-silver hover:shadow-sm hover:border-orange/20 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black ${COLORS[i % COLORS.length]}`}
              >
                {brand.initials}
              </div>
              <span className="text-sm font-semibold text-text whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
