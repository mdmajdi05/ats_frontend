'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Search as SearchIcon, ArrowRight, Package,
  Settings, Gauge, Cpu, Wrench, Zap, Truck, ShieldCheck,
  BarChart3, Box, CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import siteCategories from '@/data/site-categories.json';

const GROUP_META: Record<string, {
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  accentBorder: string;
  description: string;
}> = {
  'Aero-Derivative Gas Turbines': {
    icon: Gauge,
    accent: 'text-blue-700',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    description: 'LM2500, LM6000, LM9000, LMS100 and other aero-derivative platform components',
  },
  'Heavy-Duty Gas Turbines': {
    icon: Settings,
    accent: 'text-purple-700',
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    description: 'GE Frame, Siemens, and heavy-duty industrial turbine hardware',
  },
  'Turbine Hot Gas Path': {
    icon: Zap,
    accent: 'text-orange-700',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    description: 'Blades, nozzles, combustion liners, and hot-section components',
  },
  'Control & Monitoring': {
    icon: Cpu,
    accent: 'text-cyan-700',
    accentBg: 'bg-cyan-50',
    accentBorder: 'border-cyan-200',
    description: 'Mark VIe, PLC systems, sensors, actuators, and control hardware',
  },
  'Rotating & Support Components': {
    icon: CircleDot,
    accent: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    description: 'Bearings, seals, shafts, couplings, and rotating element assemblies',
  },
  'Power Generation & Auxiliary': {
    icon: BarChart3,
    accent: 'text-amber-700',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    description: 'Generators, transformers, lube oil systems, and balance-of-plant',
  },
  'Procurement Services': {
    icon: Truck,
    accent: 'text-rose-700',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-200',
    description: 'Sourcing, kitting, AOG support, and global logistics solutions',
  },
  'Aviation Test Equipment': {
    icon: Wrench,
    accent: 'text-indigo-700',
    accentBg: 'bg-indigo-50',
    accentBorder: 'border-indigo-200',
    description: 'Test stands, calibration tools, and aviation maintenance equipment',
  },
};

function getGroupMeta(group: string) {
  return GROUP_META[group] || {
    icon: Box,
    accent: 'text-slate-700',
    accentBg: 'bg-slate-50',
    accentBorder: 'border-slate-200',
    description: 'Turbine parts and components',
  };
}

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = useMemo(() => {
    const order = Object.keys(GROUP_META);
    const present = [...new Set(siteCategories.map((c) => c.group))];
    return order.filter((g) => present.includes(g));
  }, []);

  const filtered = useMemo(() => {
    let result = siteCategories;
    if (activeGroup) result = result.filter((c) => c.group === activeGroup);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.group.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeGroup, search]);

  const totalParts = siteCategories.reduce((sum, c) => sum + c.partCount, 0);

  const groupedResults = useMemo(() => {
    if (activeGroup) return [{ group: activeGroup, cats: filtered }];
    return groups
      .map((g) => ({ group: g, cats: filtered.filter((c) => c.group === g) }))
      .filter((r) => r.cats.length > 0);
  }, [activeGroup, filtered, groups]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="cat-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cat-grid)" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16">
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
              className="mb-6 [&_a]:text-silver/50 [&_a:hover]:text-white [&_.text-text]:text-silver/80"
            />

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-orange" />
                  <span className="text-xs font-semibold text-silver/60 uppercase tracking-widest">
                    Parts Catalog
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
                  Turbine Spare Parts
                  <br />
                  <span className="text-silver/90">by Category</span>
                </h1>
                <p className="text-silver/60 text-sm sm:text-base max-w-xl leading-relaxed">
                  {siteCategories.length} categories &middot; {totalParts.toLocaleString()} certified parts.
                  Every component fully traceable with NSN, CAGE, and OEM cross-references.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-10">
                {[
                  { value: siteCategories.length, label: 'Categories' },
                  { value: `${(totalParts / 1000).toFixed(0)}K+`, label: 'Parts' },
                  { value: groups.length, label: 'Groups' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-silver/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-xl">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/40" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by category name, platform, or component type..."
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-silver/40 text-sm focus:outline-none focus:ring-1 focus:ring-orange/50 focus:border-orange/40 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <section className="border-b border-silver/60 bg-[#F8F9FB]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
              <button
                onClick={() => setActiveGroup(null)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-md text-xs font-semibold transition-colors',
                  !activeGroup
                    ? 'bg-navy text-white'
                    : 'text-text-muted hover:bg-silver/40 hover:text-navy'
                )}
              >
                All ({siteCategories.length})
              </button>
              {groups.map((g) => {
                const meta = getGroupMeta(g);
                const count = siteCategories.filter((c) => c.group === g).length;
                return (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g === activeGroup ? null : g)}
                    className={cn(
                      'flex-shrink-0 px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap',
                      activeGroup === g
                        ? `${meta.accentBg} ${meta.accent} border ${meta.accentBorder}`
                        : 'text-text-muted hover:bg-silver/40 hover:text-navy'
                    )}
                  >
                    {g} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Results ── */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-6">
            {search && (
              <div className="mb-8 text-sm text-text-muted">
                Showing <span className="font-semibold text-navy">{filtered.length}</span> categories
                {search && <> for &ldquo;<span className="text-orange font-medium">{search}</span>&rdquo;</>}
                <button
                  onClick={() => { setSearch(''); setActiveGroup(null); }}
                  className="ml-3 text-orange text-xs font-semibold hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-lg bg-silver/40 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-7 h-7 text-text-muted/60" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-1">No categories found</h3>
                <p className="text-text-muted text-sm mb-6">Try a different search term or clear filters.</p>
                <button
                  onClick={() => { setSearch(''); setActiveGroup(null); }}
                  className="px-5 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors"
                >
                  View All Categories
                </button>
              </div>
            ) : (
              <div className="space-y-14">
                {groupedResults.map(({ group, cats }) => {
                  const meta = getGroupMeta(group);
                  const Icon = meta.icon;
                  const groupParts = cats.reduce((s, c) => s + c.partCount, 0);

                  return (
                    <div key={group}>
                      {/* Group Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={cn('w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0', meta.accentBg, meta.accentBorder)}>
                          <Icon className={cn('w-5 h-5', meta.accent)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3">
                            <h2 className="text-lg font-bold text-navy">{group}</h2>
                            <span className="text-xs text-text-muted font-medium">
                              {cats.length} categories &middot; {groupParts.toLocaleString()} parts
                            </span>
                          </div>
                          <p className="text-xs text-text-muted/70 mt-0.5">{meta.description}</p>
                        </div>
                        <div className="hidden sm:block h-px flex-1 bg-silver/60" />
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {cats.map((cat) => (
                          <CategoryCard key={cat.id} cat={cat} groupMeta={meta} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-navy">
          <div className="max-w-7xl mx-auto px-6 py-14 sm:py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-silver/60 mb-5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              ISO 9001 &middot; AS9120 &middot; FAA &middot; EASA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Can&apos;t Find What You Need?
            </h2>
            <p className="text-silver/60 max-w-lg mx-auto mb-8 text-sm sm:text-base">
              We source parts across any category, platform, or manufacturer.
              Submit an RFQ and our team responds within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 px-7 py-3 bg-orange text-white text-sm font-bold rounded-lg hover:bg-orange-dark transition-colors shadow-lg shadow-orange/20"
              >
                Submit RFQ
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-7 py-3 border border-white/15 text-white text-sm font-bold rounded-lg hover:bg-white/5 transition-colors"
              >
                Browse Full Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Category Card ── */
function CategoryCard({
  cat,
  groupMeta,
}: {
  cat: (typeof siteCategories)[0];
  groupMeta: { accent: string; accentBg: string; accentBorder: string };
}) {
  return (
    <Link
      href={`/catalog?category=${cat.slug}`}
      className="group block border border-silver/70 rounded-lg bg-white hover:border-navy/30 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-navy/20 via-navy/10 to-transparent" />

      <div className="p-4">
        {/* Group badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
            groupMeta.accentBg, groupMeta.accent, groupMeta.accentBorder
          )}>
            {cat.group.split(' ')[0]}
          </span>
          <ChevronRight className="w-4 h-4 text-silver-dark group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-navy leading-snug mb-1.5 group-hover:text-orange transition-colors">
          {cat.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-text-muted/70 leading-relaxed line-clamp-2 mb-3">
          {cat.description}
        </p>

        {/* Features preview */}
        {cat.features && cat.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {cat.features.slice(0, 3).map((f) => (
              <span key={f} className="text-[10px] bg-silver/30 text-text-muted px-1.5 py-0.5 rounded">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-silver/50">
          <span className="text-xs font-bold text-navy">
            {cat.partCount.toLocaleString()} <span className="font-normal text-text-muted">parts</span>
          </span>
          <span className="text-[10px] font-semibold text-orange opacity-0 group-hover:opacity-100 transition-opacity">
            View Parts →
          </span>
        </div>
      </div>
    </Link>
  );
}
