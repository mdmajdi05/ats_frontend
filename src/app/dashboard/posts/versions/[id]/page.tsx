'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { request } from '@/lib/api-client';
import Link from 'next/link';

export default function VersionsPage() {
  const params = useParams<{ id: string }>();
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [versionA, setVersionA] = useState<string>('');
  const [versionB, setVersionB] = useState<string>('');
  const [diffData, setDiffData] = useState<any | null>(null);
  const [loadingDiff, setLoadingDiff] = useState(false);

  async function loadVersions() {
    setLoading(true);
    try {
      const res = await request<{ data: any[] }>(`/blog/manage/posts/${params.id}/versions`);
      setVersions(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { loadVersions(); }, [params.id]);

  async function handleRestore(versionId: string) {
    if (!confirm('Restore this version? Current content will be replaced. A new version will be created for the current state.')) return;
    try {
      await request(`/blog/manage/posts/${params.id}/versions/${versionId}/restore`, { method: 'POST' });
      alert('Version restored successfully');
      loadVersions();
    } catch { alert('Failed to restore version'); }
  }

  async function handleCompare() {
    if (!versionA || !versionB) return;
    setLoadingDiff(true);
    setDiffData(null);
    try {
      const res = await request<{ data: any }>(`/blog/manage/posts/${params.id}/versions/compare`, {
        method: 'POST',
        body: JSON.stringify({ versionA, versionB }),
      });
      setDiffData(res.data);
    } catch { alert('Failed to compare versions'); }
    finally { setLoadingDiff(false); }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/posts" className="text-[#C0C9D5] hover:text-[#4F46E5] text-sm">← Back to Posts</Link>
          <h1 className="text-2xl font-bold text-[#0A1628]">Version History</h1>
        </div>

        {/* Compare Mode Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { setCompareMode(!compareMode); setDiffData(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${compareMode ? 'bg-[#4F46E5] text-white' : 'bg-white border border-[#E8EDF2] text-[#4A4A6A] hover:bg-[#F8FAFC]'}`}>
            {compareMode ? 'Exit Compare' : 'Compare Versions'}
          </button>
        </div>

        {/* Compare Section */}
        {compareMode && (
          <div className="bg-white rounded-2xl border border-[#E8EDF2] p-5 mb-6">
            <h2 className="font-bold text-[#0A1628] mb-3">Compare Two Versions</h2>
            <div className="flex flex-wrap items-end gap-3 mb-3">
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider block mb-1">Version A (older)</label>
                <select value={versionA} onChange={(e) => setVersionA(e.target.value)}
                  className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                  <option value="">Select version</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>v{v.version} - {new Date(v.createdAt).toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider block mb-1">Version B (newer)</label>
                <select value={versionB} onChange={(e) => setVersionB(e.target.value)}
                  className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                  <option value="">Select version</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>v{v.version} - {new Date(v.createdAt).toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleCompare} disabled={!versionA || !versionB || loadingDiff}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                {loadingDiff ? 'Comparing…' : 'Compare'}
              </button>
            </div>

            {diffData && (
              <div className="mt-4 border border-[#E8EDF2] rounded-xl overflow-hidden">
                <div className="bg-[#F8FAFC] px-4 py-2 text-xs text-[#4A4A6A]">
                  v{diffData.versionA.version} ({new Date(diffData.versionA.createdAt).toLocaleString()})
                  vs v{diffData.versionB.version} ({new Date(diffData.versionB.createdAt).toLocaleString()})
                  — {diffData.diff.length} difference{diffData.diff.length !== 1 ? 's' : ''}
                </div>
                {diffData.diff.length === 0 ? (
                  <div className="p-4 text-sm text-[#C0C9D5]">No differences found between these versions.</div>
                ) : (
                  <div className="divide-y divide-[#E8EDF2]">
                    {diffData.diff.map((d: any, i: number) => (
                      <div key={i} className="p-4">
                        <p className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider mb-1">{d.field}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs font-mono text-red-800 max-h-32 overflow-y-auto">
                            <span className="text-red-500 font-semibold">- </span>{String(d.oldValue || '(empty)').slice(0, 500)}
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs font-mono text-green-800 max-h-32 overflow-y-auto">
                            <span className="text-green-500 font-semibold">+ </span>{String(d.newValue || '(empty)').slice(0, 500)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Version List */}
        {loading ? (
          <div className="text-center py-12 text-[#C0C9D5]">Loading…</div>
        ) : versions.length === 0 ? (
          <div className="text-center py-12 text-[#C0C9D5]">No versions saved yet. Versions are auto-created when you update a post.</div>
        ) : (
          <div className="space-y-2">
            {versions.map((v: any) => (
              <div key={v.id}
                className={`bg-white rounded-2xl border p-4 cursor-pointer transition-colors ${selectedVersion?.id === v.id ? 'border-[#4F46E5] ring-1 ring-[#4F46E5]/20' : 'border-[#E8EDF2] hover:border-[#4F46E5]/50'}`}
                onClick={() => setSelectedVersion(selectedVersion?.id === v.id ? null : v)}>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#0A1628]">v{v.version}</p>
                    <p className="text-xs text-[#C0C9D5]">{v.title} · {new Date(v.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleRestore(v.id); }}
                      className="text-xs text-[#4F46E5] hover:underline font-medium">Restore</button>
                  </div>
                </div>
                {selectedVersion?.id === v.id && (
                  <div className="mt-3 pt-3 border-t border-[#E8EDF2]">
                    <pre className="text-xs text-[#4A4A6A] whitespace-pre-wrap max-h-60 overflow-y-auto bg-[#F8FAFC] rounded-lg p-3 font-mono">
                      {v.content?.slice(0, 3000) || '(empty)'}
                      {v.content?.length > 3000 ? '…' : ''}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
