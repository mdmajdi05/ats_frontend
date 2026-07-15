'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

const TYPE_COLORS: Record<string, string> = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
  backup_complete: 'bg-green-600',
  backup_failed: 'bg-red-600',
  low_stock: 'bg-orange-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res: any = await request('/dev/notifications');
    if (res.success) setNotifications(res.data);
    setLoading(false);
  }

  async function markRead(id: string) {
    await request(`/dev/notifications/${id}`, { method: 'PATCH' });
    load();
  }

  async function markAllRead() {
    await request('/dev/notifications', { method: 'PATCH' });
    load();
  }

  async function deleteNotification(id: string) {
    await request(`/dev/notifications/${id}`, { method: 'DELETE' });
    load();
  }

  const filtered = filter === 'all' ? notifications : notifications.filter((n: any) => n.type === filter);
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const types = [...new Set(notifications.map((n: any) => n.type))];

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <>
              <span className="text-sm text-gray-400">{unreadCount} unread</span>
              <button onClick={markAllRead} className="px-3 py-1 bg-blue-600 rounded text-sm">Mark All Read</button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-gray-600' : 'bg-gray-800'}`}>All</button>
        {types.map((type) => (
          <button key={type} onClick={() => setFilter(type)} className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${filter === type ? 'bg-gray-600' : 'bg-gray-800'}`}>
            <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[type] || 'bg-gray-500'}`}></span>
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((n: any) => (
          <div key={n.id} className={`bg-gray-800 rounded-lg p-4 border ${!n.read ? 'border-blue-600' : 'border-gray-700'} ${!n.read ? 'bg-gray-750' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${TYPE_COLORS[n.type] || 'bg-gray-500'}`}></span>
                <div className="flex-1">
                  <p className={`${!n.read ? 'font-semibold' : ''}`}>{n.title}</p>
                  {n.message && <p className="text-sm text-gray-400 mt-1">{n.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-blue-400 hover:text-blue-300">Mark Read</button>}
                <button onClick={() => deleteNotification(n.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No notifications found</p>}
      </div>
    </div>
  );
}
