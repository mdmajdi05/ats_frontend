'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Bell, Mail, UserPlus, Package, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import type { AppNotification } from '@/types';

const TYPE_ICONS: Record<string, typeof Bell> = {
  rfq_submitted: Bell,
  contact_submitted: Mail,
  user_registered: UserPlus,
  inventory_submitted: Package,
  rfq_quoted: MessageSquare,
  rfq_accepted: CheckCircle,
  rfq_rejected: XCircle,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'abhi';
  if (mins < 60) return `${mins} min pehle`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ghante pehle`;
  const days = Math.floor(hrs / 24);
  return `${days} din pehle`;
}

export default function NotificationToastHandler() {
  const { onNewNotification, onCatchUp, markRead } = useNotifications();
  const { user } = useAuth();
  const shownIds = useRef<Set<string>>(new Set());
  const toastIds = useRef<Map<string, string>>(new Map());

  const showToast = useCallback((n: AppNotification) => {
    if (shownIds.current.has(n.id)) return;
    shownIds.current.add(n.id);

    const Icon = TYPE_ICONS[n.type] || Bell;
    const time = timeAgo(n.createdAt);

    const toastId = toast(
      (t) => (
        <div
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => {
            markRead(n.id);
            toast.dismiss(t.id);
            if (n.relatedType === 'rfq' && n.relatedId) {
              window.location.href = `/admin/rfqs`;
            }
          }}
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0A1628] truncate">{n.title}</p>
            <p className="text-xs text-[#4A4A6A] mt-0.5">{n.message}</p>
            <p className="text-[10px] text-[#C0C9D5] mt-1">{time}</p>
          </div>
        </div>
      ),
      { duration: 6000 }
    );

    toastIds.current.set(n.id, toastId as unknown as string);
  }, [markRead]);

  const showCatchUp = useCallback((notifs: AppNotification[]) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= notifs.length) { clearInterval(interval); return; }
      const n = notifs[index];
      if (!shownIds.current.has(n.id)) {
        shownIds.current.add(n.id);
        const Icon = TYPE_ICONS[n.type] || Bell;
        const time = timeAgo(n.createdAt);

        toast(
          (t) => (
            <div className="flex items-start gap-3" onClick={() => { toast.dismiss(t.id); markRead(n.id); }}>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0A1628] truncate">{n.title}</p>
                <p className="text-xs text-[#4A4A6A] mt-0.5">{n.message}</p>
                <p className="text-[10px] text-[#C0C9D5] mt-1">{time}</p>
              </div>
            </div>
          ),
          { duration: 4000 }
        );
      }
      index++;
    }, 2000);
  }, [markRead]);

  useEffect(() => {
    onNewNotification(showToast);
    onCatchUp(showCatchUp);
    return () => {
      // cleanup handled by useNotifications
    };
  }, [onNewNotification, onCatchUp, showToast, showCatchUp]);

  return null;
}
