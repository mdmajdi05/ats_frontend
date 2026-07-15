'use client';

import { useEffect, useState } from 'react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface Redirect {
  fromSlug: string;
  toSlug: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ fromSlug: '', toSlug: '', type: 301 });

  // Bulk import
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [importing, setImporting] = useState(false);

  async function loadRedirects() {
    setLoading(true);
    try {
      const res = await request<{ data: Redirect[] }>('/seo-manager/redirects');
      setRedirects(res.data || []);
    } catch { toast.error('Failed to load redirects'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadRedirects(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fromSlug || !form.toSlug) { toast.error('Both fields are required'); return; }
    try {
      if (editingId) {
        await request(`/seo-manager/redirects/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
        toast.success('Redirect updated');
      } else {
        await request('/seo-manager/redirects', { method: 'POST', body: JSON.stringify(form) });
        toast.success('Redirect created');
      }
      setForm({ fromSlug: '', toSlug: '', type: 301 });
      setEditingId(null);
      setShowForm(false);
      loadRedirects();
    } catch (e: any) { toast.error(e.message); }
  }

  function handleEdit(r: any) {
    setForm({ fromSlug: r.fromSlug, toSlug: r.toSlug, type: r.type });
    setEditingId(r.id);
    setShowForm(true);
    setShowBulkImport(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this redirect?')) return;
    try { await request(`/seo-manager/redirects/${id}`, { method: 'DELETE' }); toast.success('Deleted'); loadRedirects(); }
    catch { toast.error('Failed to delete'); }
  }

  async function handleBulkImport() {
    if (!bulkData.trim()) { toast.error('Paste redirect data first'); return; }
    setImporting(true);
    try {
      let redirects: { from: string; to: string; type?: number }[];

      // Try JSON first
      try {
        redirects = JSON.parse(bulkData);
      } catch {
        // Try CSV: from,to,type
        redirects = bulkData.trim().split('\n').filter(Boolean).map((line) => {
          const parts = line.split(',').map((s) => s.trim());
          return { from: parts[0], to: parts[1], type: parts[2] ? parseInt(parts[2], 10) : 301 };
        });
      }

      if (!Array.isArray(redirects) || redirects.length === 0) {
        toast.error('No valid redirects found in data');
        return;
      }

      const res = await request<{ data: { created: any[]; errors: any[]; totalCreated: number; totalErrors: number } }>(
        '/seo-manager/redirects/bulk-import',
        { method: 'POST', body: JSON.stringify({ redirects }) }
      );

      toast.success(`Imported ${res.data.totalCreated} redirects${res.data.totalErrors ? ` (${res.data.totalErrors} errors)` : ''}`);
      setBulkData('');
      setShowBulkImport(false);
      loadRedirects();
    } catch (e: any) { toast.error(e.message); }
    finally { setImporting(false); }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-widest mb-1">SEO Manager</p>
            <h1 className="text-2xl font-bold text-[#0A1628]">Redirect Manager</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowBulkImport(!showBulkImport); setShowForm(false); }}
              className="border border-[#E8EDF2] bg-white text-[#4A4A6A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-colors">
              Bulk Import
            </button>
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ fromSlug: '', toSlug: '', type: 301 }); setShowBulkImport(false); }}
              className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors">
              {showForm ? 'Cancel' : 'Add Redirect'}
            </button>
          </div>
        </div>

        {/* Single Redirect Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E8EDF2] p-4 mb-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-[#4A4A6A] block mb-1">From Slug</label>
                <input value={form.fromSlug} onChange={(e) => setForm({ ...form, fromSlug: e.target.value })}
                  className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" placeholder="old-slug" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#4A4A6A] block mb-1">To Slug</label>
                <input value={form.toSlug} onChange={(e) => setForm({ ...form, toSlug: e.target.value })}
                  className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" placeholder="new-slug" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#4A4A6A] block mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: Number(e.target.value) })}
                  className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                  <option value={301}>301 (Permanent)</option>
                  <option value={302}>302 (Temporary)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors">
              {editingId ? 'Update' : 'Create'} Redirect
            </button>
          </form>
        )}

        {/* Bulk Import */}
        {showBulkImport && (
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4 mb-6">
            <h3 className="font-bold text-[#0A1628] text-sm mb-2">Bulk Import Redirects</h3>
            <p className="text-xs text-[#C0C9D5] mb-3">
              Paste a JSON array <code className="bg-[#F8FAFC] px-1 rounded">[{'{'}from: string, to: string, type?: number{'}'}]</code> or CSV (from,to,type).
            </p>
            <textarea rows={6} value={bulkData} onChange={(e) => setBulkData(e.target.value)}
              placeholder='[{"from":"old-page","to":"new-page","type":301},{"from":"another","to":"another-new"}]'
              className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 resize-none" />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowBulkImport(false)} className="border border-[#E8EDF2] text-[#4A4A6A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8FAFC]">Cancel</button>
              <button onClick={handleBulkImport} disabled={importing || !bulkData.trim()}
                className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4338CA] disabled:opacity-50">
                {importing ? 'Importing…' : 'Import Redirects'}
              </button>
            </div>
          </div>
        )}

        {/* Redirect List */}
        {loading ? (
          <div className="text-center py-12 text-[#C0C9D5]">Loading…</div>
        ) : redirects.length === 0 ? (
          <div className="text-center py-12 text-[#C0C9D5]">No redirects configured.</div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8EDF2] bg-[#F8FAFC]">
                  <th className="text-left px-4 py-3 font-medium text-[#4A4A6A]">From</th>
                  <th className="text-left px-4 py-3 font-medium text-[#4A4A6A]">To</th>
                  <th className="text-left px-4 py-3 font-medium text-[#4A4A6A]">Type</th>
                  <th className="text-right px-4 py-3 font-medium text-[#4A4A6A]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((r: any) => (
                  <tr key={r.id} className="border-b border-[#E8EDF2] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-mono text-xs text-[#0A1628]">/{r.fromSlug}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#0A1628]">/{r.toSlug}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${r.type === 301 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.type}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(r)} className="text-xs text-[#4F46E5] hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
