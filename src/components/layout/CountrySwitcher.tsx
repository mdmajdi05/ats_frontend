'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCountry } from '@/hooks/useCountry'
import { getCountriesByRegion, REGIONS, getCountry, COUNTRIES } from '@/lib/countries'
import { cn } from '@/lib/utils'

export default function CountrySwitcher() {
  const { country, switchCountry } = useCountry()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = getCountry(country)
  const grouped = getCountriesByRegion()

  const sortedRegions = Object.entries(grouped).sort(
    ([a], [b]) => (REGIONS[a]?.order ?? 99) - (REGIONS[b]?.order ?? 99)
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors text-xs"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-[#C0C9D5]">{current.code.toUpperCase()}</span>
        <ChevronDown className={cn('w-3 h-3 text-[#C0C9D5] transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-2xl border border-[#E8EDF2] z-[100] max-h-80 overflow-y-auto">
          {sortedRegions.map(([region, countries]) => (
            <div key={region}>
              <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#4A4A6A]">
                {REGIONS[region]?.label || region}
              </div>
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { switchCountry(c.code); setOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F5F7FA] transition-colors',
                    c.code === country ? 'bg-orange/5 text-orange font-semibold' : 'text-[#1A1A2E]'
                  )}
                >
                  <span className="text-base">{c.flag}</span>
                  <span>{c.name}</span>
                  {c.code === country && (
                    <span className="ml-auto text-[10px] text-orange font-bold">CURRENT</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
