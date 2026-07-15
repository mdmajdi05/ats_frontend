'use client';

import { useSiteConfig } from '@/hooks/useSiteConfig';
import toast from 'react-hot-toast';
import { Save, RefreshCw } from 'lucide-react';

export default function DashboardSettingsPage() {
  const { config, loading, saving, save, reload } = useSiteConfig();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard Settings</h1>
          <p className="text-text-muted text-sm mt-0.5">Configure your dashboard preferences</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="p-2.5 rounded-xl border border-silver text-text-muted hover:bg-silver"><RefreshCw className="w-4 h-4" /></button>
          <button
            onClick={async () => { const r = await save(config); if (r?.success) toast.success('Settings saved'); else toast.error('Failed to save'); }}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-silver overflow-hidden">
        <div className="px-6 py-4 border-b border-silver">
          <h2 className="text-base font-semibold text-navy">Site Configuration</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-text-muted">Dashboard settings panel. Full site configuration is managed in <strong>Admin → Branding</strong> or <strong>SuperAdmin → Settings</strong>.</p>
        </div>
      </div>
    </div>
  );
}
