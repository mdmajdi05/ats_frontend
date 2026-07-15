'use client';

import { useState } from 'react';
import { ArrowRightLeft, ArrowRight, Combine } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function MigrationsPage() {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMigrate = async () => {
    if (!source || !target) { toast.error('Source and target required'); return; }
    setLoading(true);
    try {
      await request('/dev/migrate', { method: 'POST', body: JSON.stringify({ source, target }) });
      toast.success('Migration started');
    } catch { toast.error('Migration failed'); }
    finally { setLoading(false); }
  };

  const handleMerge = async () => {
    if (!source || !target) { toast.error('Source and target required'); return; }
    setLoading(true);
    try {
      await request('/dev/migrate/merge', { method: 'POST', body: JSON.stringify({ source, target }) });
      toast.success('Merge completed');
    } catch { toast.error('Merge failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
          Data Migration
        </h1>
        <p className="text-sm text-white/50 mt-1">Migrate or merge data between databases.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 max-w-lg">
        <input placeholder="Source DB name" value={source} onChange={(e) => setSource(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
        <input placeholder="Target DB name" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />

        <div className="flex items-center gap-3">
          <button onClick={handleMigrate} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
            <ArrowRight className="w-4 h-4" /> Migrate
          </button>
          <button onClick={handleMerge} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
            <Combine className="w-4 h-4" /> Merge
          </button>
        </div>
      </div>
    </div>
  );
}
