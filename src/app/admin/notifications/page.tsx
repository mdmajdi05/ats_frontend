'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bell, Mail, UserPlus, Package, CheckCircle, XCircle, MessageSquare, CheckCheck, Trash2, RefreshCw } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/services/notificationService';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import type { AppNotification } from '@/types';

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  rfq_submitted:      { icon: Bell,        color: 'text-purple-600 bg-purple-50', label: 'New RFQ' },
  contact_submitted:  { icon: Mail,         color: 'text-blue-600 bg-blue-50',    label: 'Contact Form' },
  user_registered:    { icon: UserPlus,     color: 'text-emerald-600 bg-emerald-50', label: 'New User' },
  inventory_submitted:{ icon: Package,      color: 'text-orange-600 bg-orange-50', label: 'Inventory' },
  rfq_quoted:         { icon: MessageSquare,color: 'text-indigo-600 bg-indigo-50', label: 'RFQ Quoted' },
  rfq_accepted:       { icon: CheckCircle,  color: 'text-green-600 bg-green-50',  label: 'RFQ Accepted' },
  rfq_rejected:       { icon: XCircle,      color: 'text-red-600 bg-red-50',      label: 'RFQ Rejected' },
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getNotifications({ limit: 100 });
      setItems(data);
    } catch { setItems([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? items : items.filter((n) => n.type === filter);

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-navy">Notifications</h1>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-silver text-xs font-medium hover:bg-bg"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
          <button onClick={handleMarkAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"><CheckCheck className="w-3.5 h-3.5" /> Mark All Read</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setFilter('all')} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', filter === 'all' ? 'bg-navy text-white' : 'bg-white border border-silver text-text-muted hover:border-navy/30')}>All ({items.length})</button>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
          const count = items.filter((n) => n.type === key).length;
          if (count === 0) return null;
          return (
            <button key={key} onClick={() => setFilter(key)} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', filter === key ? 'bg-navy text-white' : 'bg-white border border-silver text-text-muted hover:border-navy/30')}>{cfg.label} ({count})</button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-silver shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-12 h-12 text-silver mx-auto mb-3" />
            <p className="font-semibold text-navy text-sm">No notifications</p>
            <p className="text-xs text-text-muted mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-silver">
            {filtered.map((n) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg?.icon || Bell;
              return (
                <div key={n.id} className={cn('flex items-start gap-3 px-5 py-4 transition-colors', n.isRead ? 'bg-white' : 'bg-blue-50/30')}>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg?.color || 'bg-gray-50 text-gray-600')}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-navy">{n.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-text-muted whitespace-nowrap flex-shrink-0">{formatDate(n.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', cfg?.color || 'bg-gray-50 text-gray-600')}>{cfg?.label || n.type}</span>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      {n.fromName && <span className="text-[10px] text-text-muted">from {n.fromName}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <button onClick={() => handleMarkRead(n.id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Mark read">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(n.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
