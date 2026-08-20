'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, Package, Link2, RefreshCw, Copy, Check } from 'lucide-react';
import { request } from '@/lib/api-client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

interface Product {
  id: string;
  nsn: string;
  cage: string;
  partNumber: string;
  description: string;
  shortDescription: string;
  manufacturer: string;
  condition: string;
  stockStatus: string;
  quantityAvailable: number;
  unitPrice: number;
  currency: string;
  category: string;
  crossReferences: string[];
  tags: string[];
}

function normalizeQuery(q: string): string {
  return q.trim().toUpperCase().replace(/[\s-]+/g, '');
}

function directMatch(product: Product, q: string): boolean {
  const nq = normalizeQuery(q);
  if (!nq) return false;
  return (
    normalizeQuery(product.partNumber) === nq ||
    normalizeQuery(product.nsn) === nq ||
    normalizeQuery(product.cage) === nq ||
    product.partNumber.toUpperCase().includes(nq) ||
    product.nsn.toUpperCase().includes(nq) ||
    product.cage.toUpperCase().includes(nq)
  );
}

function reverseMatch(product: Product, q: string): boolean {
  const nq = normalizeQuery(q);
  if (!nq) return false;
  return product.crossReferences.some((ref) => normalizeQuery(ref) === nq);
}

export default function CrossReferencePage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await request<{ success: boolean; data: Product[] }>('/products?limit=2500');
        if (!cancelled) setProducts(res.data || []);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load product data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const nq = query.trim();
    if (!nq || products.length === 0) {
      return { direct: [], reverse: [] };
    }
    return {
      direct: products.filter((p) => directMatch(p, nq)),
      reverse: products.filter((p) => reverseMatch(p, nq)),
    };
  }, [query, products]);

  const totalHits = results.direct.length + results.reverse.length;

  const handleCopy = useCallback((value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(value);
      setTimeout(() => setCopied(null), 1500);
    }).catch(() => {});
  }, []);

  const handleRefClick = (ref: string) => {
    setQuery(ref);
    window.history.replaceState(null, '', `/cross-reference?q=${encodeURIComponent(ref)}`);
  };

  const renderProductCard = (product: Product) => {
    const copyKey = `${product.id}:${copied}`;
    return (
      <div key={product.id} className="bg-gray-700/40 border border-gray-600 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/catalog/${product.id}`} className="font-semibold text-white hover:text-orange transition-colors break-words">
              {product.partNumber}
            </Link>
            <div className="text-xs text-gray-400 mt-0.5">
              {product.manufacturer} · {product.condition} · {product.stockStatus}
            </div>
          </div>
          <button
            onClick={() => handleCopy(product.partNumber)}
            className="flex-shrink-0 text-gray-500 hover:text-orange transition-colors p-1"
            aria-label={`Copy ${product.partNumber}`}
            title="Copy part number"
          >
            {copyKey.endsWith(product.partNumber) ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div className="text-gray-400">NSN: <span className="text-gray-200 font-medium">{product.nsn}</span></div>
          <div className="text-gray-400">CAGE: <span className="text-gray-200 font-medium">{product.cage}</span></div>
          {product.unitPrice > 0 && (
            <div className="text-gray-400">Price: <span className="text-gray-200 font-medium">{product.currency} {product.unitPrice.toLocaleString()}</span></div>
          )}
          <div className="text-gray-400">Qty: <span className="text-gray-200 font-medium">{product.quantityAvailable}</span></div>
        </div>

        {product.shortDescription && (
          <p className="text-sm text-gray-400 line-clamp-2">{product.shortDescription}</p>
        )}

        {product.crossReferences.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              <Link2 className="w-3.5 h-3.5" />
              Cross References
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.crossReferences.map((ref) => (
                <button
                  key={ref}
                  onClick={() => handleRefClick(ref)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-600/60 text-gray-200 text-xs hover:bg-orange/20 hover:text-orange transition-colors border border-gray-500/50"
                  title={`Look up ${ref}`}
                >
                  <Link2 className="w-3 h-3" />
                  {ref}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          <Link href={`/catalog/${product.id}`}>
            <Button variant="orange" size="sm">
              <Package className="w-3.5 h-3.5" />
              View Part
            </Button>
          </Link>
          <Link href={`/rfq?partNumber=${encodeURIComponent(product.partNumber)}`}>
            <Button variant="outline" size="sm">Request Quote</Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-1 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Link2 className="w-7 h-7 text-orange" />
            <h1 className="text-3xl font-bold">Cross-Reference Tool</h1>
          </div>
          <p className="text-gray-400 mb-8">
            Find equivalent aerospace & gas turbine parts across OEMs. Search by part number, NSN, or CAGE code to see interchangeable references.
          </p>

          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by part number, NSN, or CAGE code — e.g. HOT-8473F or 14-385-9222-6921"
              className="w-full pl-11 pr-10 py-3.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); window.history.replaceState(null, '', '/cross-reference'); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading && (
            <div className="text-gray-400 py-6 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading product data...
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-red-300 max-w-2xl">
              {error}
            </div>
          )}

          {!loading && !error && query.trim() && totalHits === 0 && (
            <div className="text-gray-400 py-6">
              No matches found for &ldquo;{query}&rdquo;. Try a different part number, NSN, or CAGE code.
            </div>
          )}

          {!loading && !error && query.trim() && totalHits > 0 && (
            <div className="text-sm text-gray-400 mb-6">
              {totalHits} result{totalHits === 1 ? '' : 's'} for &ldquo;<span className="text-gray-200">{query}</span>&rdquo;
            </div>
          )}

          {results.direct.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-orange mb-4">
                Direct Matches ({results.direct.length})
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.direct.map(renderProductCard)}
              </div>
            </section>
          )}

          {results.reverse.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-orange mb-4">
                Referenced By ({results.reverse.length}) — interchangeable parts
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                These parts list your search term as a cross-reference, meaning they are interchangeable equivalents.
              </p>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.reverse.map(renderProductCard)}
              </div>
            </section>
          )}

          {!loading && !error && !query.trim() && (
            <div className="text-gray-500 py-8 max-w-2xl">
              <p className="mb-4">
                This tool matches your input against <span className="text-gray-300">2,200+ verified parts</span> and their OEM cross-references to surface interchangeable equivalents.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Search a <span className="text-gray-300">part number</span> to see its direct record and equivalent references</li>
                <li>Search an <span className="text-gray-300">NSN</span> or <span className="text-gray-300">CAGE code</span> to find all linked parts</li>
                <li>Click any reference chip to reverse-look it up instantly</li>
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}