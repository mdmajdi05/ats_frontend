'use client';

import { useEffect, useState } from 'react';
import { Shield, Check, X, RefreshCw, Save } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';
import type { UserRole } from '@/types';

interface FeatureEntry {
  role: UserRole;
  features: string[];
}

const ALL_ROLES: UserRole[] = ['SuperAdmin', 'Admin', 'SEOManager', 'ContentManager', 'Trader', 'User'];
const ALL_FEATURES = [
  { key: 'users.manage', label: 'User Management' },
  { key: 'users.roles', label: 'Change User Roles' },
  { key: 'users.suspend', label: 'Suspend Users' },
  { key: 'users.create', label: 'Create Users' },
  { key: 'blog.write', label: 'Write Blog Posts' },
  { key: 'blog.publish', label: 'Publish Blog Posts' },
  { key: 'blog.delete', label: 'Delete Blog Posts' },
  { key: 'blog.media', label: 'Manage Media' },
  { key: 'seo.manage', label: 'SEO Management' },
  { key: 'seo.schemas', label: 'Schema Management' },
  { key: 'seo.sitemap', label: 'Sitemap Management' },
  { key: 'seo.frontend-edit', label: 'Edit Frontend Files' },
  { key: 'products.manage', label: 'Product Management' },
  { key: 'products.import', label: 'Import Products' },
  { key: 'inventory.manage', label: 'Inventory Management' },
  { key: 'orders.manage', label: 'Order Management' },
  { key: 'rfqs.manage', label: 'RFQ Management' },
  { key: 'chat.manage', label: 'Chat Inbox' },
  { key: 'settings.system', label: 'System Settings' },
  { key: 'settings.branding', label: 'Branding Settings' },
  { key: 'traders.manage', label: 'Manage Traders' },
  { key: 'content.manage', label: 'Content Editing' },
  { key: 'db.access', label: 'Database Access' },
  { key: 'backup.manage', label: 'Backup Management' },
  { key: 'audit.view', label: 'View Audit Logs' },
];

export default function FeaturesPage() {
  const [data, setData] = useState<FeatureEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    try {
      const res = await request<{ data: FeatureEntry[] }>('/superadmin/features');
      const entries = res.data || [];
      const merged = ALL_ROLES.map((role) => {
        const existing = entries.find((e) => e.role === role);
        return { role, features: existing?.features || [] };
      });
      setData(merged);
    } catch {
      setData(ALL_ROLES.map((r) => ({ role: r, features: [] })));
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeature(role: UserRole, featureKey: string, enabled: boolean) {
    try {
      await request(`/superadmin/features/${role}`, {
        method: 'PUT',
        body: JSON.stringify({ featureKey, isEnabled: enabled }),
      });
      setData((prev) =>
        prev.map((entry) => {
          if (entry.role !== role) return entry;
          const features = enabled
            ? [...entry.features, featureKey]
            : entry.features.filter((f) => f !== featureKey);
          return { ...entry, features };
        }),
      );
      toast.success(enabled ? 'Feature enabled' : 'Feature disabled');
    } catch {
      toast.error('Failed to update feature');
    }
  }

  const isEnabled = (role: UserRole, featureKey: string) => {
    if (role === 'SuperAdmin') return true;
    return data.find((e) => e.role === role)?.features.includes(featureKey) || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Feature Delegation
          </h1>
          <p className="text-sm text-purple-300/60 mt-1">
            Enable or disable features for each role. SuperAdmin always has all features.
          </p>
        </div>
        <button onClick={loadFeatures} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-purple-900/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-purple-900/20">
              <th className="text-left px-4 py-3 text-purple-300 font-semibold">Feature</th>
              {ALL_ROLES.map((role) => (
                <th key={role} className="px-4 py-3 text-purple-300 font-semibold text-center">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_FEATURES.map((feature) => (
              <tr key={feature.key} className="border-t border-purple-900/20 hover:bg-white/5">
                <td className="px-4 py-3 text-white/80">{feature.label}</td>
                {ALL_ROLES.map((role) => (
                  <td key={`${role}-${feature.key}`} className="px-4 py-3 text-center">
                    {role === 'SuperAdmin' ? (
                      <Check className="w-4 h-4 text-green-400 mx-auto" />
                    ) : (
                      <button
                        onClick={() => toggleFeature(role, feature.key, !isEnabled(role, feature.key))}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isEnabled(role, feature.key)
                            ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60'
                            : 'bg-white/5 text-white/30 hover:bg-white/10'
                        }`}
                      >
                        {isEnabled(role, feature.key) ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
