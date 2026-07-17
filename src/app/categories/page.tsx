'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Search as SearchIcon, ArrowRight, Package,
  Settings, Gauge, Cpu, Wrench, Zap, Truck, ShieldCheck,
  BarChart3, Box, CircleDot, X, Layers, ArrowUpRight,
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
  dot: string;
  description: string;
  banner: string;
}> = {
  'Aero-Derivative Gas Turbines': {
    icon: Gauge, accent: 'text-blue-600', accentBg: 'bg-blue-50', accentBorder: 'border-blue-200', dot: 'bg-blue-500',
    description: 'LM2500, LM6000, LM9000, LMS100 and other aero-derivative platform components',
    banner: '/images/categories/banner-aero-derivative-gas-turbines.jpg',
  },
  'Heavy-Duty Gas Turbines': {
    icon: Settings, accent: 'text-purple-600', accentBg: 'bg-purple-50', accentBorder: 'border-purple-200', dot: 'bg-purple-500',
    description: 'GE Frame, Siemens, and heavy-duty industrial turbine hardware',
    banner: '/images/categories/banner-heavy-duty-gas-turbines.jpg',
  },
  'Turbine Hot Gas Path': {
    icon: Zap, accent: 'text-orange-600', accentBg: 'bg-orange-50', accentBorder: 'border-orange-200', dot: 'bg-orange-500',
    description: 'Blades, nozzles, combustion liners, and hot-section components',
    banner: '/images/categories/banner-turbine-hot-gas-path.jpg',
  },
  'Control & Monitoring': {
    icon: Cpu, accent: 'text-cyan-600', accentBg: 'bg-cyan-50', accentBorder: 'border-cyan-200', dot: 'bg-cyan-500',
    description: 'Mark VIe, PLC systems, sensors, actuators, and control hardware',
    banner: '/images/categories/banner-control-monitoring.jpg',
  },
  'Rotating & Support Components': {
    icon: CircleDot, accent: 'text-emerald-600', accentBg: 'bg-emerald-50', accentBorder: 'border-emerald-200', dot: 'bg-emerald-500',
    description: 'Bearings, seals, shafts, couplings, and rotating element assemblies',
    banner: '/images/categories/banner-rotating-support-components.jpg',
  },
  'Power Generation & Auxiliary': {
    icon: BarChart3, accent: 'text-amber-600', accentBg: 'bg-amber-50', accentBorder: 'border-amber-200', dot: 'bg-amber-500',
    description: 'Generators, transformers, lube oil systems, and balance-of-plant',
    banner: '/images/categories/banner-power-generation-auxiliary.jpg',
  },
  'Procurement Services': {
    icon: Truck, accent: 'text-rose-600', accentBg: 'bg-rose-50', accentBorder: 'border-rose-200', dot: 'bg-rose-500',
    description: 'Sourcing, kitting, AOG support, and global logistics solutions',
    banner: '/images/categories/banner-procurement-services.jpg',
  },
  'Aviation Test Equipment': {
    icon: Wrench, accent: 'text-indigo-600', accentBg: 'bg-indigo-50', accentBorder: 'border-indigo-200', dot: 'bg-indigo-500',
    description: 'Test stands, calibration tools, and aviation maintenance equipment',
    banner: '/images/categories/banner-aviation-test-equipment.jpg',
  },
};

function getGroupMeta(group: string) {
  return GROUP_META[group] || {
    icon: Box, accent: 'text-slate-600', accentBg: 'bg-slate-50', accentBorder: 'border-slate-200', dot: 'bg-slate-500',
    description: 'Turbine parts and components',
    banner: '',
  };
}

function groupSlug(name: string) {
  return name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
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
    <div className="flex flex-col min-h-screen bg-[#F8F9FC]">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative bg-[#0A1628] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="cat-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cat-grid)" />
            </svg>
          </div>
          <div className="absolute top-1/4 right-[10%] w-[28rem] h-[28rem] bg-[#4F46E5]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/3 left-[5%] w-[20rem] h-[20rem] bg-[#1D4ED8]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
              className="mb-8 [&_a]:text-white/40 [&_a:hover]:text-white/80 [&_.text-text]:text-white/60"
            />

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/50 mb-5">
                  <Package className="w-3.5 h-3.5 text-orange" />
                  Full Parts Catalog
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white mb-4 leading-[1.1] tracking-tight">
                  Turbine Spare Parts
                  <br />
                  <span className="bg-gradient-to-r from-orange to-amber-400 bg-clip-text text-transparent">
                    by Category
                  </span>
                </h1>
                <p className="text-white/50 text-sm sm:text-base max-w-xl leading-relaxed">
                  {siteCategories.length} categories &middot; {totalParts.toLocaleString()} certified parts.
                  Every component traceable with NSN, CAGE, and OEM cross-references.
                </p>
              </div>

              <div className="flex gap-3 sm:gap-4 flex-shrink-0">
                {[
                  { value: siteCategories.length, label: 'Categories', icon: Package },
                  { value: `${(totalParts / 1000).toFixed(0)}K+`, label: 'Parts', icon: BarChart3 },
                  { value: groups.length, label: 'Groups', icon: Layers },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white/40" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white leading-none">{value}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-2xl">
              <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-orange transition-colors" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by category, platform, or component type..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange/40 focus:bg-white/[0.1] transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter Tabs ── */}
        <section className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setActiveGroup(null)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border',
                  !activeGroup
                    ? 'bg-[#0A1628] text-white border-[#0A1628] shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
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
                      'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all border whitespace-nowrap',
                      activeGroup === g
                        ? `${meta.accentBg} ${meta.accent} ${meta.accentBorder} shadow-sm`
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                    )}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', meta.dot)} />
                    {g} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Active Group Banner ── */}
        {activeGroup && (
          <section className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={getGroupMeta(activeGroup).banner || `/images/categories/banner-${groupSlug(activeGroup)}.jpg`}
              alt={activeGroup}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/90 via-[#0A1628]/60 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center gap-4">
                  {(() => {
                    const meta = getGroupMeta(activeGroup);
                    const Icon = meta.icon;
                    return (
                      <>
                        <div className={cn('w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0', meta.accentBg, meta.accentBorder)}>
                          <Icon className={cn('w-6 h-6', meta.accent)} />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black text-white">{activeGroup}</h2>
                          <p className="text-white/60 text-sm mt-1">
                            {filtered.length} categories &middot; {filtered.reduce((s, c) => s + c.partCount, 0).toLocaleString()} parts
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Results ── */}
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(search || activeGroup) && (
              <div className="mb-6 flex items-center gap-3 text-sm text-slate-500">
                <span>
                  Showing <span className="font-semibold text-[#0A1628]">{filtered.length}</span> categories
                  {search && <> for &ldquo;<span className="text-orange font-medium">{search}</span>&rdquo;</>}
                </span>
                <button
                  onClick={() => { setSearch(''); setActiveGroup(null); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-orange hover:bg-orange/5 rounded-lg transition-colors"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1628] mb-1">No categories found</h3>
                <p className="text-slate-500 text-sm mb-6">Try a different search term or clear filters.</p>
                <button
                  onClick={() => { setSearch(''); setActiveGroup(null); }}
                  className="px-6 py-2.5 bg-[#0A1628] text-white rounded-xl text-sm font-semibold hover:bg-[#0A1628]/90 transition-colors"
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
                      {/* Group header */}
                      {!activeGroup && (
                        <div className="flex items-center gap-4 mb-6">
                          <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0', meta.accentBg, meta.accentBorder)}>
                            <Icon className={cn('w-5 h-5', meta.accent)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-3">
                              <h2 className="text-lg font-bold text-[#0A1628]">{group}</h2>
                              <span className="text-xs text-slate-400 font-medium">
                                {cats.length} categories &middot; {groupParts.toLocaleString()} parts
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{meta.description}</p>
                          </div>
                          <div className="hidden sm:block h-px flex-1 bg-slate-200/80" />
                        </div>
                      )}

                      {/* Categories grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
        <section className="relative bg-[#0A1628] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="cta-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-[20rem] bg-[#4F46E5]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-white/50 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ISO 9001 &middot; AS9120 &middot; FAA &middot; EASA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Can&apos;t Find What You Need?
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8 text-sm sm:text-base">
              We source parts across any category, platform, or manufacturer.
              Submit an RFQ and our team responds within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-dark transition-colors shadow-lg shadow-orange/25"
              >
                Submit RFQ
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white text-sm font-bold rounded-xl hover:bg-white/5 transition-colors"
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

/* ── Category Card ── Premium image card with hover effects ── */
function CategoryCard({
  cat,
  groupMeta,
}: {
  cat: (typeof siteCategories)[0];
  groupMeta: { accent: string; accentBg: string; accentBorder: string; dot: string; banner: string };
}) {
  return (
    <Link
      href={`/catalog?category=${cat.slug}`}
      className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_8px_30px_-12px_rgba(79,70,229,0.18)] hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Image header */}
      <div className="relative h-36 overflow-hidden bg-slate-100">
        <img
          src={cat.image || `/images/categories/banner-${groupSlug(cat.group)}.jpg`}
          alt={cat.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

        {/* Group badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm',
            groupMeta.accentBg, groupMeta.accent, 'border', groupMeta.accentBorder
          )}>
            {cat.group.split(' ')[0]}
          </span>
        </div>

        {/* Arrow icon */}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <ArrowUpRight className="w-3.5 h-3.5 text-[#0A1628]" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-[#0A1628] leading-snug mb-1.5 group-hover:text-blue-600 transition-colors">
          {cat.name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {cat.description}
        </p>

        {/* Features */}
        {cat.features && cat.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {cat.features.slice(0, 2).map((f) => (
              <span key={f} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-emerald-600">
            {cat.partCount.toLocaleString()} parts
          </span>
          <span className="text-[10px] font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            View Parts <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
