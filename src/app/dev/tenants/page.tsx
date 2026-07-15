'use client';

import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  databaseUrl?: string;
  settings?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TenantForm {
  name: string;
  domain: string;
  databaseUrl: string;
}

const emptyForm: TenantForm = { name: '', domain: '', databaseUrl: '' };

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyForm);

  const load = async () => {
    try {
      const res = await request<{ success: boolean; data: Tenant[] }>('/dev/tenants');
      setTenants(res.data);
    } catch {
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (t: Tenant) => {
    setEditing(t);
    setForm({ name: t.name, domain: t.domain, databaseUrl: t.databaseUrl || '' });
    setShowModal(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await request(`/dev/tenants/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success('Tenant updated');
      } else {
        await request('/dev/tenants', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        toast.success('Tenant created');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save tenant');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this tenant?')) return;
    try {
      await request(`/dev/tenants/${id}`, { method: 'DELETE' });
      toast.success('Tenant deleted');
      load();
    } catch {
      toast.error('Failed to delete tenant');
    }
  };

  const switchTenant = async (id: string) => {
    try {
      await request(`/dev/tenants/switch/${id}`, { method: 'POST' });
      toast.success('Active tenant switched');
    } catch {
      toast.error('Failed to switch tenant');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Multi-Tenant Manager</h1>
          <p className="text-sm text-white/50 mt-1">Manage tenants and switch active tenant.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Create Tenant
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Domain</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/40">No tenants found</td>
              </tr>
            )}
            {tenants.map((t) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium">{t.name}</td>
                <td className="px-4 py-3 text-white/70">{t.domain}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                  }`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => switchTenant(t.id)} className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded-lg transition-colors">
                    Switch
                  </button>
                  <button onClick={() => openEdit(t)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 text-xs rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => remove(t.id)} className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded-lg transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl border border-white/10 p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">{editing ? 'Edit Tenant' : 'Create Tenant'}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Domain</label>
                <input
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Database URL (optional)</label>
                <input
                  value={form.databaseUrl}
                  onChange={(e) => setForm({ ...form, databaseUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={save} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
