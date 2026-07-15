'use client';

import { useEffect, useState } from 'react';
import { Shield, Check, X, RefreshCw, Copy, Save } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

const ALL_ROLES = ['Dev', 'SuperAdmin', 'Admin', 'SEOManager', 'ContentManager', 'Trader', 'User'];

const MODULES = [
  'users', 'roles', 'parts', 'products', 'orders', 'rfq', 'inventory',
  'blog', 'seo', 'media', 'chat', 'analytics', 'logs', 'content',
  'ai', 'notifications', 'backup', 'config', 'security', 'settings',
];

const ACTIONS = [
  'create', 'read', 'update', 'delete', 'list', 'approve', 'reject',
  'publish', 'unpublish', 'archive', 'restore', 'export', 'import', 'assign',
];

interface PermissionsMap {
  [role: string]: string[];
}

function hasPermission(features: string[], mod: string, action: string): boolean {
  return features.includes(`${mod}:${action}`) || features.includes(`${mod}.${action}`);
}

export default function PermissionsPage() {
  const [data, setData] = useState<PermissionsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: PermissionsMap }>('/superadmin/permissions');
      setData(res.data || {});
    } catch {
      setData({});
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  }

  async function togglePermission(role: string, mod: string, action: string, enabled: boolean) {
    const key = `${role}:${mod}:${action}`;
    setSaving(key);
    try {
      await request(`/superadmin/permissions/${role}/${mod}/${action}`, {
        method: 'PUT',
        body: JSON.stringify({ isEnabled: enabled }),
      });
      setData((prev) => {
        const features = prev[role] || [];
        const featureKey = `${mod}:${action}`;
        const updated = enabled
          ? [...features, featureKey]
          : features.filter((f) => f !== featureKey && f !== `${mod}.${action}`);
        return { ...prev, [role]: updated };
      });
      toast.success(enabled ? 'Permission enabled' : 'Permission disabled');
    } catch {
      toast.error('Failed to update permission');
    } finally {
      setSaving(null);
    }
  }

  const isEnabled = (role: string, mod: string, action: string) => {
    if (role === 'Dev' || role === 'SuperAdmin') return true;
    const features = data[role] || [];
    return hasPermission(features, mod, action);
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
            Permission Matrix
          </h1>
          <p className="text-sm text-purple-300/60 mt-1">
            Granular module-level permissions for each role.
          </p>
        </div>
        <button onClick={loadPermissions} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-purple-900/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-purple-900/20">
              <th className="text-left px-3 py-2.5 text-purple-300 font-semibold sticky left-0 bg-[#0D0D20] z-10">Module</th>
              {ACTIONS.map((action) => (
                <th key={action} className="px-1.5 py-2.5 text-purple-300 font-semibold text-center text-[10px] uppercase tracking-wider whitespace-nowrap">{action}</th>
              ))}
              {ALL_ROLES.map((role) => (
                <th key={role} className="px-2 py-2.5 text-purple-300 font-semibold text-center text-[10px] uppercase tracking-wider whitespace-nowrap border-l border-purple-900/20">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((mod) => (
              <tr key={mod} className="border-t border-purple-900/20 hover:bg-white/[0.02]">
                <td className="px-3 py-2 text-white/80 font-medium capitalize sticky left-0 bg-[#0D0D20] z-10">{mod}</td>
                {ACTIONS.map((action) => {
                  const devEnabled = true;
                  const saEnabled = true;
                  return (
                    <td key={`${mod}-${action}`} className="px-1.5 py-2 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {ALL_ROLES.map((role) => {
                          if (role === 'Dev' || role === 'SuperAdmin') {
                            return (
                              <span key={role} className="p-0.5">
                                <Check className="w-3 h-3 text-green-400/60" />
                              </span>
                            );
                          }
                          const enabled = isEnabled(role, mod, action);
                          const savingKey = `${role}:${mod}:${action}`;
                          const isSaving = saving === savingKey;
                          return (
                            <button
                              key={role}
                              onClick={() => togglePermission(role, mod, action, !enabled)}
                              disabled={isSaving}
                              className={`p-0.5 rounded transition-colors ${
                                enabled
                                  ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60'
                                  : 'bg-white/[0.03] text-white/20 hover:bg-white/10'
                              } ${isSaving ? 'opacity-50' : ''}`}
                            >
                              {isSaving ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : enabled ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                            </button>
                          );
                        })}
                      </div>
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
