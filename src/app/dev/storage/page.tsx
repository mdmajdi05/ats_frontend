'use client';

import { useState, useEffect } from 'react';
import { HardDrive } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function StoragePage() {
  const [storage, setStorage] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ data: Record<string, string>[] }>('/dev/storage')
      .then((res) => setStorage(res.data || []))
      .catch(() => toast.error('Failed to load storage config'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><HardDrive className="w-6 h-6 text-emerald-400 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          Storage Config
        </h1>
        <p className="text-sm text-white/50 mt-1">File storage routing per entity type.</p>
      </div>

      {storage.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <HardDrive className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No storage configurations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {storage.map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <pre className="text-xs text-white/60">{JSON.stringify(s, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
