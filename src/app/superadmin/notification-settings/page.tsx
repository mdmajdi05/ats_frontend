'use client';

import { useEffect, useState, useCallback } from 'react';
import { getNotificationSettings, updateNotificationSettings } from '@/services/notificationService';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { NotificationType } from '@/types';
import { Save, RefreshCw } from 'lucide-react';

const ALL_TYPES: { key: NotificationType; label: string }[] = [
  { key: 'rfq_submitted', label: 'New RFQ' },
  { key: 'contact_submitted', label: 'Contact Form' },
  { key: 'user_registered', label: 'New User Registration' },
  { key: 'inventory_submitted', label: 'Inventory Submission' },
  { key: 'rfq_quoted', label: 'RFQ Quoted' },
  { key: 'rfq_accepted', label: 'RFQ Accepted' },
  { key: 'rfq_rejected', label: 'RFQ Rejected' },
];

interface RoleSetting {
  role: string;
  types: NotificationType[];
  toastEnabled: boolean;
  catchUpOnLogin: boolean;
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<RoleSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getNotificationSettings();
    setSettings(data as RoleSetting[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleType = (roleIdx: number, type: NotificationType) => {
    setSettings((prev) => {
      const next = [...prev];
      const s = { ...next[roleIdx] };
      const has = s.types.includes(type);
      s.types = has ? s.types.filter((t) => t !== type) : [...s.types, type];
      next[roleIdx] = s;
      return next;
    });
  };

  const toggleToast = (roleIdx: number) => {
    setSettings((prev) => {
      const next = [...prev];
      next[roleIdx] = { ...next[roleIdx], toastEnabled: !next[roleIdx].toastEnabled };
      return next;
    });
  };

  const toggleCatchUp = (roleIdx: number) => {
    setSettings((prev) => {
      const next = [...prev];
      next[roleIdx] = { ...next[roleIdx], catchUpOnLogin: !next[roleIdx].catchUpOnLogin };
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotificationSettings(settings);
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0D0D20] p-8">
      <div className="text-purple-400 text-sm">Loading settings...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
          <p className="text-purple-300/60 text-sm mt-0.5">Configure which roles receive which notification types</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2.5 rounded-xl border border-purple-900/30 text-purple-400 hover:bg-purple-900/20"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-60"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </div>

      <div className="space-y-4">
        {settings.map((roleSetting, idx) => (
          <div key={roleSetting.role} className="bg-[#13132B] rounded-2xl border border-purple-900/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-purple-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-400">{roleSetting.role.charAt(0)}</span>
                </div>
                <span className="text-white font-semibold text-sm">{roleSetting.role}</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-purple-300/70 cursor-pointer">
                  <input type="checkbox" checked={roleSetting.toastEnabled} onChange={() => toggleToast(idx)} className="rounded border-purple-900/50 bg-purple-900/20 text-purple-600 focus:ring-purple-500" />
                  Toasts
                </label>
                <label className="flex items-center gap-1.5 text-xs text-purple-300/70 cursor-pointer">
                  <input type="checkbox" checked={roleSetting.catchUpOnLogin} onChange={() => toggleCatchUp(idx)} className="rounded border-purple-900/50 bg-purple-900/20 text-purple-600 focus:ring-purple-500" />
                  Catch-up on Login
                </label>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map(({ key, label }) => {
                  const active = roleSetting.types.includes(key);
                  return (
                    <button key={key} onClick={() => toggleType(idx, key)}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', active ? 'bg-purple-600/20 border-purple-500/50 text-purple-300' : 'border-purple-900/30 text-purple-400/50 hover:border-purple-500/30')}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
