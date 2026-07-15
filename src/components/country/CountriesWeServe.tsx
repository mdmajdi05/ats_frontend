'use client'

import { getCountriesByRegion, REGIONS } from '@/lib/countries'
import { Globe } from 'lucide-react'

export default function CountriesWeServe() {
  const grouped = getCountriesByRegion()

  const sortedRegions = Object.entries(grouped).sort(
    ([a], [b]) => (REGIONS[a]?.order ?? 99) - (REGIONS[b]?.order ?? 99)
  )

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-orange" />
            Global Reach
          </div>
          <h2 className="text-3xl font-black text-text">Countries We Serve</h2>
          <p className="text-text-muted mt-2 max-w-2xl mx-auto">
            With clients in over 150 countries, our logistics network covers every major air hub and military base.
            Here are our primary markets:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sortedRegions.map(([region, countries]) => (
            <div key={region} className="bg-bg border border-silver rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-orange" />
                <h3 className="text-lg font-bold text-text">
                  {REGIONS[region]?.label || region}
                </h3>
              </div>
              <div className="space-y-2">
                {countries.map((c) => (
                  <div key={c.code} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
