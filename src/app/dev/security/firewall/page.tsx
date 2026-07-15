'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';
import { Shield, Plus, X, ToggleLeft, ToggleRight, Edit2, Save } from 'lucide-react';

interface FirewallRule {
  id: string;
  type: 'allow' | 'block';
  sourceIp: string;
  destinationPort?: number;
  protocol?: string;
  enabled: boolean;
  createdAt?: string;
}

export default function FirewallPage() {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FirewallRule>>({});
  const [newRule, setNewRule] = useState(false);

  const blankRule: FirewallRule = { id: '', type: 'block', sourceIp: '', destinationPort: undefined, protocol: '', enabled: true };

  useEffect(() => { loadRules(); }, []);

  async function loadRules() {
    setLoading(true);
    try {
      const res: any = await request('/dev/security/firewall');
      if (res.success) setRules(res.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function createRule() {
    try {
      await request('/dev/security/firewall', { method: 'POST', body: JSON.stringify(blankRule), headers: { 'Content-Type': 'application/json' } });
      setNewRule(false);
      loadRules();
    } catch { /* ignore */ }
  }

  async function updateRule(id: string) {
    try {
      await request(`/dev/security/firewall/${id}`, { method: 'PUT', body: JSON.stringify(editForm), headers: { 'Content-Type': 'application/json' } });
      setEditingId(null);
      loadRules();
    } catch { /* ignore */ }
  }

  async function deleteRule(id: string) {
    try {
      await request(`/dev/security/firewall/${id}`, { method: 'DELETE' });
      loadRules();
    } catch { /* ignore */ }
  }

  async function toggleRule(id: string) {
    try {
      await request(`/dev/security/firewall/${id}`, { method: 'PATCH' });
      loadRules();
    } catch { /* ignore */ }
  }

  function startEdit(rule: FirewallRule) {
    setEditingId(rule.id);
    setEditForm({ type: rule.type, sourceIp: rule.sourceIp, destinationPort: rule.destinationPort, protocol: rule.protocol, enabled: rule.enabled });
  }

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            Firewall Rules
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage allow/block rules for IP traffic</p>
        </div>
        <button onClick={() => setNewRule(true)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> New Rule
        </button>
      </div>

      {newRule && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
          <h3 className="font-semibold text-sm mb-3">New Rule</h3>
          <div className="grid grid-cols-5 gap-3">
            <select value={blankRule.type} onChange={(e) => blankRule.type = e.target.value as 'allow' | 'block'}
              className="bg-gray-900 rounded px-2 py-2 text-sm">
              <option value="allow">Allow</option>
              <option value="block">Block</option>
            </select>
            <input className="bg-gray-900 rounded px-2 py-2 text-sm" placeholder="Source IP" value={blankRule.sourceIp} onChange={(e) => blankRule.sourceIp = e.target.value} />
            <input className="bg-gray-900 rounded px-2 py-2 text-sm" placeholder="Port (optional)" value={blankRule.destinationPort ?? ''} onChange={(e) => blankRule.destinationPort = e.target.value ? parseInt(e.target.value) : undefined} />
            <input className="bg-gray-900 rounded px-2 py-2 text-sm" placeholder="Protocol (optional)" value={blankRule.protocol ?? ''} onChange={(e) => blankRule.protocol = e.target.value} />
            <div className="flex gap-2">
              <button onClick={createRule} className="flex-1 px-3 py-2 bg-green-600 rounded text-sm hover:bg-green-700">Create</button>
              <button onClick={() => setNewRule(false)} className="px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Type</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Source IP</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Port</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Protocol</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Enabled</th>
              <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 && !newRule ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No firewall rules</td></tr>
            ) : rules.map((rule) => (
              <tr key={rule.id} className="border-b border-gray-700 hover:bg-gray-900/30">
                {editingId === rule.id ? (
                  <>
                    <td className="px-5 py-2">
                      <select value={editForm.type || 'block'} onChange={(e) => setEditForm(f => ({ ...f, type: e.target.value as 'allow' | 'block' }))}
                        className="bg-gray-900 rounded px-2 py-1 text-sm w-full">
                        <option value="allow">Allow</option>
                        <option value="block">Block</option>
                      </select>
                    </td>
                    <td className="px-5 py-2">
                      <input value={editForm.sourceIp || ''} onChange={(e) => setEditForm(f => ({ ...f, sourceIp: e.target.value }))}
                        className="bg-gray-900 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-5 py-2">
                      <input value={editForm.destinationPort ?? ''} onChange={(e) => setEditForm(f => ({ ...f, destinationPort: e.target.value ? parseInt(e.target.value) : undefined }))}
                        className="bg-gray-900 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-5 py-2">
                      <input value={editForm.protocol || ''} onChange={(e) => setEditForm(f => ({ ...f, protocol: e.target.value }))}
                        className="bg-gray-900 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-5 py-2">
                      <input type="checkbox" checked={editForm.enabled ?? true} onChange={(e) => setEditForm(f => ({ ...f, enabled: e.target.checked }))} />
                    </td>
                    <td className="px-5 py-2 text-right">
                      <button onClick={() => updateRule(rule.id)} className="p-1.5 rounded hover:bg-green-900/30 text-green-400">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400">
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${rule.type === 'allow' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {rule.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-sm">{rule.sourceIp}</td>
                    <td className="px-5 py-3 text-gray-400">{rule.destinationPort ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-400">{rule.protocol || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${rule.enabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                        {rule.enabled ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(rule)} title="Edit"
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleRule(rule.id)} title="Toggle"
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white">
                          {rule.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => deleteRule(rule.id)} title="Delete"
                          className="p-1.5 rounded hover:bg-red-900/30 text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
