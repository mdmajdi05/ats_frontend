'use client';

import { useEffect, useState } from 'react';
import { Tag, RefreshCw, Save, Edit3 } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface MetaEntry {
  label?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  canonicalUrl?: string;
}

export default function MetaPage() {
  const [metaMap, setMetaMap] = useState<Record<string, MetaEntry>>({});
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [form, setForm] = useState<MetaEntry>({});

  useEffect(() => { loadMeta(); }, []);

  async function loadMeta() {
    try {
      const res = await request<{ data: Record<string, MetaEntry> }>('/seo-manager/meta');
      setMetaMap(res.data || {});
    } catch {
      toast.error('Failed to load meta tags');
    } finally {
      setLoading(false);
    }
  }

  function selectPage(pageKey: string) {
    setSelectedKey(pageKey);
    setForm(metaMap[pageKey] || {});
  }

  async function saveMeta() {
    if (!selectedKey) return;
    try {
      await request(`/seo-manager/meta/${selectedKey}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setMetaMap((prev) => ({ ...prev, [selectedKey]: form }));
      toast.success('Meta tags saved');
    } catch {
      toast.error('Failed to save meta tags');
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-navy flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange" />
          Meta Tags
        </h1>
        <p className="text-sm text-text-muted mt-1">Edit meta titles, descriptions, and OG images per page</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-silver p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-navy mb-3">Pages</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {Object.keys(metaMap).length === 0 ? (
              <p className="text-sm text-text-muted">No pages found</p>
            ) : (
              Object.keys(metaMap).sort().map((key) => (
                <button
                  key={key}
                  onClick={() => selectPage(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedKey === key ? 'bg-orange/10 text-orange font-medium' : 'text-text-muted hover:bg-silver'
                  }`}
                >
                  {metaMap[key]?.label || key}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-silver p-5 lg:col-span-2">
          {!selectedKey ? (
            <p className="text-text-muted text-sm">Select a page to edit its meta tags</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy">{metaMap[selectedKey]?.label || selectedKey}</h3>
                <button onClick={saveMeta} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange/90">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Meta Title</label>
                <input value={form.metaTitle || ''} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-silver text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Meta Description</label>
                <textarea value={form.metaDescription || ''} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-silver text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">OG Image URL</label>
                <input value={form.ogImage || ''} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-silver text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Canonical URL</label>
                <input value={form.canonicalUrl || ''} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-silver text-sm" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-navy">
                  <input type="checkbox" checked={form.robotsIndex ?? true} onChange={(e) => setForm({ ...form, robotsIndex: e.target.checked })} />
                  Index
                </label>
                <label className="flex items-center gap-2 text-sm text-navy">
                  <input type="checkbox" checked={form.robotsFollow ?? true} onChange={(e) => setForm({ ...form, robotsFollow: e.target.checked })} />
                  Follow
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
