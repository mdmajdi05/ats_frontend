'use client';

import { useEffect, useState } from 'react';
import { getPendingCount } from '@/services/pendingService';
import { cn } from '@/lib/utils';

export default function PendingBadge({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getPendingCount().then(setCount);
    const interval = setInterval(() => getPendingCount().then(setCount), 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span className={cn('inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900', className)}>
      {count > 99 ? '99+' : count}
    </span>
  );
}
