import type { AppNotification, NotificationType } from '@/types';

export interface NotificationFilters {
  forUserId?: string;
  forRole?: string;
  isRead?: boolean;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

export async function getNotifications(filters: NotificationFilters = {}): Promise<{ data: AppNotification[]; total: number }> {
  const qs = new URLSearchParams();
  if (filters.forUserId) qs.set('forUserId', filters.forUserId);
  if (filters.forRole) qs.set('forRole', filters.forRole);
  if (filters.isRead !== undefined) qs.set('isRead', String(filters.isRead));
  if (filters.type) qs.set('type', filters.type);
  if (filters.limit) qs.set('limit', String(filters.limit));
  if (filters.offset) qs.set('offset', String(filters.offset));
  const res = await fetch(`/api/notifications?${qs}`);
  const json = await res.json();
  return { data: json.data || [], total: json.total || 0 };
}

export async function getUnreadCount(): Promise<number> {
  try {
    const res = await fetch('/api/notifications/count');
    const json = await res.json();
    return json.count || 0;
  } catch { return 0; }
}

export async function markAsRead(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
}

export async function markAllAsRead(): Promise<void> {
  await fetch('/api/notifications/read-all', { method: 'POST' });
}

export async function createNotification(data: {
  type: NotificationType;
  title: string;
  message: string;
  forUserId?: string;
  forRole?: string;
  fromUserId?: string;
  fromName?: string;
  relatedType?: string;
  relatedId?: string;
}): Promise<string> {
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.id;
}

export async function deleteNotification(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
}

export interface NotificationSettings {
  role: string;
  types: NotificationType[];
  toastEnabled: boolean;
  catchUpOnLogin: boolean;
}

export async function getNotificationSettings(): Promise<NotificationSettings[]> {
  try {
    const res = await fetch('/api/notifications/settings');
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

export async function updateNotificationSettings(settings: NotificationSettings[]): Promise<void> {
  await fetch('/api/notifications/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: settings }),
  });
}
