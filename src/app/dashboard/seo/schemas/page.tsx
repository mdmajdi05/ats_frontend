'use client';

import { useEffect, useState } from 'react';
import { FileJson, RefreshCw, Plus, Trash2, Edit3 } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface Schema {
  pageKey: string;
  label: string;
  updatedAt: string;
}

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => { loadSchemas(); }, []);

  async function loadSchemas() {
    try {
      const res = await request<{ data: Schema[] }>('/seo-manager/schemas');
      setSchemas(res.data || []);
    } catch {
      toast.error('Failed to load schemas');
    } finally {
      setLoading(false);
    }
  }

  async function regenerate() {
    setRegenerating(true);
    try {
      const res = await request<{ data: { filePath: string; count: number } }>('/seo-manager/schemas/regenerate', { method: 'POST' });
      toast.success(`Regenerated ${res.data.count} schemas to frontend files`);
    } catch {
      toast.error('Failed to regenerate schemas');
    } finally {
      setRegenerating(false);
    }
  }

  async function deleteSchema(pageKey: string) {
    if (!confirm(`Delete schema for "${pageKey}"?`)) return;
    try {
      await request(`/seo-manager/schemas/${pageKey}`, { method: 'DELETE' });
      setSchemas((prev) => prev.filter((s) => s.pageKey !== pageKey));
      toast.success('Schema deleted');
    } catch {
      toast.error('Failed to delete schema');
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-navy flex items-center gap-2">
            <FileJson className="w-5 h-5 text-orange" />
            Schema Manager
          </h1>
          <p className="text-sm text-text-muted mt-1">Manage JSON-LD schemas for all pages</p>
        </div>
        <div className="flex gap-2">
          <button onClick={regenerate} disabled={regenerating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange/90 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            Regenerate Files
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-silver overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-silver/50">
              <th className="text-left px-4 py-3 text-text-muted font-semibold">Page Key</th>
              <th className="text-left px-4 py-3 text-text-muted font-semibold">Label</th>
              <th className="text-left px-4 py-3 text-text-muted font-semibold">Last Updated</th>
              <th className="text-right px-4 py-3 text-text-muted font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemas.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted">No schemas found</td></tr>
            ) : (
              schemas.map((s) => (
                <tr key={s.pageKey} className="border-t border-silver hover:bg-silver/30">
                  <td className="px-4 py-3 font-mono text-xs text-navy">{s.pageKey}</td>
                  <td className="px-4 py-3 text-navy">{s.label}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(s.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-silver text-text-muted hover:text-navy">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteSchema(s.pageKey)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
