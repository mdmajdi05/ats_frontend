'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, Package, Plus, Scale, ShoppingCart } from 'lucide-react';
import { request } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

interface Part {
  id: string;
  nsn: string;
  partNumber: string;
  manufacturer: string;
  condition: string;
  stockStatus: string;
  quantityAvailable: number;
  unitPrice: number;
  currency: string;
  description: string;
  cage: string;
  category: string;
  [key: string]: unknown;
}

const COMPARISON_FIELDS: { key: keyof Part; label: string }[] = [
  { key: 'nsn', label: 'NSN' },
  { key: 'partNumber', label: 'Part Number' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'condition', label: 'Condition' },
  { key: 'stockStatus', label: 'Stock Status' },
  { key: 'quantityAvailable', label: 'Quantity Available' },
  { key: 'unitPrice', label: 'Unit Price' },
  { key: 'currency', label: 'Currency' },
  { key: 'description', label: 'Description' },
  { key: 'cage', label: 'Cage Code' },
  { key: 'category', label: 'Category' },
];

function isDifferent(parts: Part[], key: keyof Part): boolean {
  if (parts.length < 2) return false;
  const first = String(parts[0]?.[key] ?? '');
  return parts.some((p) => String(p?.[key] ?? '') !== first);
}

function cellValue(part: Part | undefined, key: keyof Part): string {
  if (!part) return '—';
  const val = part[key];
  if (val === undefined || val === null) return '—';
  if (key === 'unitPrice' && typeof val === 'number') {
    return (part.currency || 'USD') + ' ' + val.toFixed(2);
  }
  if (key === 'quantityAvailable') return String(val);
  return String(val);
}

export default function PartsComparePage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || '';

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchParts = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setParts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await request<{ success: boolean; data: Part[] }>('/parts/compare', {
        method: 'POST',
        body: JSON.stringify({ partIds: ids }),
      });
      setParts(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load parts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (idsParam) {
      const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean);
      setSelectedIds(ids);
      fetchParts(ids);
    }
  }, [idsParam, fetchParts]);

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await request<{ success: boolean; data: Part[] }>(
        `/products?search=${encodeURIComponent(q)}&limit=20`
      );
      setSearchResults(res.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const togglePartSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleCompareSelected = () => {
    if (selectedIds.length >= 2) {
      window.location.href = `/parts/compare?ids=${selectedIds.join(',')}`;
    }
  };

  const handleAddToRFQ = (part: Part) => {
    const existing = localStorage.getItem('ats_rfq_items');
    const items = existing ? JSON.parse(existing) : [];
    items.push({
      productId: part.id,
      partNumber: part.partNumber,
      nsn: part.nsn,
      description: part.description || part.partNumber,
      quantity: 1,
      condition: part.condition,
    });
    localStorage.setItem('ats_rfq_items', JSON.stringify(items));
    window.location.href = '/rfq';
  };

  if (!idsParam) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <main className="flex-1 bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <Scale className="w-7 h-7 text-orange" />
              <h1 className="text-3xl font-bold">Compare Parts</h1>
            </div>

            <p className="text-gray-400 mb-6">Search and select 2-4 parts to compare side by side.</p>

            <div className="relative max-w-xl mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by NSN, part number, or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searching && (
              <div className="text-gray-400 py-4">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="bg-gray-700/50 rounded-xl border border-gray-600 overflow-hidden mb-6 max-w-xl">
                {searchResults.map((part) => {
                  const isSelected = selectedIds.includes(part.id);
                  const isMaxed = selectedIds.length >= 4 && !isSelected;
                  return (
                    <button
                      key={part.id}
                      onClick={() => togglePartSelection(part.id)}
                      disabled={isMaxed}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left border-b border-gray-600/50 last:border-0 transition-colors ${
                        isSelected
                          ? 'bg-orange/10 border-l-2 border-l-orange'
                          : isMaxed
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-gray-600/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-orange border-orange' : 'border-gray-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{part.partNumber}</div>
                        <div className="text-xs text-gray-400 truncate">{part.nsn} · {part.manufacturer}</div>
                      </div>
                      <span className="text-xs text-gray-500">{part.condition} · {part.stockStatus}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {searchQuery && !searching && searchResults.length === 0 && (
              <div className="text-gray-500 py-4 max-w-xl">No parts found. Try a different search term.</div>
            )}

            {selectedIds.length > 0 && (
              <div className="bg-gray-700/50 rounded-xl border border-gray-600 p-4 max-w-xl mb-6">
                <h3 className="text-sm font-semibold mb-3">
                  Selected ({selectedIds.length}/4)
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedIds.map((id) => {
                    const part = searchResults.find((p) => p.id === id) || parts.find((p) => p.id === id);
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 bg-orange/20 text-orange text-xs px-2.5 py-1 rounded-full">
                        {part?.partNumber || id}
                        <button onClick={() => togglePartSelection(id)} className="hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <Button
                  variant="orange"
                  size="lg"
                  onClick={handleCompareSelected}
                  disabled={selectedIds.length < 2}
                >
                  <Scale className="w-4 h-4" />
                  Compare ({selectedIds.length}) parts
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <main className="flex-1 bg-gray-800 text-white flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading parts...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <main className="flex-1 bg-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/catalog">
              <Button variant="orange">Back to Catalog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-1 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Scale className="w-7 h-7 text-orange" />
            <h1 className="text-3xl font-bold">Parts Comparison</h1>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-750">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-400 w-48">
                    Field
                  </th>
                  {parts.map((part) => (
                    <th key={part.id} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-400 min-w-[180px]">
                      {part.partNumber || part.nsn}
                    </th>
                  ))}
                  {parts.length === 0 && (
                    <th className="px-5 py-4 text-left text-xs text-gray-500">No parts loaded</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {COMPARISON_FIELDS.map((field) => {
                  const diff = isDifferent(parts, field.key);
                  return (
                    <tr key={field.key} className={diff ? 'bg-orange/5' : 'hover:bg-gray-750/50'}>
                      <td className={`px-5 py-3.5 text-sm font-semibold ${diff ? 'text-orange' : 'text-gray-400'}`}>
                        {field.label}
                        {diff && <span className="ml-2 text-[10px] text-orange/60">(varies)</span>}
                      </td>
                      {parts.map((part) => {
                        const val = cellValue(part, field.key);
                        const allSame = !diff;
                        return (
                          <td
                            key={part.id}
                            className={`px-5 py-3.5 text-sm ${
                              diff ? 'text-white font-medium' : allSame ? 'text-gray-300' : 'text-gray-300'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {parts.map((part) => (
              <button
                key={part.id}
                onClick={() => handleAddToRFQ(part)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange/10 text-orange hover:bg-orange/20 rounded-lg text-sm font-semibold transition-colors border border-orange/20"
              >
                <ShoppingCart className="w-4 h-4" />
                Add {part.partNumber || part.nsn} to RFQ
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
