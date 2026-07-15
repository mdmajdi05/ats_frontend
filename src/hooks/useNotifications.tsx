'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { getUnreadCount, getNotifications, markAsRead } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';
import type { AppNotification } from '@/types';

interface NotificationContextValue {
  unreadCount: number;
  notifications: AppNotification[];
  loading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  onNewNotification: (cb: (notif: AppNotification) => void) => void;
  offNewNotification: (cb: (notif: AppNotification) => void) => void;
  onCatchUp: (cb: (notifs: AppNotification[]) => void) => void;
  offCatchUp: (cb: (notifs: AppNotification[]) => void) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const prevCount = useRef(0);
  const lastId = useRef<string | null>(null);
  const catchUpDone = useRef(false);

  const newListeners = useRef<((n: AppNotification) => void)[]>([]);
  const catchUpListeners = useRef<((n: AppNotification[]) => void)[]>([]);

  const onNewNotification = useCallback((cb: (n: AppNotification) => void) => { newListeners.current.push(cb); }, []);
  const offNewNotification = useCallback((cb: (n: AppNotification) => void) => { newListeners.current = newListeners.current.filter((l) => l !== cb); }, []);
  const onCatchUp = useCallback((cb: (n: AppNotification[]) => void) => { catchUpListeners.current.push(cb); }, []);
  const offCatchUp = useCallback((cb: (n: AppNotification[]) => void) => { catchUpListeners.current = catchUpListeners.current.filter((l) => l !== cb); }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);

      if (count > prevCount.current && prevCount.current > 0) {
        const diff = count - prevCount.current;
        const { data } = await getNotifications({ isRead: false, limit: diff });
        const newOnes = data.filter((n) => n.id !== lastId.current);
        if (newOnes.length > 0) {
          lastId.current = newOnes[0].id;
          newOnes.forEach((n) => newListeners.current.forEach((cb) => cb(n)));
        }
      }

      if (count > 0 && !catchUpDone.current) {
        catchUpDone.current = true;
        const { data } = await getNotifications({ isRead: false, limit: 50 });
        if (data.length > 0) {
          setNotifications(data);
          catchUpListeners.current.forEach((cb) => cb(data));
        }
      }

      prevCount.current = count;
    } catch { /* silent */ }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      prevCount.current = 0;
      catchUpDone.current = false;
      return;
    }
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refresh]);

  const markRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setUnreadCount((c) => Math.max(0, c - 1));
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllRead = useCallback(async () => {
    const { markAllAsRead: apiCall } = await import('@/services/notificationService');
    await apiCall();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const loadMore = useCallback(async () => {
    setLoading(true);
    const { data } = await getNotifications({ limit: 50 });
    setNotifications(data);
    setLoading(false);
  }, []);

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      notifications,
      loading,
      refresh,
      markRead,
      markAllRead,
      onNewNotification,
      offNewNotification,
      onCatchUp,
      offCatchUp,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
