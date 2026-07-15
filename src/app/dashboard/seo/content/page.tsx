'use client';

import { useEffect, useState } from 'react';
import { BookOpen, RefreshCw, Save, Eye } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadContent(); }, []);

  async function loadContent() {
    try {
      const res = await request<{ data: Record<string, string> }>('/seo-manager/content');
      setContent(res.data || {});
    } catch {
      toast.error('Failed to load website content');
    } finally {
      setLoading(false);
    }
  }

  const textFields = Object.entries(content).filter(
    ([key, val]) => typeof val === 'string' && key !== 'updatedAt' && key !== 'updatedBy',
  );

  async function saveContent() {
    setSaving(true);
    try {
      const res = await request<{ data: Record<string, string>; filePath: string }>('/seo-manager/content', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Content saved and written to frontend files');
    } catch {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
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
            <BookOpen className="w-5 h-5 text-orange" />
            Website Content Editor
          </h1>
          <p className="text-sm text-text-muted mt-1">Edit text content displayed on the website</p>
        </div>
        <button onClick={saveContent} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange/90 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-silver p-5">
        {textFields.length === 0 ? (
          <p className="text-sm text-text-muted">No editable content fields found.</p>
        ) : (
          <div className="space-y-4">
            {textFields.map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                </label>
                {value && value.length > 100 ? (
                  <textarea
                    value={value}
                    onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-silver text-sm"
                  />
                ) : (
                  <input
                    value={value}
                    onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-silver text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
