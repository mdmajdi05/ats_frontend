'use client';

import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function ConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ data: Record<string, string> }>('/dev/config')
      .then((res) => setConfig(res.data || {}))
      .catch(() => toast.error('Failed to load config'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await request('/dev/config', { method: 'PUT', body: JSON.stringify(config) });
      toast.success('Config saved');
    } catch { toast.error('Failed to save config'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Settings className="w-6 h-6 text-emerald-400 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            System Config
          </h1>
          <p className="text-sm text-white/50 mt-1">View and update system configuration.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 mb-1">{key}</p>
            <input
              value={String(value)}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
