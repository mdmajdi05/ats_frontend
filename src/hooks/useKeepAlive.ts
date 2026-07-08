'use client';

import { useEffect, useRef } from 'react';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function useKeepAlive(intervalMs = 25_000) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ping = async () => {
      try {
        if (USE_MOCK) return;
        const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/health`;
        await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        // Silently ignore — just a keep-alive ping
      }
    };

    ping();
    intervalRef.current = setInterval(ping, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs]);
}
