'use client';

import { type ReactNode } from 'react';
import { useKeepAlive } from '@/hooks/useKeepAlive';

export default function DataRefreshProvider({ children }: { children: ReactNode }) {
  useKeepAlive(25_000);

  return <>{children}</>;
}
