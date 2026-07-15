'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plane, Settings, Flame, Fuel, Activity, Cpu, Radio,
  Thermometer, Shield, Zap, Package, Hash, BadgeCheck, Search,
  Anchor, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import siteCategories from '@/data/site-categories.json';

const ICON_MAP: Record<string, React.ElementType> = {
  plane: Plane, settings: Settings, flame: Flame, fuel: Fuel,
  activity: Activity, cpu: Cpu, radio: Radio, thermometer: Thermometer,
  shield: Shield, zap: Zap, package: Package, hash: Hash,
  badgecheck: BadgeCheck, search: Search, anchor: Anchor,
};

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Aero-Derivative Gas Turbines': {
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500',
  },
  'Heavy-Duty Gas Turbines': {
    bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500',
  },
  'Turbine Hot Gas Path': {
    bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500',
  },
  'Control & Monitoring': {
    bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500',
  },
  'Rotating & Support Components': {
    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500',
  },
  'Power Generation & Auxiliary': {
    bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500',
  },
  'Procurement Services': {
    bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500',
  },
};

function getGroupColor(group: string) {
  return GROUP_COLORS[group] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };
}

export default function CategoriesSection() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = [...new Set(siteCategories.map((c) => c.group))];

  const filtered = activeGroup
    ? siteCategories.filter((c) => c.group === activeGroup)
    : siteCategories;

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#F0F4F8] via-white to-[#F8F9FF] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-brand" /> Categories <span className="w-6 h-px bg-brand" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-3">
            Browse by Product Category
          </h2>
          <p className="text-[#4A4A6A] max-w-2xl mx-auto text-base">
            Find exactly what you need — organized by turbine platform, component type, or procurement method.
          </p>
        </div>

        {/* Group filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveGroup(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all border',
              !activeGroup
                ? 'bg-navy text-white border-navy shadow-md'
                : 'bg-white text-[#4A4A6A] border-silver hover:border-navy/30 hover:text-navy'
            )}
          >
            All Categories
          </button>
          {groups.map((g) => {
            const colors = getGroupColor(g);
            return (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                  activeGroup === g
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm`
                    : 'bg-white text-[#4A4A6A] border-silver hover:border-navy/30 hover:text-navy'
                )}
              >
                <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle', getGroupColor(g).dot)} />
                {g}
              </button>
            );
          })}
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.slice(0, 12).map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            const colors = getGroupColor(cat.group);
            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-silver/80 hover:border-brand/30 p-5 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(79,70,229,0.15)] hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                    colors.bg
                  )}>
                    <Icon className={cn('w-6 h-6', colors.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded', colors.bg, colors.text)}>
                        {cat.group}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0A1628] group-hover:text-brand transition-colors leading-snug mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#4A4A6A]/70 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-silver/60">
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {cat.partCount.toLocaleString()} parts
                      </span>
                      <span className="text-brand/60 group-hover:text-brand transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-all shadow-lg hover:shadow-xl group"
          >
            View All Categories
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
