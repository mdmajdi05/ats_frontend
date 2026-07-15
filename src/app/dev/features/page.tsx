'use client';

import { useState, useEffect } from 'react';
import { GripHorizontal, Shield, ShieldOff } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

const ALL_ROLES = ['Dev', 'SuperAdmin', 'Admin', 'SEOManager', 'ContentManager', 'Trader', 'User'];

const DEFAULT_FEATURES = [
  'users.manage', 'users.roles', 'users.suspend', 'users.create',
  'blog.write', 'blog.publish', 'blog.delete', 'blog.media',
  'seo.manage', 'seo.schemas', 'seo.sitemap', 'seo.frontend-edit',
  'products.manage', 'products.import', 'inventory.manage',
  'orders.manage', 'rfqs.manage', 'chat.manage',
  'settings.system', 'settings.branding', 'settings.email',
  'traders.manage', 'content.manage', 'db.access', 'backup.manage', 'audit.view',
];

export default function FeaturesPage() {
  const [data, setData] = useState<Record<string, { featureKey: string; isEnabled: boolean }[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    try {
      const res = await request<{ data: Record<string, { featureKey: string; isEnabled: boolean }[]> }>('/dev/features');
      setData(res.data || {});
    } catch {
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeatures(); }, []);

  const toggleFeature = async (role: string, featureKey: string, isEnabled: boolean) => {
    try {
      await request(`/dev/features/${role}`, {
        method: 'PUT',
        body: JSON.stringify({ featureKey, isEnabled }),
      });
      toast.success(`${isEnabled ? 'Enabled' : 'Disabled'} ${featureKey} for ${role}`);
      fetchFeatures();
    } catch {
      toast.error('Failed to update feature');
    }
  };

  const isFeatureEnabled = (role: string, key: string) => {
    return data[role]?.find((f) => f.featureKey === key)?.isEnabled ?? false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <GripHorizontal className="w-6 h-6 text-emerald-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <GripHorizontal className="w-5 h-5 text-emerald-400" />
          Feature Control
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Enable or disable features for any role — including SuperAdmin. Dev can control everything.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/60 font-medium">Feature</th>
              {ALL_ROLES.map((role) => (
                <th key={role} className={`text-center py-3 px-3 text-[10px] uppercase tracking-wider font-medium ${
                  role === 'Dev' ? 'text-emerald-400' : role === 'SuperAdmin' ? 'text-red-400' : 'text-white/60'
                }`}>{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEFAULT_FEATURES.map((feature) => (
              <tr key={feature} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white/80 font-medium">{feature}</td>
                {ALL_ROLES.map((role) => {
                  const enabled = isFeatureEnabled(role, feature);
                  return (
                    <td key={role} className="text-center py-3 px-3">
                      <button
                        onClick={() => toggleFeature(role, feature, !enabled)}
                        className={`p-2 rounded-xl transition-all ${
                          enabled
                            ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                            : 'text-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        title={enabled ? 'Click to disable' : 'Click to enable'}
                      >
                        {enabled ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
