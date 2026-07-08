'use client';

import { useState, useEffect } from 'react';
import { schemaService, type PageSchema } from '@/services/schemaService';
import {
  Globe, FileJson, Search, Plus, Save, Trash2,
  ExternalLink, RefreshCw, ChevronDown, ChevronUp,
  Loader2, CheckCircle2, AlertCircle, Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_KEYS = [
  { key: 'homepage',         label: 'Homepage' },
  { key: 'catalog',          label: 'Parts Catalog' },
  { key: 'about',            label: 'About Us' },
  { key: 'contact',          label: 'Contact' },
  { key: 'quality',          label: 'Quality' },
  { key: 'rfq',              label: 'Request Quote' },
  { key: 'inventory',        label: 'Inventory' },
  { key: 'industries-listing', label: 'Industries (Listing)' },
  { key: 'catalog-product',  label: 'Product Detail (fallback)' },
];

const SITE_URL = 'https://aeroturbinespare.com';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export default function SEOManagerPage() {
  const [schemas, setSchemas] = useState<PageSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PageSchema> & { label: string }>({ label: '' });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const resp = await schemaService.list();
      setSchemas(resp.data);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function getSchema(pageKey: string): PageSchema | undefined {
    return schemas.find((s) => s.pageKey === pageKey);
  }

  function openEditor(pageKey: string) {
    const existing = getSchema(pageKey);
    setEditingKey(pageKey);
    setForm({
      label: existing?.label || PAGE_KEYS.find((p) => p.key === pageKey)?.label || pageKey,
      schemaJson: existing?.schemaJson || null,
      faqItems: existing?.faqItems || null,
      metaTitle: existing?.metaTitle || null,
      metaDescription: existing?.metaDescription || null,
      ogImage: existing?.ogImage || null,
      robotsIndex: existing?.robotsIndex ?? null,
      robotsFollow: existing?.robotsFollow ?? null,
      canonicalUrl: existing?.canonicalUrl || null,
      extraHead: existing?.extraHead || null,
    });
    setExpandedSections((prev) => ({ ...prev, [pageKey]: true }));
  }

  function closeEditor() {
    setEditingKey(null);
    setForm({ label: '' });
  }

  async function handleSave() {
    if (!editingKey) return;
    try {
      await schemaService.upsert(editingKey, {
        label: form.label || editingKey,
        schemaJson: form.schemaJson,
        faqItems: form.faqItems,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        ogImage: form.ogImage,
        robotsIndex: form.robotsIndex,
        robotsFollow: form.robotsFollow,
        canonicalUrl: form.canonicalUrl,
        extraHead: form.extraHead,
      });
      toast.success(`SEO settings saved for "${form.label || editingKey}"`);
      await load();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  }

  async function handleDelete(pageKey: string) {
    if (!confirm(`Delete SEO settings for "${pageKey}"?`)) return;
    try {
      await schemaService.delete(pageKey);
      toast.success('Deleted');
      if (editingKey === pageKey) closeEditor();
      await load();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  }

  async function handlePublish() {
    try {
      const res = await fetch(`${API_BASE}/seo/publish`, { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        toast.success('SEO config published to frontend! All pages updated.');
      } else {
        toast.error(json.error || 'Publish failed');
      }
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  }

  const filteredKeys = PAGE_KEYS.filter(
    (p) =>
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">SEO Manager</h1>
          <p className="text-sm text-[#4A4A6A]/70 mt-1">
            Manage meta tags, structured data, and SEO settings for all pages.
            Changes update the frontend in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A6A]/50" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages…"
              className="pl-9 pr-3 py-2 text-sm border border-[#E8EDF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 w-48"
            />
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#4A4A6A] bg-white border border-[#E8EDF2] rounded-lg hover:bg-[#F5F7FA] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#4F46E5] rounded-lg hover:bg-[#4338CA] transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" /> Publish to Frontend
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 mb-6 text-xs text-[#4A4A6A]/70 bg-[#F8F9FF] rounded-xl px-4 py-3 border border-[#E8EDF2]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          {schemas.length} pages configured
        </span>
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#4F46E5]" />
          Hardcoded defaults active + backend overrides
        </span>
        <span className="flex items-center gap-1.5">
          <FileJson className="w-3.5 h-3.5 text-[#E8751A]" />
          JSON-LD auto-injected
        </span>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Page list */}
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-white rounded-xl border border-[#E8EDF2] p-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#4A4A6A]" />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#4A4A6A]/50">
                Pages
              </p>
              {filteredKeys.map((p) => {
                const existing = getSchema(p.key);
                return (
                  <button
                    key={p.key}
                    onClick={() => openEditor(p.key)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition ${
                      editingKey === p.key
                        ? 'bg-[#0A1628] text-white'
                        : 'hover:bg-[#F5F7FA] text-[#0A1628]'
                    }`}
                  >
                    <span className="font-medium truncate">{p.label}</span>
                    {existing && (
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Configured" />
                    )}
                  </button>
                );
              })}
              {filteredKeys.length === 0 && (
                <p className="text-sm text-[#4A4A6A]/60 text-center py-4">No pages match</p>
              )}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-white rounded-xl border border-[#E8EDF2] p-6">
          {!editingKey ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Globe className="w-12 h-12 text-[#4A4A6A]/30 mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1628] mb-1">Select a Page</h3>
              <p className="text-sm text-[#4A4A6A]/60 max-w-sm">
                Choose a page from the left panel to manage its SEO settings, schema markup, and meta tags.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0A1628]">
                  {form.label || editingKey}
                </h2>
                <div className="flex items-center gap-2">
                  <a
                    href={`${SITE_URL}/${editingKey === 'homepage' ? '' : editingKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#4F46E5] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> View page
                  </a>
                  <button
                    onClick={() => handleDelete(editingKey)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-1">Label</label>
                <input
                  value={form.label || ''}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#0A1628]"
                />
              </div>

              {/* Meta Tags Section */}
              <div className="border border-[#E8EDF2] rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((p) => ({ ...p, meta: !p.meta }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F9FF] text-sm font-semibold text-[#0A1628]"
                >
                  <span>Meta Tags</span>
                  {expandedSections.meta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.meta && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#4A4A6A] mb-1">Meta Title</label>
                      <input
                        value={form.metaTitle || ''}
                        onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value || null }))}
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#0A1628]"
                        placeholder={`Default: AeroTurbineSpare — ...`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4A4A6A] mb-1">Meta Description</label>
                      <textarea
                        value={form.metaDescription || ''}
                        onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value || null }))}
                        rows={3}
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#0A1628] resize-none"
                        placeholder="SEO description..."
                      />
                      <p className="text-[10px] text-[#4A4A6A]/50 mt-1">
                        {form.metaDescription?.length || 0}/160 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4A4A6A] mb-1">OG Image URL</label>
                      <input
                        value={form.ogImage || ''}
                        onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value || null }))}
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#0A1628]"
                        placeholder="/og-image.svg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4A4A6A] mb-1">Canonical URL</label>
                      <input
                        value={form.canonicalUrl || ''}
                        onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value || null }))}
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#0A1628]"
                        placeholder="https://aeroturbinespare.com/..."
                      />
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-[#0A1628]">
                        <input
                          type="checkbox"
                          checked={form.robotsIndex !== false}
                          onChange={(e) => setForm((f) => ({ ...f, robotsIndex: e.target.checked }))}
                          className="rounded border-[#E8EDF2]"
                        />
                        Allow indexing
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#0A1628]">
                        <input
                          type="checkbox"
                          checked={form.robotsFollow !== false}
                          onChange={(e) => setForm((f) => ({ ...f, robotsFollow: e.target.checked }))}
                          className="rounded border-[#E8EDF2]"
                        />
                        Allow follow links
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* JSON-LD Schema Section */}
              <div className="border border-[#E8EDF2] rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((p) => ({ ...p, schema: !p.schema }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F9FF] text-sm font-semibold text-[#0A1628]"
                >
                  <span>JSON-LD Structured Data</span>
                  {expandedSections.schema ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.schema && (
                  <div className="p-4 space-y-4">
                    <p className="text-xs text-[#4A4A6A]/70">
                      Custom JSON-LD schema that overrides the hardcoded defaults. 
                      Leave empty to use built-in schema.
                    </p>
                    <textarea
                      value={
                        form.schemaJson
                          ? JSON.stringify(form.schemaJson, null, 2)
                          : ''
                      }
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value.trim()
                            ? JSON.parse(e.target.value)
                            : null;
                          setForm((f) => ({ ...f, schemaJson: parsed }));
                        } catch {
                          // Allow typing invalid JSON
                        }
                      }}
                      rows={10}
                      className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm font-mono text-[#0A1628]"
                      placeholder='{"@context":"https://schema.org","@type":"WebPage",...}'
                    />
                  </div>
                )}
              </div>

              {/* FAQ Items Section */}
              <div className="border border-[#E8EDF2] rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((p) => ({ ...p, faq: !p.faq }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F9FF] text-sm font-semibold text-[#0A1628]"
                >
                  <span>FAQ Items (for FAQPage schema)</span>
                  {expandedSections.faq ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.faq && (
                  <div className="p-4 space-y-4">
                    <textarea
                      value={
                        Array.isArray(form.faqItems)
                          ? JSON.stringify(form.faqItems, null, 2)
                          : ''
                      }
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value.trim()
                            ? JSON.parse(e.target.value)
                            : null;
                          setForm((f) => ({ ...f, faqItems: parsed }));
                        } catch {
                          // Allow typing
                        }
                      }}
                      rows={8}
                      className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm font-mono text-[#0A1628]"
                      placeholder='[{"question":"...","answer":"..."}]'
                    />
                    <p className="text-xs text-[#4A4A6A]/70">
                      Array of Q&A pairs. Will generate FAQPage schema automatically.
                    </p>
                  </div>
                )}
              </div>

              {/* Extra Head Section */}
              <div className="border border-[#E8EDF2] rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSections((p) => ({ ...p, head: !p.head }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F9FF] text-sm font-semibold text-[#0A1628]"
                >
                  <span>Extra Head &lt;meta&gt; Tags</span>
                  {expandedSections.head ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.head && (
                  <div className="p-4 space-y-4">
                    <textarea
                      value={
                        form.extraHead
                          ? JSON.stringify(form.extraHead, null, 2)
                          : ''
                      }
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value.trim()
                            ? JSON.parse(e.target.value)
                            : null;
                          setForm((f) => ({ ...f, extraHead: parsed }));
                        } catch {
                          // Allow typing
                        }
                      }}
                      rows={6}
                      className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm font-mono text-[#0A1628]"
                      placeholder='{"custom-meta-name":"value"}'
                    />
                  </div>
                )}
              </div>

              {/* Save button */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8EDF2]">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#0A1628] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#0A1628]/90 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </button>
                <button
                  onClick={closeEditor}
                  className="border border-[#E8EDF2] text-[#4A4A6A] text-sm px-5 py-2.5 rounded-lg hover:bg-[#F5F7FA] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
