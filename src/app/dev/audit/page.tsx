'use client';

import { useState, useEffect } from 'react';
import { ScrollText } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface AuditEntry {
  id: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ data: AuditEntry[] }>('/dev/audit')
      .then((res) => setLogs(res.data || []))
      .catch(() => toast.error('Failed to load audit log'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><ScrollText className="w-6 h-6 text-emerald-400 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-emerald-400" />
          Dev Audit Log
        </h1>
        <p className="text-sm text-white/50 mt-1">Track all Dev actions across the platform.</p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <ScrollText className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No audit logs yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{log.action}</p>
                  <p className="text-xs text-white/40">{log.userEmail} — {log.resource}</p>
                </div>
                <span className="text-[10px] text-white/30 flex-shrink-0">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
