'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { List, LayoutGrid, Search, X, ArrowLeft, Package, ChevronDown, SlidersHorizontal, ArrowUpDown, Scale } from 'lucide-react';
import { request } from '@/lib/api-client';
import type { NavCategoryTree, NavCategory, CategoryItem } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListView from '@/components/catalog/ListView';
import CardView from '@/components/catalog/CardView';
import { cn } from '@/lib/utils';

interface PartCategory extends NavCategory {}

export default function PartCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<PartCategory | null>(null);
  const [navTree, setNavTree] = useState<NavCategoryTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [filterField, setFilterField] = useState('');
  const [cardTitleField, setCardTitleField] = useState('');
  const [cardDescField, setCardDescField] = useState('');
  const [cardImageField, setCardImageField] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sidebarFilters, setSidebarFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

     request<{ success: boolean; data: NavCategoryTree }>('/nav-categories')
       .then((res) => {
         if (cancelled) return;
         setNavTree(res.data);
         const found = res.data.partCategories?.find((c) => c.slug === slug) as PartCategory | undefined;
         if (found) {
           setCategory(found);
           setViewMode((found.cardConfig?.defaultView as 'list' | 'card') || (found.cardConfig?.template as 'list' | 'card') || 'list');
         } else {
           setError('Part category not found');
         }
       })
       .catch((err: unknown) => {
         if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load category');
       })
       .finally(() => {
         if (!cancelled) setLoading(false);
       });

    return () => { cancelled = true; };
  }, [slug]);

  const items = category?.items ?? [];

  const allDataKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const item of items) {
      if (item.data) Object.keys(item.data).forEach(k => keys.add(k));
    }
    return Array.from(keys).filter(k => k !== '_columnOrder');
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (filterField) {
        result = result.filter((item) => {
          const val = String(item.data?.[filterField] ?? '');
          return val.toLowerCase().includes(q);
        });
      } else {
        result = result.filter((item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description ?? '').toLowerCase().includes(q)
        );
      }
    }
    // Apply sidebar filters
    const activeFilterKeys = Object.keys(sidebarFilters).filter((k) => sidebarFilters[k].length > 0);
    if (activeFilterKeys.length > 0) {
      result = result.filter((item) =>
        activeFilterKeys.every((key) =>
          sidebarFilters[key].includes(String(item.data?.[key] ?? ''))
        )
      );
    }
    return result;
  }, [items, searchQuery, filterField, sidebarFilters]);

  const sortedItems = useMemo(() => {
    if (sortBy === 'default') return filteredItems;
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      const aVal = String(a.data?.[sortBy] ?? '');
      const bVal = String(b.data?.[sortBy] ?? '');
      return aVal.localeCompare(bVal);
    });
  }, [filteredItems, sortBy]);

  // Build sidebar filter options from data
  const sidebarFilterOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};
    for (const item of items) {
      if (item.data) {
        for (const [key, val] of Object.entries(item.data)) {
          if (key === '_columnOrder' || !val) continue;
          if (!options[key]) options[key] = new Set();
          options[key].add(String(val));
        }
      }
    }
    return Object.fromEntries(
      Object.entries(options).map(([k, v]) => [k, Array.from(v).slice(0, 20)])
    );
  }, [items]);

  const toggleSidebarFilter = (key: string, value: string) => {
    setSidebarFilters((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        const next = current.filter((v) => v !== value);
        if (next.length === 0) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: next };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  // Related categories from pageConfig
  const pageCfg = (category?.pageConfig ?? {}) as Record<string, unknown>;
  const relatedSlugs = (pageCfg.relatedSlugs as string[]) || [];
  const allCats = [...(navTree?.productCategories ?? []), ...(navTree?.partCategories ?? [])];
  const relatedCats = allCats.filter((c) => relatedSlugs.includes(c.slug));

  const effectiveView = viewMode ?? 'list';

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-bg">
          <div className="bg-gradient-to-br from-navy via-[#1A1A3E] to-[#0F0F2E] py-16 px-4">
            <div className="max-w-7xl mx-auto animate-pulse space-y-5">
              <div className="h-3 w-40 bg-white/10 rounded" />
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-72 bg-white/10 rounded-lg" />
                  <div className="h-4 w-96 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-4 animate-pulse">
            <div className="h-12 w-full bg-silver/60 rounded-2xl" />
            <div className="h-64 w-full bg-silver/30 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4 bg-gradient-to-b from-bg to-silver/20">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mx-auto mb-6 ring-1 ring-red-200">
              <Package className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-text mb-2">Category Not Found</h1>
            <p className="text-text-muted text-sm leading-relaxed mb-8">{error ?? 'The category you\'re looking for doesn\'t exist or may have been removed.'}</p>
            <Link href="/catalog">
              <Button variant="orange" size="lg">
                <ArrowLeft className="w-4 h-4" />
                Browse Catalog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-navy via-[#1A1A3E] to-[#0F0F2E] text-white py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          {(pageCfg.heroImage as string) && (
            <div className="absolute inset-0">
              <img src={pageCfg.heroImage as string} alt="Category hero background" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-[#1A1A3E]/80 to-[#0F0F2E]/80" />
            </div>
          )}
          <div className="relative max-w-7xl mx-auto">
            <Breadcrumb
              className="mb-5 [&_a]:text-white/60 [&_a:hover]:text-orange [&_span]:text-white/40"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Parts', href: '/catalog' },
                { label: category.name },
              ]}
            />
            <div className="flex items-start gap-6">
              {category.icon && (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange/30 to-orange/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange/10 ring-1 ring-white/10">
                  <Package className="w-8 h-8 text-orange" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{category.name}</h1>
                  {category.partCount !== undefined && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange/20 text-orange ring-1 ring-orange/30">
                      {category.partCount.toLocaleString()} items
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-white/70 text-base sm:text-lg mt-2 max-w-3xl leading-relaxed">{category.description}</p>
                )}
                {category.manufacturer && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-white/40">Manufacturer:</span>
                    <span className="font-semibold text-orange bg-orange/10 px-2.5 py-0.5 rounded-md">{category.manufacturer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Sidebar filters — desktop */}
            {Object.keys(sidebarFilterOptions).length > 0 && (
              <aside className="hidden lg:block w-60 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-silver/60 shadow-sm sticky top-24">
                  {/* Header */}
                  <div className="px-4 pt-4 pb-3 border-b border-silver/40">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted/70">Filters</h3>
                      {Object.keys(sidebarFilters).length > 0 && (
                        <span className="text-[10px] font-semibold text-orange bg-orange/10 px-2 py-0.5 rounded-full">
                          {Object.values(sidebarFilters).reduce((sum, arr) => sum + arr.length, 0)} active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-1 max-h-[65vh] overflow-y-auto">
                    {Object.entries(sidebarFilterOptions).slice(0, 5).map(([key, values]) => {
                      const activeCount = sidebarFilters[key]?.length || 0;
                      return (
                        <div key={key} className="border-b border-silver/20 pb-3 mb-2 last:border-0 last:pb-0 last:mb-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (activeCount > 0) {
                                setSidebarFilters((prev) => {
                                  const { [key]: _, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className="flex items-center justify-between w-full text-left mb-1.5 group"
                          >
                            <span className="text-[11px] font-semibold text-text capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-[10px] text-text-muted/50 group-hover:text-text-muted transition-colors">
                              {values.length}
                            </span>
                          </button>
                          <div className="space-y-0.5 max-h-36 overflow-y-auto scrollbar-thin">
                            {values.map((val) => {
                              const active = sidebarFilters[key]?.includes(val);
                              return (
                                <label key={val} className={cn(
                                  'flex items-center gap-2 px-1.5 py-1 rounded-md cursor-pointer transition-colors',
                                  active ? 'bg-orange/5' : 'hover:bg-silver/30'
                                )}>
                                  <div className={cn(
                                    'w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                                    active
                                      ? 'bg-orange border-orange'
                                      : 'border-silver-dark/40 group-hover:border-orange/50'
                                  )}>
                                    {active && (
                                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={!!active}
                                    onChange={() => toggleSidebarFilter(key, val)}
                                    className="sr-only"
                                  />
                                  <span className={cn(
                                    'text-[11px] leading-tight flex-1 min-w-0 truncate',
                                    active ? 'text-orange font-medium' : 'text-text-muted'
                                  )}>
                                    {val}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {Object.keys(sidebarFilters).length > 0 && (
                    <div className="px-4 pb-4 pt-2 border-t border-silver/40">
                      <button
                        onClick={() => setSidebarFilters({})}
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-semibold text-orange bg-orange/5 hover:bg-orange/10 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl border border-silver/60 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 text-sm border border-silver rounded-lg bg-bg/50 text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/50 transition-all"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {allDataKeys.length > 0 && (
                      <select value={filterField} onChange={(e) => setFilterField(e.target.value)}
                        className="border border-silver rounded-lg px-2.5 py-2.5 text-xs bg-bg/50 text-text-muted focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/50 transition-all">
                        <option value="">All fields</option>
                        {allDataKeys.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    )}
                    {Object.keys(sidebarFilterOptions).length > 0 && (
                      <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden p-2.5 border border-silver rounded-lg text-text-muted hover:text-text hover:bg-bg/50 transition-all"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort dropdown */}
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="border border-silver rounded-lg px-2.5 py-2.5 text-xs bg-bg/50 text-text-muted focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/50 transition-all">
                    <option value="default">Default order</option>
                    <option value="title-asc">Name A-Z</option>
                    <option value="title-desc">Name Z-A</option>
                    {allDataKeys.slice(0, 5).map((k) => (
                      <option key={k} value={k}>By {k}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 bg-bg rounded-xl p-1 border border-silver self-start">
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', effectiveView === 'list' ? 'bg-white text-navy shadow-sm ring-1 ring-silver' : 'text-text-muted hover:text-text')}
                      aria-label="List view"
                    >
                      <List className="w-3.5 h-3.5" /> List
                    </button>
                    <button
                      onClick={() => setViewMode('card')}
                      className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', effectiveView === 'card' ? 'bg-white text-navy shadow-sm ring-1 ring-silver' : 'text-text-muted hover:text-text')}
                      aria-label="Card view"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" /> Card
                    </button>
                  </div>
                  {sortedItems.length > 0 && (
                    <Link
                      href={`/parts/compare?ids=${sortedItems.map((i) => i.id).join(',')}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange bg-orange/10 hover:bg-orange/20 border border-orange/20 transition-all self-start"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      Compare All
                    </Link>
                  )}
                  {effectiveView === 'list' && (
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                      className="border border-silver rounded-lg px-2.5 py-2.5 text-xs bg-white text-text-muted focus:outline-none focus:ring-1 focus:ring-orange/40 self-start">
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                      <option value={100}>100 / page</option>
                      <option value={150}>150 / page</option>
                      <option value={200}>200 / page</option>
                      <option value={500}>500 / page</option>
                      <option value={1000}>1000 / page</option>
                    </select>
                  )}
                </div>

                {/* Card field mapping */}
                {effectiveView === 'card' && allDataKeys.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 bg-bg/80 rounded-xl px-3 py-2 border border-silver mt-3 self-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted/60 mr-1">Map fields</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-text-muted">Title:</span>
                      <select value={cardTitleField} onChange={(e) => setCardTitleField(e.target.value)}
                        className="border border-silver rounded-md px-2 py-1 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-orange/40">
                        <option value="">Default</option>
                        {allDataKeys.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-text-muted">Desc:</span>
                      <select value={cardDescField} onChange={(e) => setCardDescField(e.target.value)}
                        className="border border-silver rounded-md px-2 py-1 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-orange/40">
                        <option value="">Default</option>
                        {allDataKeys.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-text-muted">Image:</span>
                      <select value={cardImageField} onChange={(e) => setCardImageField(e.target.value)}
                        className="border border-silver rounded-md px-2 py-1 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-orange/40">
                        <option value="">Default</option>
                        {allDataKeys.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {sortedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-silver/50 to-silver/20 flex items-center justify-center mb-5 ring-1 ring-silver/50">
                    <Package className="w-8 h-8 text-text-muted/60" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2">No items found</h3>
                  <p className="text-text-muted text-sm max-w-sm leading-relaxed">
                    {searchQuery || Object.keys(sidebarFilters).length > 0 ? 'No items match your search. Try different keywords or clear filters.' : 'This category is empty. Items will appear here once added.'}
                  </p>
                  {(searchQuery || Object.keys(sidebarFilters).length > 0) && (
                    <button
                      onClick={() => { setSearchQuery(''); setSidebarFilters({}); }}
                      className="mt-4 text-xs font-semibold text-orange hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {effectiveView === 'list' && (
                    <ListView
                      items={sortedItems.map((item) => ({
                        id: item.id,
                        data: item.data ?? {},
                        cardConfig: item.cardConfig,
                      }))}
                      cardConfig={category.cardConfig as Record<string, unknown> | undefined}
                      pageSize={pageSize}
                    />
                  )}
                  {effectiveView === 'card' && (
                    <CardView
                      items={sortedItems.map((item) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        image: item.image,
                        data: item.data ?? {},
                        cardConfig: item.cardConfig,
                      }))}
                      cardConfig={{
                        ...(category.cardConfig as Record<string, unknown> || {}),
                        cardView: {
                          ...((category.cardConfig as any)?.cardView || {}),
                          ...(cardTitleField ? { titleField: cardTitleField } : {}),
                          ...(cardDescField ? { descField: cardDescField } : {}),
                          ...(cardImageField ? { imageField: cardImageField } : {}),
                        },
                      }}
                    />
                  )}
                </>
              )}

              {/* Content section */}
              {(pageCfg.content as string) && (
                <div className="mt-10 bg-white rounded-2xl border border-silver/60 shadow-sm p-6 sm:p-8">
                  <div className="prose prose-sm max-w-none text-text leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pageCfg.content as string }} />
                </div>
              )}

              {/* Related categories */}
              {relatedCats.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-navy mb-4">Related Categories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedCats.map((rc) => {
                      const rcItems = (rc.items ?? []).slice(0, 4);
                      return (
                        <Link key={rc.id} href={`/parts/${rc.slug}`}
                          className="bg-white border border-silver/70 rounded-xl p-4 hover:shadow-md hover:border-orange/30 transition-all group">
                          <h4 className="font-semibold text-navy group-hover:text-orange transition-colors mb-2">{rc.name}</h4>
                          {rc.description && <p className="text-xs text-text-muted line-clamp-2 mb-3">{rc.description}</p>}
                          {rcItems.length > 0 && (
                            <div className="text-[10px] text-text-muted/60 border-t border-silver/30 pt-2 mt-auto">
                              {rcItems.length} item{rcItems.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile filter sheet */}
      {showMobileFilters && Object.keys(sidebarFilterOptions).length > 0 && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-silver/40 rounded-t-2xl">
              <div>
                <h3 className="text-sm font-bold text-navy">Filters</h3>
                {Object.keys(sidebarFilters).length > 0 && (
                  <p className="text-[10px] text-text-muted/60 mt-0.5">
                    {Object.values(sidebarFilters).reduce((sum, arr) => sum + arr.length, 0)} selected
                  </p>
                )}
              </div>
              <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-lg hover:bg-silver/30 text-text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {Object.entries(sidebarFilterOptions).slice(0, 5).map(([key, values]) => {
                const activeCount = sidebarFilters[key]?.length || 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-semibold text-text capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <span className="text-[10px] text-text-muted/50">{values.length} items</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.map((val) => {
                        const active = sidebarFilters[key]?.includes(val);
                        return (
                          <button
                            key={val}
                            onClick={() => toggleSidebarFilter(key, val)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                              active
                                ? 'bg-orange text-white border-orange shadow-sm'
                                : 'bg-white text-text-muted border-silver hover:border-orange/40 hover:text-text'
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-silver/40 px-5 py-4 flex gap-3">
              <button
                onClick={() => { setSidebarFilters({}); }}
                className="flex-1 py-2.5 rounded-xl border border-silver text-sm text-text-muted font-semibold hover:bg-silver/20 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-dark transition-colors"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
