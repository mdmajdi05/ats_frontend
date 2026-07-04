'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers, Plus, Edit2, Trash2, X, Check, Search,
  ChevronDown, Loader2, RefreshCw, Globe, Package, Cpu, List,
  LayoutGrid, Code, ArrowUp, ArrowDown, GripVertical,
} from 'lucide-react';
import { request } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { NavCategoryTree, Industry, NavCategory, FsgCategory } from '@/types';
import toast from 'react-hot-toast';

type Tab = 'industries' | 'products' | 'parts' | 'fsg';

const TABS: { key: Tab; label: string; icon: typeof Globe }[] = [
  { key: 'industries', label: 'Industries',      icon: Globe    },
  { key: 'products',   label: 'Product Categories', icon: Package },
  { key: 'parts',      label: 'Part Categories',  icon: Cpu      },
  { key: 'fsg',        label: 'FSG Categories',   icon: Layers   },
];

const ICON_OPTIONS = [
  { value: 'plane',     label: 'Plane'     },
  { value: 'settings',  label: 'Settings'  },
  { value: 'landing',   label: 'Landing'   },
  { value: 'anchor',    label: 'Anchor'    },
  { value: 'turbine',   label: 'Turbine'   },
  { value: 'plug',      label: 'Plug'      },
  { value: 'cpu',       label: 'CPU'       },
  { value: 'zap',       label: 'Zap'       },
  { value: 'wrench',    label: 'Wrench'    },
  { value: 'circle',    label: 'Circle'    },
  { value: 'shield',    label: 'Shield'    },
  { value: 'activity',  label: 'Activity'  },
  { value: 'crosshair', label: 'Crosshair' },
  { value: 'sun',       label: 'Sun'       },
  { value: 'tool',      label: 'Tool'      },
];

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Confirm Delete Modal ──────────────────────────────────
function ConfirmDeleteModal({ name, onClose, onConfirm }: {
  name: string; onClose: () => void; onConfirm: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1A2E] text-center mb-1">Delete {name}?</h2>
        <p className="text-sm text-[#4A4A6A] text-center mb-5">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#C0C9D5] text-sm text-[#4A4A6A] hover:bg-[#F5F7FA]">
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={async () => { setSaving(true); await onConfirm(); setSaving(false); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Deleting\u2026' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add/Edit Modal ────────────────────────────────────────
type ModalMode = 'add' | 'edit';
type ModalType = 'industry' | 'product' | 'part';

interface IndustryForm {
  name: string; slug: string; description: string;
  icon: string; longDescription: string; keyParts: string; clients: string;
}

interface CategoryForm {
  name: string; slug: string; description: string;
  manufacturer: string; industryIds: string[];
}

function AddEditModal({ mode, type, data, industries, categories, onClose, onSave }: {
  mode: ModalMode;
  type: ModalType;
  data?: Industry | NavCategory;
  industries: Industry[];
  categories: NavCategory[];
  onClose: () => void;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  const isIndustry = type === 'industry';

  const [name, setName] = useState(data?.name ?? '');
  const [slug, setSlug] = useState(data && 'slug' in data ? (data as any).slug ?? '' : '');
  const [desc, setDesc] = useState(data?.description ?? '');
  const [icon, setIcon] = useState(isIndustry ? (data as Industry)?.icon ?? 'plane' : '');
  const [longDesc, setLongDesc] = useState(isIndustry ? (data as Industry)?.longDescription ?? '' : '');
  const [keyPartsStr, setKeyPartsStr] = useState(
    isIndustry ? ((data as Industry)?.keyParts ?? []).join(', ') : ''
  );
  const [clientsStr, setClientsStr] = useState(
    isIndustry ? ((data as Industry)?.clients ?? []).join(', ') : ''
  );
  const [manufacturer, setManufacturer] = useState(
    !isIndustry ? (data as NavCategory)?.manufacturer ?? '' : ''
  );
  const [industryIds, setIndustryIds] = useState<string[]>(
    !isIndustry ? (data as NavCategory)?.industryIds ?? [] : []
  );
  // Template config — support both new (cardView/listView sub-obj) and flat format
  const existingCard = data && 'cardConfig' in data ? (data as any).cardConfig || {} : {};
  const existingCardView = existingCard.cardView || {};
  const existingListView = existingCard.listView || {};

  const [defaultView, setDefaultView] = useState<'list' | 'card'>(
    existingCard.defaultView || existingCard.template || 'card'
  );

  // Card View settings
  const [cardGridCols, setCardGridCols] = useState(existingCardView.gridCols || existingCard.gridCols || 3);
  const [cardShowImage, setCardShowImage] = useState(
    existingCardView.showImage !== undefined ? existingCardView.showImage : existingCard.showImage !== false
  );
  const [cardShowTitle, setCardShowTitle] = useState(
    existingCardView.showTitle !== undefined ? existingCardView.showTitle : existingCard.showTitle !== false
  );
  const [cardShowDescription, setCardShowDescription] = useState(
    existingCardView.showDescription !== undefined ? existingCardView.showDescription : existingCard.showDescription !== false
  );
  const [cardShowButton, setCardShowButton] = useState(
    existingCardView.showButton !== undefined ? existingCardView.showButton : existingCard.showButton !== false
  );
  const [cardButtonLabel, setCardButtonLabel] = useState(
    existingCardView.buttonLabel || existingCard.buttonLabel || 'View Details'
  );
  const [cardPlaceholder, setCardPlaceholder] = useState(
    existingCardView.placeholder || existingCard.placeholder || ''
  );
  const [cardFields, setCardFields] = useState(
    (existingCardView.fields || existingCard.fields || []).join(', ')
  );
  const [cardTitleField, setCardTitleField] = useState(
    existingCardView.titleField || existingCard.titleField || ''
  );
  const [cardDescField, setCardDescField] = useState(
    existingCardView.descField || existingCard.descField || ''
  );
  const [cardImageField, setCardImageField] = useState(
    existingCardView.imageField || existingCard.imageField || ''
  );

  // List View settings
  const [listPageSize, setListPageSize] = useState(
    existingListView.pageSize || existingCard.pageSize || 25
  );

  // Available columns from category items data
  const availableColumns = useMemo(() => {
    if (isIndustry || !data || !('items' in data)) return [];
    const cats = data as NavCategory;
    const keys = new Set<string>();
    for (const item of cats.items ?? []) {
      if (item.data) Object.keys(item.data).forEach(k => keys.add(k));
    }
    return Array.from(keys).filter(k => k !== '_columnOrder');
  }, [data, isIndustry]);

  // List column order state — initialized from existingListView.fields or all available columns
  const [listColumnOrder, setListColumnOrder] = useState<string[]>(() => {
    const saved = existingListView.fields || existingCard.fields;
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return [];
  });

  const [showRawCardJson, setShowRawCardJson] = useState(false);
  const [showRawPageJson, setShowRawPageJson] = useState(false);
  const [cardConfig, setCardConfig] = useState(
    data && 'cardConfig' in data ? JSON.stringify((data as any).cardConfig, null, 2) : ''
  );
  const [pageConfig, setPageConfig] = useState('');
  const existingPage = data && 'pageConfig' in data ? (data as any).pageConfig || {} : {};
  const [heroImage, setHeroImage] = useState(existingPage.heroImage || '');
  const [content, setContent] = useState(existingPage.content || '');
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(
    existingPage.relatedSlugs || []
  );

  const handleNameChange = (v: string) => {
    setName(v);
    if (mode === 'add') setSlug(toSlug(v));
  };

  const toggleIndustryId = (id: string) => {
    setIndustryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name, slug: slug || toSlug(name), description: desc,
      };
      if (isIndustry) {
        body.icon = icon;
        body.longDescription = longDesc;
        body.keyParts = keyPartsStr.split(',').map((s) => s.trim()).filter(Boolean);
        body.clients = clientsStr.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        body.industryIds = industryIds;
        body.manufacturer = manufacturer;
        body.type = type;
      }
      // Build cardConfig with separate cardView/listView sub-objects
      const newCardView: Record<string, unknown> = {
        showImage: cardShowImage,
        gridCols: cardGridCols,
        showTitle: cardShowTitle,
        showDescription: cardShowDescription,
        showButton: cardShowButton,
        buttonLabel: cardButtonLabel,
      };
      if (cardPlaceholder.trim()) newCardView.placeholder = cardPlaceholder.trim();
      if (cardFields.trim()) newCardView.fields = cardFields.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (cardTitleField.trim()) newCardView.titleField = cardTitleField.trim();
      if (cardDescField.trim()) newCardView.descField = cardDescField.trim();
      if (cardImageField.trim()) newCardView.imageField = cardImageField.trim();

      const newListView: Record<string, unknown> = {
        pageSize: listPageSize,
      };
      if (listColumnOrder.length > 0) newListView.fields = listColumnOrder;

      const configFromUI: Record<string, unknown> = {
        defaultView,
        cardView: newCardView,
        listView: newListView,
      };
      if (showRawCardJson && cardConfig.trim()) {
        try { Object.assign(configFromUI, JSON.parse(cardConfig)); } catch { toast.error('Invalid JSON in Card Config'); setSaving(false); return; }
      }
      body.cardConfig = configFromUI;
      // Build pageConfig: raw JSON first, then visual fields on top (visual wins)
      const merged: Record<string, unknown> = {};
      if (pageConfig.trim()) {
        try { Object.assign(merged, JSON.parse(pageConfig)); } catch { toast.error('Invalid JSON in Page Config'); setSaving(false); return; }
      }
      if (heroImage.trim()) merged.heroImage = heroImage.trim();
      if (content.trim()) merged.content = content.trim();
      if (relatedSlugs.length > 0) merged.relatedSlugs = relatedSlugs;
      body.pageConfig = merged;
      await onSave(body);
    } finally {
      setSaving(false);
    }
  };

  const valid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1A1A2E]">
            {mode === 'add' ? 'Add' : 'Edit'} {isIndustry ? 'Industry' : type === 'product' ? 'Product Category' : 'Part Category'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#4A4A6A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Name *</label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
            />
          </div>
          {/* Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
            />
          </div>
          {/* Description */}
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Description</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 resize-none"
            />
          </div>

          {isIndustry && (
            <>
              {/* Icon */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Icon</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                >
                  {ICON_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              {/* Long Description */}
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Long Description</label>
                <textarea
                  rows={2}
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 resize-none"
                />
              </div>
              {/* Key Parts */}
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Key Parts (comma-separated)</label>
                <input
                  value={keyPartsStr}
                  onChange={(e) => setKeyPartsStr(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                />
              </div>
              {/* Clients */}
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Clients (comma-separated)</label>
                <input
                  value={clientsStr}
                  onChange={(e) => setClientsStr(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                />
              </div>
            </>
          )}

          {!isIndustry && (
            <>
              {/* Manufacturer (for part categories) */}
              {type === 'part' && (
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-1">Manufacturer</label>
                  <input
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                  />
                </div>
              )}
              {/* Industry IDs multi-select */}
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#4A4A6A] mb-2">Industries</label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => toggleIndustryId(ind.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                        industryIds.includes(ind.id)
                          ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                          : 'bg-white text-[#4A4A6A] border-[#C0C9D5] hover:border-[#4F46E5]'
                      )}
                    >
                      {industryIds.includes(ind.id) && <Check className="w-3 h-3 inline mr-1" />}
                      {ind.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Page Content — hero image, rich content, related categories */}
          <div className="col-span-2 bg-[#F5F7FA] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-[#4A4A6A]">Page Content & Related</label>
              <span className="text-[10px] text-[#4A4A6A]/60">Content dikhane ke liye fields</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Hero Image URL</label>
              <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://example.com/hero.jpg"
                className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
              <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Page ke top par banner image dikhegi. Daaloge nahi to sirf gradient background rahega.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Content (HTML / Rich Text)</label>
              <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="<p>Category ke baare me details...</p>"
                className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 resize-none" />
              <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Category page par items ke upar extra content dikhega. HTML daal sakte ho.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Related Categories</label>
              <div className="border border-[#C0C9D5] rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1.5">
                {relatedSlugs.map((slug) => (
                  <span key={slug} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[11px] text-[#4F46E5] font-medium">
                    {slug}
                    <button onClick={() => setRelatedSlugs(relatedSlugs.filter((s) => s !== slug))} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !relatedSlugs.includes(val)) {
                      setRelatedSlugs([...relatedSlugs, val]);
                    }
                  }}
                  className="flex-1 min-w-[140px] text-xs px-1 py-0.5 border-none bg-transparent focus:outline-none"
                >
                  <option value="">+ Add related category...</option>
                  {categories
                    .filter((c) => c.slug !== (data as NavCategory)?.slug && !relatedSlugs.includes(c.slug))
                    .map((c) => <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>)}
                </select>
              </div>
              <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">In categories ke items page ke bottom me cards ki tarah dikhenge.</p>
            </div>
          </div>

          {/* Display Settings — Separate Card & List View */}
          <div className="col-span-2 bg-[#F5F7FA] rounded-xl p-4 space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-[#4A4A6A]">Display Settings</label>
              <span className="text-[10px] text-[#4A4A6A]/60">Configure how items appear on the frontend</span>
            </div>

            {/* Default View */}
            <div className="flex gap-2">
              <button type="button" onClick={() => setDefaultView('card')}
                className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors',
                  defaultView === 'card'
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                    : 'bg-white text-[#4A4A6A] border-[#C0C9D5] hover:border-[#4F46E5]'
                )}>
                <LayoutGrid className="w-4 h-4 inline mr-1.5" />Default: Card View
              </button>
              <button type="button" onClick={() => setDefaultView('list')}
                className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors',
                  defaultView === 'list'
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                    : 'bg-white text-[#4A4A6A] border-[#C0C9D5] hover:border-[#4F46E5]'
                )}>
                <List className="w-4 h-4 inline mr-1.5" />Default: List View
              </button>
            </div>

            {/* ─── Card View Settings ─── */}
            <div className="bg-white rounded-xl border border-[#D0D8E3] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#4F46E5]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#4A4A6A]">Card View Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Grid Columns</label>
                  <select value={cardGridCols} onChange={(e) => setCardGridCols(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Number of cards per row</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Button Label</label>
                  <input value={cardButtonLabel} onChange={(e) => setCardButtonLabel(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Text on card button (e.g. &quot;View Details&quot;)</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Placeholder</label>
                  <input value={cardPlaceholder} onChange={(e) => setCardPlaceholder(e.target.value)} placeholder="No image"
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Shown when no image</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Fields to Display</label>
                  <input value={cardFields} onChange={(e) => setCardFields(e.target.value)} placeholder="title, description, price"
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Comma-separated field names from item data</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Title Field</label>
                  <select value={cardTitleField} onChange={(e) => setCardTitleField(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                    <option value="">— Default (item title) —</option>
                    {availableColumns.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Column to use as card title</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Description Field</label>
                  <select value={cardDescField} onChange={(e) => setCardDescField(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                    <option value="">— Default (item description) —</option>
                    {availableColumns.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Column for card description</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Image Field</label>
                  <select value={cardImageField} onChange={(e) => setCardImageField(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                    <option value="">— Default (item image) —</option>
                    {availableColumns.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Column with image URL</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={cardShowImage} onChange={(e) => setCardShowImage(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#C0C9D5] text-[#4F46E5]" />
                  <span className="text-[11px] font-medium text-[#1A1A2E]">Show Image</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={cardShowTitle} onChange={(e) => setCardShowTitle(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#C0C9D5] text-[#4F46E5]" />
                  <span className="text-[11px] font-medium text-[#1A1A2E]">Show Title</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={cardShowDescription} onChange={(e) => setCardShowDescription(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#C0C9D5] text-[#4F46E5]" />
                  <span className="text-[11px] font-medium text-[#1A1A2E]">Show Description</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={cardShowButton} onChange={(e) => setCardShowButton(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#C0C9D5] text-[#4F46E5]" />
                  <span className="text-[11px] font-medium text-[#1A1A2E]">Show Button</span>
                </label>
              </div>
            </div>

            {/* ─── List View Settings ─── */}
            <div className="bg-white rounded-xl border border-[#D0D8E3] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-[#4F46E5]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#4A4A6A]">List View Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Column Order</label>
                  <div className="border border-[#C0C9D5] rounded-lg overflow-hidden">
                    {listColumnOrder.length === 0 && (
                      <p className="text-[11px] text-[#4A4A6A]/50 px-2.5 py-3 text-center italic">
                        All columns shown in default order. Add columns below.
                      </p>
                    )}
                    {listColumnOrder.map((col, i) => (
                      <div key={col} className="flex items-center gap-1 px-2 py-1.5 border-b border-[#C0C9D5]/50 last:border-b-0">
                        <span className="text-[10px] text-[#4A4A6A]/40 w-4 tabular-nums">{i + 1}.</span>
                        <span className="text-xs text-[#1A1A2E] flex-1 truncate">{col}</span>
                        <button
                          disabled={i === 0}
                          onClick={() => {
                            const arr = [...listColumnOrder];
                            [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                            setListColumnOrder(arr);
                          }}
                          className="p-0.5 rounded hover:bg-[#F0F2F5] disabled:opacity-20 text-[#4A4A6A]"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={i === listColumnOrder.length - 1}
                          onClick={() => {
                            const arr = [...listColumnOrder];
                            [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
                            setListColumnOrder(arr);
                          }}
                          className="p-0.5 rounded hover:bg-[#F0F2F5] disabled:opacity-20 text-[#4A4A6A]"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setListColumnOrder(listColumnOrder.filter((c) => c !== col))}
                          className="p-0.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {availableColumns.length > 0 && (
                      <div className="px-2 py-2 border-t border-[#C0C9D5]/50 bg-[#F5F7FA]">
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !listColumnOrder.includes(val)) {
                              setListColumnOrder([...listColumnOrder, val]);
                            }
                          }}
                          className="w-full text-xs px-2 py-1 rounded border border-[#C0C9D5] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                        >
                          <option value="">+ Add column...</option>
                          {availableColumns
                            .filter((k) => !listColumnOrder.includes(k))
                            .map((k) => <option key={k} value={k}>{k}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Reorder to control column display order</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4A4A6A] mb-1">Page Size</label>
                  <input type="number" min={5} max={200} value={listPageSize} onChange={(e) => setListPageSize(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                  <p className="text-[10px] text-[#4A4A6A]/60 mt-0.5">Items per page (5–200)</p>
                </div>
              </div>
            </div>

            {/* Raw JSON toggle for advanced users */}
            <div>
              <button type="button" onClick={() => setShowRawCardJson(!showRawCardJson)}
                className="text-[10px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
                <Code className="w-3 h-3" />{showRawCardJson ? 'Hide' : 'Show'} Raw JSON Override
              </button>
              {showRawCardJson && (
                <textarea rows={2} value={cardConfig} onChange={(e) => setCardConfig(e.target.value)}
                  placeholder='{"customField": "value"} — merges with visual settings above'
                  className="w-full mt-1.5 px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 resize-none" />
              )}
            </div>
          </div>
          {/* Page Config raw JSON override */}
          <div className="col-span-2">
            <button type="button" onClick={() => setShowRawPageJson(!showRawPageJson)}
              className="text-[10px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
              <Code className="w-3 h-3" />{showRawPageJson ? 'Hide' : 'Show'} Raw Page Config Override
            </button>
            {showRawPageJson && (
              <textarea rows={3} value={pageConfig} onChange={(e) => setPageConfig(e.target.value)}
                placeholder='{"seo": {"title": "..."}, "extraField": "value"} — merges with visual settings above'
                className="w-full mt-1.5 px-2.5 py-2 rounded-lg border border-[#C0C9D5] text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 resize-none" />
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#C0C9D5] text-sm text-[#4A4A6A] hover:bg-[#F5F7FA]">
            Cancel
          </button>
          <button
            disabled={saving || !valid}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-[#4F46E5] text-white text-sm font-semibold hover:bg-[#4338CA] disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving\u2026' : mode === 'add' ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('industries');
  const [tree, setTree] = useState<NavCategoryTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editData, setEditData] = useState<Industry | NavCategory | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: NavCategoryTree }>('/nav-categories');
      setTree(res.data || null);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = (type: ModalType) => {
    setModalType(type);
    setModalMode('add');
    setEditData(undefined);
  };

  const openEdit = (type: ModalType, data: Industry | NavCategory) => {
    setModalType(type);
    setModalMode('edit');
    setEditData(data);
  };

  const handleSave = async (body: Record<string, unknown>) => {
    if (!modalType) return;
    try {
      if (modalMode === 'add') {
        await request('/admin/categories', { method: 'POST', body: JSON.stringify({ ...body, type: modalType }) });
        toast.success('Created');
      } else if (editData) {
        await request(`/admin/categories/${editData.id}`, { method: 'PUT', body: JSON.stringify(body) });
        toast.success('Updated');
      }
      setModalType(null);
      setEditData(undefined);
      load();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await request(`/admin/categories/${deleteTarget.id}`, { method: 'DELETE' });
      toast.success('Deleted');
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Delete failed');
    }
  };

  const s = search.toLowerCase();

  const filteredIndustries = (tree?.industries ?? []).filter(
    (i) => !s || i.name.toLowerCase().includes(s) || (i.description ?? '').toLowerCase().includes(s)
  );

  const filteredProducts = (tree?.productCategories ?? []).filter(
    (c) => !s || c.name.toLowerCase().includes(s) || (c.description ?? '').toLowerCase().includes(s)
  );

  const filteredParts = (tree?.partCategories ?? []).filter(
    (c) => !s || c.name.toLowerCase().includes(s) || (c.description ?? '').toLowerCase().includes(s) || (c.manufacturer ?? '').toLowerCase().includes(s)
  );

  const filteredFsg = (tree?.fsgCategories ?? []).filter(
    (c) => !s || c.name.toLowerCase().includes(s) || c.fsg.includes(s) || (c.fsc ?? '').includes(s)
  );

  const resolveIndustries = (ids: string[]) =>
    ids.map((id) => tree?.industries.find((i) => i.id === id)?.name).filter(Boolean).join(', ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Categories</h1>
          <p className="text-[#4A4A6A] text-sm mt-0.5">
            Manage industries, product categories, and part categories
          </p>
        </div>
        <button
          onClick={() => openAdd(activeTab === 'industries' ? 'industry' : activeTab === 'products' ? 'product' : 'part')}
          disabled={activeTab === 'fsg'}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
            activeTab === 'fsg'
              ? 'bg-[#E8EDF2] text-[#4A4A6A] cursor-not-allowed'
              : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
          )}
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === 'industries' ? 'Industry' : activeTab === 'products' ? 'Category' : 'Category'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F5F7FA] rounded-xl border border-[#E8EDF2] w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSearch(''); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === key
                ? 'bg-white text-[#1A1A2E] shadow-sm'
                : 'text-[#4A4A6A] hover:text-[#1A1A2E]'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search + Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A6A]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'industries' ? 'industries' : activeTab === 'products' ? 'product categories' : activeTab === 'parts' ? 'part categories' : 'FSG categories'}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C0C9D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
          />
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-[#C0C9D5] hover:bg-[#F5F7FA] transition-colors" title="Refresh">
          <RefreshCw className={cn('w-4 h-4 text-[#4A4A6A]', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#4F46E5] animate-spin" />
        </div>
      ) : (
        <>
          {/* Industries Tab */}
          {activeTab === 'industries' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIndustries.map((ind) => (
                <div key={ind.id} className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                        <Globe className="w-5 h-5 text-[#4F46E5]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A1A2E]">{ind.name}</h3>
                        <p className="text-xs text-[#4A4A6A]">/{ind.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit('industry', ind)}
                        className="p-1.5 rounded-lg hover:bg-[#EEF2FF] text-[#4A4A6A] hover:text-[#4F46E5] transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget({ id: ind.id, name: ind.name })}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#4A4A6A] hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A4A6A] mt-3 line-clamp-2">{ind.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#4A4A6A]">
                    <span>{ind.partCount ?? 0} parts</span>
                    <span className="w-1 h-1 rounded-full bg-[#C0C9D5]" />
                    <span>Icon: {ind.icon}</span>
                  </div>
                </div>
              ))}
              {filteredIndustries.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Globe className="w-12 h-12 text-[#C0C9D5] mx-auto mb-3" />
                  <p className="text-[#4A4A6A]">No industries found</p>
                </div>
              )}
            </div>
          )}

          {/* Product Categories Tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#4F46E5]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A1A2E]">{cat.name}</h3>
                        <p className="text-xs text-[#4A4A6A]">/{cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit('product', cat)}
                        className="p-1.5 rounded-lg hover:bg-[#EEF2FF] text-[#4A4A6A] hover:text-[#4F46E5] transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#4A4A6A] hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A4A6A] mt-3 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#4A4A6A]">
                    <span>Industries: {resolveIndustries(cat.industryIds ?? []) || 'None'}</span>
                  </div>
                  <Link href={`/admin/category-items?categoryId=${cat.id}`}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium hover:bg-indigo-100 transition-all">
                    <List className="w-3.5 h-3.5" />
                    Manage Items
                  </Link>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Package className="w-12 h-12 text-[#C0C9D5] mx-auto mb-3" />
                  <p className="text-[#4A4A6A]">No product categories found</p>
                </div>
              )}
            </div>
          )}

          {/* Part Categories Tab */}
          {activeTab === 'parts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParts.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-[#4F46E5]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A1A2E]">{cat.name}</h3>
                        <p className="text-xs text-[#4A4A6A]">/{cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit('part', cat)}
                        className="p-1.5 rounded-lg hover:bg-[#EEF2FF] text-[#4A4A6A] hover:text-[#4F46E5] transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#4A4A6A] hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A4A6A] mt-3 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#4A4A6A]">
                    <span>Manufacturer: {cat.manufacturer ?? 'N/A'}</span>
                    <span className="w-1 h-1 rounded-full bg-[#C0C9D5]" />
                    <span>Industries: {resolveIndustries(cat.industryIds ?? []) || 'None'}</span>
                  </div>
                  <Link href={`/admin/category-items?categoryId=${cat.id}`}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium hover:bg-indigo-100 transition-all">
                    <List className="w-3.5 h-3.5" />
                    Manage Items
                  </Link>
                </div>
              ))}
              {filteredParts.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Cpu className="w-12 h-12 text-[#C0C9D5] mx-auto mb-3" />
                  <p className="text-[#4A4A6A]">No part categories found</p>
                </div>
              )}
            </div>
          )}

          {/* FSG Categories Tab (read-only) */}
          {activeTab === 'fsg' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFsg.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                      <Layers className="w-5 h-5 text-[#4F46E5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A2E]">{cat.name}</h3>
                      <p className="text-xs text-[#4A4A6A]">FSG {cat.fsg} / FSC {cat.fsc}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A4A6A] mt-3 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#4A4A6A]">
                    <span>{cat.partCount} parts</span>
                    <span className="w-1 h-1 rounded-full bg-[#C0C9D5]" />
                    <span>Icon: {cat.icon}</span>
                  </div>
                </div>
              ))}
              {filteredFsg.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Layers className="w-12 h-12 text-[#C0C9D5] mx-auto mb-3" />
                  <p className="text-[#4A4A6A]">No FSG categories found</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {modalType && (
        <AddEditModal
          mode={modalMode}
          type={modalType}
          data={editData}
          industries={tree?.industries ?? []}
          categories={
            modalType === 'product'
              ? (tree?.productCategories ?? [])
              : (tree?.partCategories ?? [])
          }
          onClose={() => { setModalType(null); setEditData(undefined); }}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
