'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';
import { Shield, Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CountryBlocksPage() {
  const [blocks, setBlocks] = useState<Record<string, { code: string; enabled: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => { loadBlocks(); }, []);

  async function loadBlocks() {
    setLoading(true);
    try {
      const res: any = await request('/dev/security/country-blocks');
      if (res.success) setBlocks(res.data || {});
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function addBlock() {
    if (!newCode || newCode.length !== 2) return;
    setAdding(true);
    try {
      await request('/dev/security/country-blocks', { method: 'POST', body: JSON.stringify({ code: newCode.toUpperCase() }), headers: { 'Content-Type': 'application/json' } });
      setNewCode('');
      loadBlocks();
    } catch { /* ignore */ }
    setAdding(false);
  }

  async function removeBlock(code: string) {
    try {
      await request(`/dev/security/country-blocks/${code}`, { method: 'DELETE' });
      loadBlocks();
    } catch { /* ignore */ }
  }

  async function toggleBlock(code: string) {
    try {
      await request(`/dev/security/country-blocks/${code}`, { method: 'PATCH' });
      loadBlocks();
    } catch { /* ignore */ }
  }

  const entries = Object.entries(blocks);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            Country Blocks
          </h1>
          <p className="text-gray-400 text-sm mt-1">Block or allow traffic by country code</p>
        </div>
        <div className="flex gap-2">
          <input
            className="bg-gray-900 rounded px-3 py-2 text-sm w-20 uppercase"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="US"
            maxLength={2}
          />
          <button onClick={addBlock} disabled={adding || newCode.length !== 2}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Code</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Enabled</th>
              <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-500">No country blocks configured</td></tr>
            ) : entries.map(([code, block]) => (
              <tr key={code} className="border-b border-gray-700 hover:bg-gray-900/30">
                <td className="px-5 py-3">
                  <span className="font-mono font-bold text-lg">{code}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${block.enabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                    {block.enabled ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggleBlock(code)} title="Toggle"
                      className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white">
                      {block.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => removeBlock(code)} title="Remove"
                      className="p-1.5 rounded hover:bg-red-900/30 text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
