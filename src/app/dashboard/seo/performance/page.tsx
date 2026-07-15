'use client';

import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface PerfConfig {
  lazyLoad: boolean;
  imageOptimization: boolean;
  minifyHtml: boolean;
  minifyCss: boolean;
  minifyJs: boolean;
  preload: boolean;
  prefetch: boolean;
  criticalCss: boolean;
}

const TOGGLES: { key: keyof PerfConfig; label: string }[] = [
  { key: 'lazyLoad', label: 'Lazy Load' },
  { key: 'imageOptimization', label: 'Image Optimization' },
  { key: 'minifyHtml', label: 'Minify HTML' },
  { key: 'minifyCss', label: 'Minify CSS' },
  { key: 'minifyJs', label: 'Minify JS' },
  { key: 'preload', label: 'Preload' },
  { key: 'prefetch', label: 'Prefetch' },
  { key: 'criticalCss', label: 'Critical CSS' },
];

export default function PerformanceSEOPage() {
  const [config, setConfig] = useState<PerfConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    request<{ success: boolean; data: PerfConfig }>('/seo-manager/performance')
      .then((res) => setConfig(res.data))
      .catch(() => toast.error('Failed to load performance config'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key: keyof PerfConfig) => {
    if (!config) return;
    setConfig({ ...config, [key]: !config[key] });
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await request('/seo-manager/performance', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      toast.success('Performance config saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Performance &amp; SEO Config</h1>
        <p className="text-sm text-white/50 mt-1">
          Toggle performance optimization features for the frontend.
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-white/10 p-6 space-y-4">
        {TOGGLES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-white/80">{label}</span>
            <button
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config?.[key] ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  config?.[key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
