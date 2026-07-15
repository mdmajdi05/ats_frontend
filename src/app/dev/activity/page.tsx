'use client';
import { useState, useEffect, useCallback } from 'react';
import { Activity, PlayCircle, XCircle, Clock } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function ActivityPage() {
  const [dashboard, setDashboard] = useState<any>(null);

  const load = useCallback(async () => {
    try {
      const res = await request<any>('/dev/activity/dashboard');
      if (res.success) setDashboard(res.data);
    } catch { toast.error('Failed to load activity dashboard'); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Activity Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">Live activity monitoring and recent events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-white/60">Active Users (5m)</span>
          </div>
          <p className="text-3xl font-bold text-white">{dashboard?.liveActiveUsers ?? '-'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-white/60">Running Jobs</span>
          </div>
          <p className="text-3xl font-bold text-white">{dashboard?.runningJobs ?? '-'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-white/60">Failed Jobs (24h)</span>
          </div>
          <p className="text-3xl font-bold text-white">{dashboard?.failedJobs ?? '-'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Recent Activity Feed</h2>
        </div>
        <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
          {dashboard?.recentActivity?.length === 0 && (
            <div className="p-8 text-center text-white/40 text-sm">No recent activity.</div>
          )}
          {dashboard?.recentActivity?.map((log: any, i: number) => (
            <div key={i} className="p-3 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{log.action}</p>
                  <p className="text-xs text-white/40">{log.userEmail} — {log.resource}</p>
                </div>
                <span className="text-[10px] text-white/30 flex-shrink-0">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
