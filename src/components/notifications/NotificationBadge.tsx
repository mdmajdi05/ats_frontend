'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

export default function NotificationBadge({ className }: { className?: string }) {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  return (
    <span className={cn('inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-red-500 text-white', className)}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}
