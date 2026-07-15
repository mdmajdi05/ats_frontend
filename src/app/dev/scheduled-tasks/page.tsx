'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

const TASK_TYPES = ['backup', 'sitemap', 'schema', 'import', 'export', 'notification'];

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('backup');
  const [newCron, setNewCron] = useState('0 0 * * *');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res: any = await request('/dev/scheduled-tasks');
    if (res.success) setTasks(res.data);
    setLoading(false);
  }

  async function create() {
    await request('/dev/scheduled-tasks', { method: 'POST', body: JSON.stringify({ name: newName, type: newType, cron: newCron }), headers: { 'Content-Type': 'application/json' } });
    setShowNew(false);
    setNewName('');
    load();
  }

  async function toggle(id: string) {
    await request(`/dev/scheduled-tasks/${id}/toggle`, { method: 'PATCH' });
    load();
  }

  async function runNow(id: string) {
    const res: any = await request(`/dev/scheduled-tasks/${id}/run`, { method: 'POST' });
    alert(res.message || 'Task executed');
    load();
  }

  async function deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    await request(`/dev/scheduled-tasks/${id}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Scheduled Tasks</h1>
        <button onClick={() => setShowNew(!showNew)} className="px-4 py-2 bg-blue-600 rounded">+ New Task</button>
      </div>

      {showNew && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="bg-gray-900 rounded px-3 py-2" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Task name" />
            <select className="bg-gray-900 rounded px-3 py-2" value={newType} onChange={(e) => setNewType(e.target.value)}>
              {TASK_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input className="bg-gray-900 rounded px-3 py-2" value={newCron} onChange={(e) => setNewCron(e.target.value)} placeholder="Cron expression" />
            <button onClick={create} className="px-4 py-2 bg-green-600 rounded">Create</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task: any) => (
          <div key={task.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${task.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                <span className="font-semibold">{task.name}</span>
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">{task.type}</span>
                <span className="text-xs text-gray-400 font-mono">{task.cron}</span>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-gray-400">
                {task.lastRun && <span>Last: {new Date(task.lastRun).toLocaleString()}</span>}
                {task.lastStatus && <span className={task.lastStatus === 'success' ? 'text-green-400' : 'text-red-400'}>Status: {task.lastStatus}</span>}
                {task.nextRun && <span>Next: {new Date(task.nextRun).toLocaleString()}</span>}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => toggle(task.id)} className={`px-3 py-1 rounded text-sm ${task.enabled ? 'bg-yellow-600' : 'bg-green-600'}`}>{task.enabled ? 'Disable' : 'Enable'}</button>
              <button onClick={() => runNow(task.id)} className="px-3 py-1 bg-blue-600 rounded text-sm">Run Now</button>
              <button onClick={() => deleteTask(task.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-gray-500 text-center py-8">No scheduled tasks</p>}
      </div>
    </div>
  );
}
