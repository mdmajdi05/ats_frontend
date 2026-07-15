'use client';

import { useState, useEffect } from 'react';
import { Cloud, Plus } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface BackupData {
  id: string;
  type: string;
  status: string;
  triggeredBy: string;
  createdAt: string;
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBackups = async () => {
    try {
      const res = await request<{ data: BackupData[] }>('/dev/backup');
      setBackups(res.data || []);
    } catch { toast.error('Failed to load backups'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBackups(); }, []);

  const handleTrigger = async () => {
    try {
      await request('/dev/backup', { method: 'POST' });
      toast.success('Backup triggered');
      fetchBackups();
    } catch { toast.error('Failed to trigger backup'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Cloud className="w-6 h-6 text-emerald-400 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-400" />
            Backup / Restore
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage database backups.</p>
        </div>
        <button onClick={handleTrigger} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Trigger Backup
        </button>
      </div>

      {backups.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Cloud className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No backups yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {backups.map((b) => (
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{b.type} backup</p>
                  <p className="text-xs text-white/40">by {b.triggeredBy} — {new Date(b.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  b.status === 'Complete' ? 'bg-green-900/50 text-green-300' :
                  b.status === 'Failed' ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'
                }`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
