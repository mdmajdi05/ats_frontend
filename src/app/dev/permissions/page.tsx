'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ data: Record<string, string>[] }>('/dev/permissions')
      .then((res) => setPermissions(res.data || []))
      .catch(() => toast.error('Failed to load permissions'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Shield className="w-6 h-6 text-emerald-400 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          DB Permissions
        </h1>
        <p className="text-sm text-white/50 mt-1">Manage database access permissions per role.</p>
      </div>

      {permissions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Shield className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No permissions configured.</p>
        </div>
      ) : (
        <pre className="text-xs text-white/60 bg-white/5 p-4 rounded-2xl overflow-x-auto">{JSON.stringify(permissions, null, 2)}</pre>
      )}
    </div>
  );
}
