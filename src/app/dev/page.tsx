'use client';

import { Cpu, Users, Database, Cloud, Settings, HardDrive, ShieldCheck, GripHorizontal, ScrollText, BarChart3, ArrowRightLeft, UserCog } from 'lucide-react';
import Link from 'next/link';

const QUICK_LINKS = [
  { href: '/dev/stats',        icon: BarChart3,      label: 'System Stats',      desc: 'Platform-wide statistics',              color: 'hover:border-emerald-500/30' },
  { href: '/dev/users',        icon: Users,          label: 'All Users',         desc: 'Manage every user (incl. SuperAdmin)',  color: 'hover:border-rose-500/30' },
  { href: '/dev/features',     icon: GripHorizontal, label: 'Feature Control',   desc: 'Enable/disable features per role',      color: 'hover:border-purple-500/30' },
  { href: '/dev/databases',    icon: Database,       label: 'DB Connections',    desc: 'Manage database connections',           color: 'hover:border-blue-500/30' },
  { href: '/dev/migrations',   icon: ArrowRightLeft, label: 'Data Migration',    desc: 'Migrate & merge between databases',     color: 'hover:border-cyan-500/30' },
  { href: '/dev/vault',        icon: ShieldCheck,    label: 'Password Manager',  desc: 'Store API keys & credentials',          color: 'hover:border-emerald-500/30' },
  { href: '/dev/auth-settings',icon: UserCog,        label: 'Auth Settings',     desc: 'Toggle auth provider',                  color: 'hover:border-orange-500/30' },
  { href: '/dev/config',       icon: Settings,       label: 'System Config',     desc: 'View & update configuration',           color: 'hover:border-purple-500/30' },
  { href: '/dev/storage',      icon: HardDrive,      label: 'Storage Config',    desc: 'File storage routing',                  color: 'hover:border-orange-500/30' },
  { href: '/dev/backup',       icon: Cloud,          label: 'Backup / Restore',  desc: 'Database backup management',             color: 'hover:border-blue-500/30' },
  { href: '/dev/audit',        icon: ScrollText,     label: 'Dev Audit Log',     desc: 'Track all Dev actions',                 color: 'hover:border-slate-500/30' },
];

export default function DevDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          Developer Console
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Full control over everything — users, features, databases, config, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href} className={`rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all ${color}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-white/50 mt-1">{desc}</p>
              </div>
              <Icon className="w-8 h-8 text-white/20 flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
