'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, Database, FileText, ShoppingCart, Cloud, ShieldCheck } from 'lucide-react';
import { request } from '@/lib/api-client';

interface SystemStats {
  totalUsers: number;
  totalParts: number;
  totalRFQs: number;
  totalOrders: number;
  totalBackups: number;
  totalVault: number;
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <Icon className="w-10 h-10 text-white/30" />
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ data: SystemStats }>('/dev/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BarChart3 className="w-6 h-6 text-emerald-400 animate-pulse" />
      </div>
    );
  }

  const s = stats || { totalUsers: 0, totalParts: 0, totalRFQs: 0, totalOrders: 0, totalBackups: 0, totalVault: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          System Stats
        </h1>
        <p className="text-sm text-white/50 mt-1">Complete platform statistics at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Users" value={s.totalUsers} color="hover:border-emerald-500/30" />
        <StatCard icon={Database} label="Total Parts" value={s.totalParts} color="hover:border-blue-500/30" />
        <StatCard icon={FileText} label="Total RFQs" value={s.totalRFQs} color="hover:border-purple-500/30" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={s.totalOrders} color="hover:border-orange-500/30" />
        <StatCard icon={Cloud} label="Total Backups" value={s.totalBackups} color="hover:border-cyan-500/30" />
        <StatCard icon={ShieldCheck} label="Vault Secrets" value={s.totalVault} color="hover:border-rose-500/30" />
      </div>
    </div>
  );
}
