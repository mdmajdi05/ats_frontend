'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

export default function MonitorPage() {
  const [resources, setResources] = useState<any>(null);
  const [apiUsage, setApiUsage] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [logType, setLogType] = useState('all');
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    request('/dev/monitor/resources').then((r: any) => r.success && setResources(r.data));
    request('/dev/monitor/api-usage').then((r: any) => r.success && setApiUsage(r.data));
    request('/dev/monitor/users').then((r: any) => r.success && setActiveUsers(r.data));
    request('/dev/monitor/health').then((r: any) => r.success && setHealth(r.data));
    loadLogs('all');
  }, []);

  async function loadLogs(type: string) {
    setLogType(type);
    const res: any = await request(`/dev/monitor/logs?type=${type}`);
    if (res.success) setLogs(res.data);
  }

  function formatBytes(bytes: number) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">System Monitor</h1>

      {health && (
        <div className={`mb-6 p-4 rounded-lg ${health.status === 'healthy' ? 'bg-green-900' : 'bg-red-900'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${health.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="font-semibold text-lg capitalize">{health.status}</span>
            <span className="text-sm text-gray-300">CPU: {health.cpu} | RAM: {health.memory} | Storage: {health.storage} | Uptime: {health.uptime}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">System Resources</h2>
          {resources && (
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">CPU:</span> {resources.cpu.usage.toFixed(1)}% ({resources.cpu.cores} cores)</div>
              <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(resources.cpu.usage, 100)}%` }}></div></div>
              <div><span className="text-gray-400">RAM:</span> {formatBytes(resources.memory.used)} / {formatBytes(resources.memory.total)} ({resources.memory.usagePercent.toFixed(1)}%)</div>
              <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(resources.memory.usagePercent, 100)}%` }}></div></div>
              <div><span className="text-gray-400">Storage:</span> {formatBytes(resources.storage.used)} / {formatBytes(resources.storage.total)} ({resources.storage.usagePercent.toFixed(1)}%)</div>
              <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(resources.storage.usagePercent, 100)}%` }}></div></div>
              <div><span className="text-gray-400">Uptime:</span> {Math.floor(resources.uptime / 86400)}d {Math.floor((resources.uptime % 86400) / 3600)}h</div>
              <div><span className="text-gray-400">Platform:</span> {resources.platform}</div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">API Usage (7 days)</h2>
          {apiUsage && (
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Total Requests:</span> <span className="text-xl font-bold">{apiUsage.totalRequests}</span></div>
              <div className="mt-3"><span className="text-gray-400">Top Endpoints:</span></div>
              {apiUsage.topEndpoints?.slice(0, 8).map((ep: any, i: number) => (
                <div key={i} className="flex justify-between text-xs"><span className="truncate max-w-[200px]">{ep.route}</span><span className="text-blue-400">{ep.count}</span></div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Active Users</h2>
          {activeUsers && (
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Today</span><span className="text-xl font-bold">{activeUsers.today}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">This Week</span><span className="text-xl font-bold">{activeUsers.thisWeek}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">This Month</span><span className="text-xl font-bold">{activeUsers.thisMonth}</span></div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-400">System Logs</h2>
          <div className="flex gap-2">
            {['all', 'error', 'audit'].map((type) => (
              <button key={type} onClick={() => loadLogs(type)} className={`px-3 py-1 rounded text-sm ${logType === type ? 'bg-blue-600' : 'bg-gray-700'}`}>{type}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto text-xs font-mono">
          {logs.map((log: any, i: number) => (
            <div key={i} className={`p-1 rounded ${log.status === 'Failure' ? 'bg-red-900/30' : 'bg-gray-900/30'}`}>
              <span className="text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>{' '}
              <span className={log.status === 'Failure' ? 'text-red-400' : 'text-green-400'}>{log.action}</span>{' '}
              <span className="text-gray-400">{log.resource}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-500 text-sm">No logs found</p>}
        </div>
      </div>
    </div>
  );
}
