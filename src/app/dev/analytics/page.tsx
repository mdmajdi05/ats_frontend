'use client';
import { useState, useEffect } from 'react';
import { BarChart3, Eye, Database, Cloud, HardDrive, Activity } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function AnalyticsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [bandwidth, setBandwidth] = useState<any>(null);
  const [storage, setStorage] = useState<any>(null);
  const [dbUsage, setDbUsage] = useState<any[]>([]);
  const [apiUsage, setApiUsage] = useState<any>(null);

  useEffect(() => {
    request<any>('/dev/analytics/visitors').then((r) => r.success && setVisitors(r.data)).catch(() => toast.error('Failed visitors'));
    request<any>('/dev/analytics/page-views').then((r) => r.success && setPageViews(r.data)).catch(() => toast.error('Failed page views'));
    request<any>('/dev/analytics/bandwidth').then((r) => r.success && setBandwidth(r.data)).catch(() => toast.error('Failed bandwidth'));
    request<any>('/dev/analytics/storage').then((r) => r.success && setStorage(r.data)).catch(() => toast.error('Failed storage'));
    request<any>('/dev/analytics/database').then((r) => r.success && setDbUsage(r.data)).catch(() => toast.error('Failed db usage'));
    request<any>('/dev/analytics/api-usage').then((r) => r.success && setApiUsage(r.data)).catch(() => toast.error('Failed api usage'));
  }, []);

  const maxVisitors = Math.max(...visitors.map((v) => v.uniqueVisitors), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Analytics
        </h1>
        <p className="text-sm text-white/50 mt-1">Visitor stats, page views, storage and API usage.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-emerald-400" />
          Daily Unique Visitors (30 days)
        </h2>
        {visitors.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">No visitor data.</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {visitors.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-emerald-500/40 rounded-t hover:bg-emerald-500/60 transition-colors"
                  style={{ height: `${(v.uniqueVisitors / maxVisitors) * 100}%` }}
                  title={`${v.date}: ${v.uniqueVisitors}`}
                />
                {i % 5 === 0 && <span className="text-[8px] text-white/30">{v.date.slice(5)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-blue-400" />
            Top Page Views
          </h2>
          {pageViews.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-6">No page view data.</p>
          ) : (
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {pageViews.slice(0, 20).map((pv, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span className="text-white/60 truncate max-w-[250px]">{pv.page}</span>
                  <span className="text-white font-medium">{pv.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-purple-400" />
            Bandwidth Usage (30 days)
          </h2>
          {bandwidth ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-white/60">Total Requests</span><span className="text-white font-bold">{bandwidth.totalRequests}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/60">Estimated Bandwidth</span><span className="text-white font-bold">{bandwidth.gb >= 1 ? `${bandwidth.gb.toFixed(2)} GB` : `${bandwidth.mb.toFixed(2)} MB`}</span></div>
            </div>
          ) : <p className="text-white/40 text-sm text-center py-6">No data.</p>}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Cloud className="w-4 h-4 text-cyan-400" />
            Storage
          </h2>
          {storage ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-white/60">Used</span><span className="text-white">{formatBytes(storage.used)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/60">Free</span><span className="text-white">{formatBytes(storage.free)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/60">Total</span><span className="text-white">{formatBytes(storage.total)}</span></div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${Math.min(storage.usagePercent, 100)}%` }} />
              </div>
            </div>
          ) : <p className="text-white/40 text-sm text-center py-6">No data.</p>}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-orange-400" />
            Database Usage
          </h2>
          {dbUsage.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-6">No data.</p>
          ) : (
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {dbUsage.map((t: any, i: number) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span className="text-white/60 truncate max-w-[200px]">{t.tableName}</span>
                  <div className="flex gap-3">
                    <span className="text-white/40">{t.rowCount ?? '-'} rows</span>
                    <span className="text-white font-medium">{t.size}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <HardDrive className="w-4 h-4 text-violet-400" />
          API Usage by Endpoint (7 days)
        </h2>
        {apiUsage ? (
          <div className="space-y-1 max-h-72 overflow-y-auto">
            <div className="flex justify-between text-sm mb-2 pb-2 border-b border-white/10">
              <span className="text-white/60">Total Requests</span>
              <span className="text-white font-bold">{apiUsage.totalRequests}</span>
            </div>
            {apiUsage.topEndpoints?.slice(0, 20).map((ep: any, i: number) => (
              <div key={i} className="flex justify-between text-xs py-1">
                <span className="text-white/60 truncate max-w-[300px]">{ep.route}</span>
                <span className="text-white font-medium">{ep.count}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-white/40 text-sm text-center py-6">No data.</p>}
      </div>
    </div>
  );
}
