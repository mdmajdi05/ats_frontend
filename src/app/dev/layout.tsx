'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Database, ArrowRightLeft, Shield,
  Settings, HardDrive, Cloud, ScrollText,
  ChevronRight, LogOut, Bell, Cpu, Key, UserCog, ShieldCheck,
  Users, GripHorizontal, BarChart3, Terminal, Activity,
  Globe, Lock, Cog, Clock, FileArchive, GitBranch, Building2,
  Server,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PendingBadge from '@/components/admin/PendingBadge';
import NotificationBadge from '@/components/notifications/NotificationBadge';
import { DataSourceProvider } from '@/lib/data-source';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const DEV_NAV = [
  { href: '/dev',                  icon: LayoutDashboard, label: 'Dev Dashboard',     exact: true },
  { href: '/dev/data-source',      icon: Server,          label: 'Data Source'      },
  { href: '/dev/stats',            icon: BarChart3,       label: 'System Stats'     },
  { href: '/dev/users',            icon: Users,           label: 'All Users'        },
  { href: '/dev/features',         icon: GripHorizontal,  label: 'Feature Control'  },
  { href: '/dev/databases',        icon: Database,        label: 'DB Connections'   },
  { href: '/dev/migrations',       icon: ArrowRightLeft,  label: 'Data Migration'   },
  { href: '/dev/permissions',      icon: Shield,          label: 'DB Permissions'   },
  { href: '/dev/vault',            icon: ShieldCheck,     label: 'Password Manager'  },
  { href: '/dev/auth-settings',    icon: UserCog,         label: 'Auth Settings'    },
  { href: '/dev/config',           icon: Settings,        label: 'System Config'    },
  { href: '/dev/config-providers', icon: Globe,           label: 'Service Providers'},
  { href: '/dev/storage',          icon: HardDrive,       label: 'Storage Config'   },
  { href: '/dev/backup',           icon: Cloud,           label: 'Backup/Restore'   },
  { href: '/dev/console',          icon: Terminal,        label: 'Dev Console'      },
  { href: '/dev/monitor',          icon: Activity,        label: 'System Monitor'   },
  { href: '/dev/activity',         icon: BarChart3,       label: 'Activity Dashboard'},
  { href: '/dev/logs',             icon: ScrollText,      label: 'Live Logs'        },
  { href: '/dev/analytics',        icon: BarChart3,       label: 'Analytics'        },
  { href: '/dev/security',         icon: Lock,            label: 'Security'         },
  { href: '/admin/notifications',          icon: Bell,            label: 'Notifications'    },
  { href: '/dev/recovery',         icon: FileArchive,     label: 'Recovery Bin'     },
  { href: '/dev/scheduled-tasks',  icon: Clock,           label: 'Scheduled Tasks'  },
  { href: '/dev/audit',            icon: ScrollText,      label: 'Dev Audit Log'    },
  { href: '/dev/git',              icon: GitBranch,       label: 'Git Control'      },
  { href: '/dev/terminal',         icon: Terminal,        label: 'Web Terminal'      },
  { href: '/dev/tenants',          icon: Building2,       label: 'Multi-Tenant'      },
  { href: '/admin/pending-submissions', icon: Database, label: 'Pending Queue' },
];

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isDev, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isDev())) {
      router.replace('/unauthorized');
    }
  }, [user, loading, isDev, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
      </div>
    );
  }

  if (!isDev()) return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/');
  };

  const currentLabel = DEV_NAV.find(
    (n) => n.exact ? pathname === n.href : pathname.startsWith(n.href)
  )?.label || 'Dev';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <aside className="w-64 bg-[#111111] text-white flex flex-col fixed top-0 left-0 h-full z-30 border-r border-emerald-900/30">
        <div className="px-5 py-4 border-b border-emerald-900/30">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-sm font-bold leading-tight">Dev Console</div>
              <div className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Developer Mode</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-emerald-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold">
              {user.fullName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user.fullName}</div>
              <div className="text-[10px] text-emerald-500/60">Developer</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {DEV_NAV.map(({ href, icon: Icon, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {href === '/admin/pending-submissions' && <PendingBadge />}
                {href === '/admin/notifications' && <NotificationBadge />}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-emerald-900/30 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 min-h-screen">
        <div className="sticky top-0 z-20 bg-[#111111] border-b border-emerald-900/30 px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-200">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-emerald-500/60 hover:text-emerald-400 transition-colors">
              ← Back to Site
            </Link>
          </div>
        </div>
        <main className="p-8 bg-[#0A0A0A] min-h-screen">
          <DataSourceProvider>
            {children}
          </DataSourceProvider>
        </main>
      </div>
    </div>
  );
}
