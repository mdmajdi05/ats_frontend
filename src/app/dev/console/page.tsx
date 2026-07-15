'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

export default function ConsolePage() {
  const [tab, setTab] = useState<'sql' | 'env' | 'api' | 'maintenance' | 'flags'>('sql');
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [envUpdates, setEnvUpdates] = useState<Record<string, string>>({});
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiResult, setApiResult] = useState<any>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [newFlag, setNewFlag] = useState('');

  useEffect(() => { loadEnv(); loadMaintenance(); loadFlags(); }, []);

  async function loadEnv() {
    const res: any = await request('/dev/console/environment');
    if (res.success) setEnvVars(res.data);
  }

  async function loadMaintenance() {
    const res: any = await request('/dev/console/maintenance');
    if (res.success) setMaintenanceMode(res.data.enabled);
  }

  async function loadFlags() {
    const res: any = await request('/dev/console/feature-flags');
    if (res.success) setFeatureFlags(res.data);
  }

  async function runSql() {
    const res: any = await request('/dev/console/sql', { method: 'POST', body: JSON.stringify({ query: sqlQuery }), headers: { 'Content-Type': 'application/json' } });
    setSqlResult(res);
  }

  async function saveEnv() {
    const res: any = await request('/dev/console/environment', { method: 'PUT', body: JSON.stringify({ updates: envUpdates }), headers: { 'Content-Type': 'application/json' } });
    alert(res.message);
    setEnvUpdates({});
    loadEnv();
  }

  async function testApi() {
    const res: any = await request('/dev/console/api-test', { method: 'POST', body: JSON.stringify({ method: apiMethod, url: apiUrl }), headers: { 'Content-Type': 'application/json' } });
    setApiResult(res.data);
  }

  async function toggleMaintenance() {
    const res: any = await request('/dev/console/maintenance', { method: 'PUT', body: JSON.stringify({ enabled: !maintenanceMode }), headers: { 'Content-Type': 'application/json' } });
    if (res.success) setMaintenanceMode(!maintenanceMode);
  }

  async function toggleFlag(flag: string, enabled: boolean) {
    await request('/dev/console/feature-flags', { method: 'PUT', body: JSON.stringify({ flag, enabled }), headers: { 'Content-Type': 'application/json' } });
    loadFlags();
  }

  async function addFlag() {
    if (!newFlag) return;
    await request('/dev/console/feature-flags', { method: 'PUT', body: JSON.stringify({ flag: newFlag, enabled: true }), headers: { 'Content-Type': 'application/json' } });
    setNewFlag('');
    loadFlags();
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Developer Console</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['sql', 'env', 'api', 'maintenance', 'flags'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded capitalize ${tab === t ? 'bg-blue-600' : 'bg-gray-700'}`}>{t === 'sql' ? 'SQL Runner' : t === 'env' ? 'Environment' : t === 'api' ? 'API Tester' : t === 'maintenance' ? 'Maintenance' : 'Feature Flags'}</button>
        ))}
      </div>

      {tab === 'sql' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">SQL Runner</h2>
          <textarea className="w-full bg-gray-900 rounded p-3 text-sm font-mono mb-3" rows={5} value={sqlQuery} onChange={(e) => setSqlQuery(e.target.value)} placeholder="SELECT * FROM &quot;User&quot; LIMIT 10" />
          <button onClick={runSql} className="px-4 py-2 bg-blue-600 rounded mb-4">Run</button>
          {sqlResult && (
            <pre className="bg-gray-900 rounded p-3 text-xs overflow-auto max-h-96">{JSON.stringify(sqlResult.data || sqlResult, null, 2)}</pre>
          )}
        </div>
      )}

      {tab === 'env' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 max-h-96 overflow-y-auto">
            {Object.entries(envVars).map(([key, val]) => (
              <div key={key} className="bg-gray-900 rounded p-2">
                <div className="text-xs text-blue-400 mb-1">{key}</div>
                <input className="w-full bg-gray-800 rounded px-2 py-1 text-sm" value={envUpdates[key] ?? val} onChange={(e) => setEnvUpdates({ ...envUpdates, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <button onClick={saveEnv} className="px-4 py-2 bg-blue-600 rounded">Save Changes</button>
        </div>
      )}

      {tab === 'api' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">API Tester</h2>
          <div className="flex gap-3 mb-3">
            <select value={apiMethod} onChange={(e) => setApiMethod(e.target.value)} className="bg-gray-700 rounded px-3 py-2">
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
            </select>
            <input className="flex-1 bg-gray-900 rounded px-3 py-2" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://api.example.com/endpoint" />
            <button onClick={testApi} className="px-4 py-2 bg-blue-600 rounded">Send</button>
          </div>
          {apiResult && (
            <div>
              <div className="flex gap-4 mb-3 text-sm"><span>Status: <strong className={apiResult.status < 400 ? 'text-green-400' : 'text-red-400'}>{apiResult.status}</strong></span><span>Duration: {apiResult.duration}ms</span></div>
              <pre className="bg-gray-900 rounded p-3 text-xs overflow-auto max-h-96">{JSON.stringify(apiResult.data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {tab === 'maintenance' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Maintenance Mode</h2>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded ${maintenanceMode ? 'bg-red-600' : 'bg-green-600'}`}>{maintenanceMode ? 'Active' : 'Inactive'}</div>
            <button onClick={toggleMaintenance} className={`px-4 py-2 rounded ${maintenanceMode ? 'bg-green-600' : 'bg-red-600'}`}>{maintenanceMode ? 'Disable' : 'Enable'} Maintenance</button>
          </div>
          {maintenanceMode && <p className="mt-3 text-yellow-400 text-sm">Warning: All non-Dev users will see maintenance page</p>}
        </div>
      )}

      {tab === 'flags' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Feature Flags</h2>
          <div className="flex gap-2 mb-4">
            <input className="bg-gray-900 rounded px-3 py-2" value={newFlag} onChange={(e) => setNewFlag(e.target.value)} placeholder="new-feature-name" />
            <button onClick={addFlag} className="px-4 py-2 bg-blue-600 rounded">Add Flag</button>
          </div>
          <div className="space-y-2">
            {Object.entries(featureFlags).map(([flag, enabled]) => (
              <div key={flag} className="flex items-center justify-between bg-gray-900 rounded p-3">
                <span className="font-mono text-sm">{flag}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={enabled} onChange={(e) => toggleFlag(flag, e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
            {Object.keys(featureFlags).length === 0 && <p className="text-gray-500 text-sm">No feature flags</p>}
          </div>
        </div>
      )}
    </div>
  );
}
