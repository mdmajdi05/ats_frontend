'use client';

import { useEffect, useState, useCallback } from 'react';
import { Database, Trash2, ArrowRight, Check, RefreshCw, FileText, Mail, UserPlus, Package } from 'lucide-react';
import { getPendingList, batchAction, type PendingSubmission } from '@/services/pendingService';
import { request } from '@/lib/api-client';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { SkeletonTable } from '@/components/ui/Skeleton';

const TYPE_ICONS: Record<string, typeof FileText> = {
  rfq: FileText,
  contact: Mail,
  registration: UserPlus,
  inventory: Package,
};

const TYPE_COLORS: Record<string, string> = {
  rfq: 'text-purple-600 bg-purple-50',
  contact: 'text-blue-600 bg-blue-50',
  registration: 'text-emerald-600 bg-emerald-50',
  inventory: 'text-orange-600 bg-orange-50',
};

const TYPE_LABELS: Record<string, string> = {
  rfq: 'RFQ',
  contact: 'Contact Form',
  registration: 'Registration',
  inventory: 'Inventory',
};

export default function PendingSubmissionsPage() {
  const [items, setItems] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPendingList();
      setItems(data);
    } catch { setItems([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  };

  const handleBatch = async (action: 'push-to-db' | 'move-to-db' | 'delete', label: string) => {
    if (selected.size === 0) return toast.error('Select items first');
    setProcessing(true);
    const ids = Array.from(selected);
    const selectedItems = items.filter((i) => ids.includes(i.id));

    // For delete, just remove files — no DB call needed
    if (action === 'delete') {
      try {
        await batchAction('delete', ids);
        toast.success(`Deleted: ${ids.length} items`);
        setSelected(new Set());
        await load();
      } catch { toast.error('Delete failed'); }
      setProcessing(false);
      return;
    }

    // Push/Move: first send each item to the real backend
    let successCount = 0;
    let failCount = 0;
    const processed: string[] = [];

    for (const item of selectedItems) {
      const payload = item.data as { endpoint?: string; method?: string; body?: Record<string, unknown> };
      const endpoint = payload?.endpoint || '';
      const method = payload?.method || 'POST';
      const body = payload?.body || {};

      if (!endpoint) { failCount++; continue; }

      try {
        await request(endpoint, { method, body: JSON.stringify(body) });
        processed.push(item.id);
        successCount++;
      } catch {
        failCount++;
      }
    }

    // Now update/delete the successfully pushed files
    if (processed.length > 0) {
      const batchAct = action === 'push-to-db' ? 'push-to-db' : 'move-to-db';
      await batchAction(batchAct, processed);
    }

    if (failCount === 0) {
      toast.success(`${label}: ${successCount} items`);
    } else {
      toast.error(`${failCount} failed, ${successCount} pushed to DB`);
    }

    setSelected(new Set());
    await load();
    setProcessing(false);
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Pending Submissions' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-navy">Pending Submissions</h1>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-silver text-xs font-medium hover:bg-bg transition-colors">
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} /> Refresh
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-xs font-semibold text-amber-800">{selected.size || items.length} pending</span>
          <div className="flex-1" />
          <button onClick={() => handleBatch('push-to-db', 'Pushed to DB')} disabled={processing || selected.size === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            <Database className="w-3.5 h-3.5" /> Push to DB
          </button>
          <button onClick={() => handleBatch('move-to-db', 'Moved to DB')} disabled={processing || selected.size === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" /> Move to DB
          </button>
          <button onClick={() => handleBatch('delete', 'Deleted')} disabled={processing || selected.size === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 disabled:opacity-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-silver shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-semibold text-navy text-sm mb-1">All caught up!</p>
            <p className="text-xs text-text-muted">No pending submissions. Data saves here when the database is unavailable.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-silver bg-bg text-xs text-text-muted font-semibold">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selected.size === items.length && items.length > 0} onChange={toggleAll} className="rounded border-silver" />
                  </th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Summary</th>
                  <th className="text-left px-4 py-3">Source</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const Icon = TYPE_ICONS[item.type] || FileText;
                  const d = (item.data as Record<string, unknown>)?.body as Record<string, string> || item.data as Record<string, string>;
                  const summary = item.type === 'rfq'
                    ? `${d?.companyName || 'Unknown'} — ${d?.contactName || ''}`
                    : item.type === 'contact'
                    ? `${d?.name || 'Unknown'} — ${d?.subject || 'No subject'}`
                    : item.type === 'registration'
                    ? `${d?.fullName || 'Unknown'} (${d?.email || ''})`
                    : `${d?.companyName || 'Unknown'} — ${d?.contactName || ''}`;

                  return (
                    <tr key={item.id} className="border-b border-silver hover:bg-bg/50 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-silver" />
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', TYPE_COLORS[item.type] || 'text-gray-600 bg-gray-50')}>
                          <Icon className="w-3 h-3" /> {TYPE_LABELS[item.type] || item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text max-w-xs truncate">{summary}</td>
                      <td className="px-4 py-3 text-xs text-text-muted">{item.source}</td>
                      <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                          item.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700')}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
