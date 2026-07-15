'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

export default function SecurityPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [ipBlocks, setIpBlocks] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('read');
  const [newIp, setNewIp] = useState('');
  const [newIpReason, setNewIpReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [newKeyResult, setNewKeyResult] = useState<any>(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [keysRes, blocksRes, settingsRes] = await Promise.all([
      request('/dev/security/api-keys'),
      request('/dev/security/ip-blocks'),
      request('/dev/security/settings'),
    ]);
    if ((keysRes as any).success) setApiKeys((keysRes as any).data);
    if ((blocksRes as any).success) setIpBlocks((blocksRes as any).data);
    if ((settingsRes as any).success) setSettings((settingsRes as any).data);
    setLoading(false);
  }

  async function createKey() {
    const res: any = await request('/dev/security/api-keys', { method: 'POST', body: JSON.stringify({ name: newKeyName, scope: newKeyScope }), headers: { 'Content-Type': 'application/json' } });
    if (res.success) {
      setNewKeyResult(res.data);
      setShowNewKey(false);
      setNewKeyName('');
      loadAll();
    }
  }

  async function deleteKey(id: string) {
    await request(`/dev/security/api-keys/${id}`, { method: 'DELETE' });
    loadAll();
  }

  async function addIpBlock() {
    await request('/dev/security/ip-blocks', { method: 'POST', body: JSON.stringify({ ip: newIp, reason: newIpReason }), headers: { 'Content-Type': 'application/json' } });
    setNewIp('');
    setNewIpReason('');
    loadAll();
  }

  async function removeIpBlock(id: string) {
    await request(`/dev/security/ip-blocks/${id}`, { method: 'DELETE' });
    loadAll();
  }

  async function saveSettings(key: string, value: any) {
    await request('/dev/security/settings', { method: 'PUT', body: JSON.stringify({ [key]: value }), headers: { 'Content-Type': 'application/json' } });
    loadAll();
  }

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Security Settings</h1>

      {newKeyResult && (
        <div className="bg-green-900 rounded-lg p-4 mb-6 border border-green-700">
          <p className="text-green-300 font-semibold mb-2">API Key Created - Copy this now. It won't be shown again!</p>
          <pre className="bg-gray-900 rounded p-3 text-sm font-mono select-all">{newKeyResult.key}</pre>
          <button onClick={() => setNewKeyResult(null)} className="mt-2 text-sm text-gray-400 hover:text-white">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-400">API Keys</h2>
            <button onClick={() => setShowNewKey(!showNewKey)} className="px-3 py-1 bg-blue-600 rounded text-sm">+ New Key</button>
          </div>
          {showNewKey && (
            <div className="bg-gray-900 rounded p-3 mb-4 flex gap-3">
              <input className="bg-gray-800 rounded px-2 py-1 text-sm flex-1" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name" />
              <select className="bg-gray-800 rounded px-2 py-1 text-sm" value={newKeyScope} onChange={(e) => setNewKeyScope(e.target.value)}>
                <option value="read">Read</option>
                <option value="write">Write</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={createKey} className="px-3 py-1 bg-green-600 rounded text-sm">Create</button>
            </div>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {apiKeys.map((key: any) => (
              <div key={key.id} className="flex items-center justify-between bg-gray-900 rounded p-3">
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{key.prefix}... | Scope: {key.scope} | Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => deleteKey(key.id)} className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
              </div>
            ))}
            {apiKeys.length === 0 && <p className="text-gray-500 text-sm">No API keys</p>}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Security Settings</h2>
          {settings && (
            <div className="space-y-4 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Rate Limit (requests/min)</label>
                <input type="number" className="w-full bg-gray-900 rounded px-2 py-1" value={settings.rateLimitMax} onChange={(e) => saveSettings('rateLimitMax', parseInt(e.target.value))} />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Session Timeout (minutes)</label>
                <input type="number" className="w-full bg-gray-900 rounded px-2 py-1" value={settings.sessionTimeout} onChange={(e) => saveSettings('sessionTimeout', parseInt(e.target.value))} />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Max Login Attempts</label>
                <input type="number" className="w-full bg-gray-900 rounded px-2 py-1" value={settings.maxLoginAttempts} onChange={(e) => saveSettings('maxLoginAttempts', parseInt(e.target.value))} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Block VPN/Proxy</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.countryBlockEnabled} onChange={(e) => saveSettings('countryBlockEnabled', e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-400">IP Blocks</h2>
          <div className="flex gap-2">
            <input className="bg-gray-900 rounded px-2 py-1 text-sm" value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="IP Address" />
            <input className="bg-gray-900 rounded px-2 py-1 text-sm" value={newIpReason} onChange={(e) => setNewIpReason(e.target.value)} placeholder="Reason" />
            <button onClick={addIpBlock} className="px-3 py-1 bg-red-600 rounded text-sm">Block</button>
          </div>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {ipBlocks.map((block: any) => (
            <div key={block.id} className="flex items-center justify-between bg-gray-900 rounded p-3">
              <div>
                <p className="font-mono text-sm">{block.ip}</p>
                <p className="text-xs text-gray-400">{block.reason || 'No reason'} | Blocked: {new Date(block.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => removeIpBlock(block.id)} className="text-green-400 hover:text-green-300 text-sm">Unblock</button>
            </div>
          ))}
          {ipBlocks.length === 0 && <p className="text-gray-500 text-sm">No IP blocks</p>}
        </div>
      </div>
    </div>
  );
}
