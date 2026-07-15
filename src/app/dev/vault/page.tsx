'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Eye, EyeOff, Copy, Trash2, Edit3, Key } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface VaultSecret {
  id: string;
  name: string;
  value: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function VaultPage() {
  const [secrets, setSecrets] = useState<VaultSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: '', value: '', notes: '' });

  const fetchSecrets = async () => {
    try {
      const res = await request<{ data: VaultSecret[] }>('/dev/vault');
      setSecrets(res.data || []);
    } catch {
      toast.error('Failed to load vault secrets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSecrets(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.value) {
      toast.error('Name and value are required');
      return;
    }
    try {
      if (editId) {
        await request(`/dev/vault/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success('Secret updated');
      } else {
        await request('/dev/vault', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        toast.success('Secret created');
      }
      setForm({ name: '', value: '', notes: '' });
      setEditId(null);
      setShowAdd(false);
      fetchSecrets();
    } catch {
      toast.error('Failed to save secret');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this secret?')) return;
    try {
      await request(`/dev/vault/${id}`, { method: 'DELETE' });
      toast.success('Secret deleted');
      fetchSecrets();
    } catch {
      toast.error('Failed to delete secret');
    }
  };

  const handleEdit = (s: VaultSecret) => {
    setForm({ name: s.name, value: s.value, notes: s.notes });
    setEditId(s.id);
    setShowAdd(true);
  };

  const toggleVisible = (id: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Key className="w-6 h-6 text-emerald-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Password Manager
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Securely store API keys, database passwords, and other sensitive credentials.
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditId(null); setForm({ name: '', value: '', notes: '' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showAdd ? 'Cancel' : 'Add Secret'}
        </button>
      </div>

      {showAdd && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">{editId ? 'Edit Secret' : 'New Secret'}</h3>
          <input
            placeholder="Secret name (e.g. DB_PASSWORD)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            placeholder="Secret value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none"
          />
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {editId ? 'Update' : 'Save'}
          </button>
        </div>
      )}

      {secrets.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Key className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">No secrets stored yet.</p>
          <p className="text-white/30 text-xs mt-1">Add your first secret to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {secrets.map((s) => (
            <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Key className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{s.name}</p>
                    {s.notes && <p className="text-xs text-white/40 truncate">{s.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleVisible(s.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                    {visible.has(s.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => copyValue(s.value)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {visible.has(s.id) && (
                <div className="mt-2 px-7">
                  <code className="text-xs bg-[#1A1A1A] text-emerald-300 px-3 py-1.5 rounded-lg block break-all">
                    {s.value}
                  </code>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
