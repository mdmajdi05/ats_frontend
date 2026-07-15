'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

export default function RecoveryBinPage() {
  const [models, setModels] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res: any = await request('/dev/recovery/models');
    if (res.success) {
      setModels(res.data.models);
      setCounts(res.data.counts);
    }
    setLoading(false);
  }

  async function loadModel(model: string) {
    setSelectedModel(model);
    const res: any = await request(`/dev/recovery/${model}`);
    if (res.success) setItems(res.data);
  }

  async function restore(model: string, id: string) {
    await request(`/dev/recovery/${model}/${id}/restore`, { method: 'POST' });
    loadModel(model);
    load();
  }

  async function permanentDelete(model: string, id: string) {
    if (!confirm('Permanently delete this item? This cannot be undone.')) return;
    await request(`/dev/recovery/${model}/${id}`, { method: 'DELETE' });
    loadModel(model);
    load();
  }

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Recovery Bin</h1>
      <div className="flex gap-4 mb-6 flex-wrap">
        {models.map((model) => (
          <button key={model} onClick={() => loadModel(model)} className={`px-4 py-2 rounded ${selectedModel === model ? 'bg-blue-600' : 'bg-gray-800'} ${counts[model] > 0 ? 'ring-2 ring-red-500' : ''}`}>
            {model} ({counts[model] || 0})
          </button>
        ))}
      </div>

      {selectedModel && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-blue-400">{selectedModel} - Deleted Items</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {items.length === 0 && <p className="p-4 text-gray-500">No deleted items</p>}
            {items.map((item: any) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.title || item.fullName || item.name || item.nsn || item.id}</p>
                  <p className="text-xs text-gray-400">Deleted: {new Date(item.deletedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => restore(selectedModel, item.id)} className="px-3 py-1 bg-green-600 rounded text-sm">Restore</button>
                  <button onClick={() => permanentDelete(selectedModel, item.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Delete Forever</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
