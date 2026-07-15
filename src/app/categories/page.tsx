'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plane, Settings, Flame, Fuel, Activity, Cpu, Radio,
  Thermometer, Shield, Zap, Package, Hash, BadgeCheck, Search,
  Anchor, ChevronRight, Search as SearchIcon, Grid3X3, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import siteCategories from '@/data/site-categories.json';

const ICON_MAP: Record<string, React.ElementType> = {
  plane: Plane, settings: Settings, flame: Flame, fuel: Fuel,
  activity: Activity, cpu: Cpu, radio: Radio, thermometer: Thermometer,
  shield: Shield, zap: Zap, package: Package, hash: Hash,
  badgecheck: BadgeCheck, search: Search, anchor: Anchor,
};

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; dot: string; light: string }> = {
  'Aero-Derivative Gas Turbines': {
    bg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', light: 'bg-blue-50',
  },
  'Heavy-Duty Gas Turbines': {
    bg: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', light: 'bg-purple-50',
  },
  'Turbine Hot Gas Path': {
    bg: 'bg-orange-600', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', light: 'bg-orange-50',
  },
  'Control & Monitoring': {
    bg: 'bg-cyan-600', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500', light: 'bg-cyan-50',
  },
  'Rotating & Support Components': {
    bg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', light: 'bg-emerald-50',
  },
  'Power Generation & Auxiliary': {
    bg: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', light: 'bg-amber-50',
  },
  'Procurement Services': {
    bg: 'bg-rose-600', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500', light: 'bg-rose-50',
  },
};

function getGroupColor(group: string) {
  return GROUP_COLORS[group] || {
    bg: 'bg-slate-600', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500', light: 'bg-slate-50',
  };
}

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = [...new Set(siteCategories.map((c) => c.group))];

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-navy via-[#0B1A33] to-[#0D2247] py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="cat-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cat-grid)" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-6">
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
              className="mb-6 [&_a]:text-silver/60 [&_a:hover]:text-orange [&_.text-text]:text-silver/90"
            />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-silver/80 mb-4">
                <Grid3X3 className="w-3.5 h-3.5 text-orange" />
                {siteCategories.length} Categories · {totalParts.toLocaleString()} Parts
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Browse by{' '}
                <span className="bg-gradient-to-r from-orange to-amber-400 bg-clip-text text-transparent">
                  Category
                </span>
              </h1>
              <p className="text-silver/70 text-base sm:text-lg max-w-2xl leading-relaxed">
                Explore our complete inventory organized by turbine platform, component type,
                and procurement method. Every category is backed by fully traceable, certified parts.
              </p>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-xl">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver/50" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-silver/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange/50 backdrop-blur-sm transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category browser */}
        <section className="py-16 bg-[#F8F9FF]">
          <div className="max-w-7xl mx-auto px-6">
            {/* Group filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveGroup(null)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  !activeGroup
                    ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20'
                    : 'bg-white text-[#4A4A6A] border-silver hover:border-navy/30 hover:text-navy hover:shadow-sm'
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
                      'px-5 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2',
                      activeGroup === g
                        ? `${colors.light} ${colors.text} ${colors.border} shadow-sm`
                        : 'bg-white text-[#4A4A6A] border-silver hover:border-navy/30 hover:text-navy'
                    )}
                  >
                    <span className={cn('w-2 h-2 rounded-full', colors.dot)} />
                    {g}
                  </button>
                );
              })}
            </div>

            {/* Results count */}
            <div className="mb-6 text-sm text-[#4A4A6A]">
              Showing <span className="font-semibold text-navy">{filtered.length}</span> categories
              {search && <span> for &ldquo;<span className="text-orange">{search}</span>&rdquo;</span>}
            </div>

            {/* Categories grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-silver/50 flex items-center justify-center mx-auto mb-5">
                  <SearchIcon className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">No categories found</h3>
                <p className="text-text-muted text-sm mb-6">Try a different search term or browse all categories.</p>
                <button
                  onClick={() => { setSearch(''); setActiveGroup(null); }}
                  className="px-6 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy-dark transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Grouped display when showing all */}
                {activeGroup
                  ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
                    </div>
                  )
                  : (
                    groups.map((group) => {
                      const groupCats = filtered.filter((c) => c.group === group);
                      if (!groupCats.length) return null;
                      const colors = getGroupColor(group);
                      return (
                        <div key={group}>
                          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-silver">
                            <span className={cn('w-3 h-3 rounded-full', colors.dot)} />
                            <h2 className="text-lg font-bold text-navy">{group}</h2>
                            <span className="text-xs text-text-muted bg-white px-2.5 py-0.5 rounded-full border border-silver">
                              {groupCats.length} categories
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {groupCats.map((cat) => <CategoryCard key={cat.id} cat={cat} compact />)}
                          </div>
                        </div>
                      );
                    })
                  )}
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-navy via-[#0B1A33] to-navy py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-silver/70 max-w-xl mx-auto mb-8">
              Our team can source parts across any category, platform, or manufacturer.
              Submit an RFQ and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-dark transition-all shadow-lg hover:shadow-xl"
              >
                Submit a Quote Request
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
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

function CategoryCard({ cat, compact }: { cat: typeof siteCategories[0]; compact?: boolean }) {
  const Icon = ICON_MAP[cat.icon] || Package;
  const colors = getGroupColor(cat.group);

  return (
    <Link
      href={`/catalog?category=${cat.slug}`}
      className={cn(
        'group relative bg-white rounded-2xl border border-silver/80 hover:border-brand/30 transition-all duration-300 overflow-hidden',
        compact ? 'p-4' : 'p-6 hover:shadow-[0_8px_30px_-12px_rgba(79,70,229,0.12)] hover:-translate-y-0.5'
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={cn('flex', compact ? 'items-center gap-3' : 'items-start gap-4')}>
        <div className={cn(
          'rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
          colors.light,
          compact ? 'w-10 h-10' : 'w-12 h-12'
        )}>
          <Icon className={cn(compact ? 'w-5 h-5' : 'w-6 h-6', colors.text)} />
        </div>
        <div className="flex-1 min-w-0">
          {!compact && (
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded inline-block mb-1.5', colors.light, colors.text)}>
              {cat.group}
            </span>
          )}
          <h3 className={cn(
            'font-bold text-navy group-hover:text-brand transition-colors leading-snug',
            compact ? 'text-sm' : 'text-sm'
          )}>
            {cat.name}
          </h3>
          {!compact && (
            <p className="text-xs text-text-muted/70 leading-relaxed line-clamp-2 mt-1">
              {cat.description}
            </p>
          )}
          <div className={cn('flex items-center justify-between', compact ? 'mt-0' : 'mt-3 pt-3 border-t border-silver/60')}>
            <span className="text-[11px] font-semibold text-emerald-600">
              {cat.partCount.toLocaleString()} parts
            </span>
            <span className="text-brand/40 group-hover:text-brand transition-colors">
              <ChevronRight className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
