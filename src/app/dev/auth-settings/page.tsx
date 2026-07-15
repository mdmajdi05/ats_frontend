'use client';

import { useState, useEffect } from 'react';
import { UserCog, Shield, AlertTriangle } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

const PROVIDERS = [
  { value: 'custom', label: 'Custom JWT', desc: 'Default — users login via bcrypt + JWT' },
  { value: 'supabase', label: 'Supabase Auth', desc: 'Supabase handles Dev login + password management' },
];

export default function AuthSettingsPage() {
  const [provider, setProvider] = useState('custom');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ data: { authProvider: string } }>('/dev/auth-settings')
      .then((res) => setProvider(res.data?.authProvider || 'custom'))
      .catch(() => toast.error('Failed to load auth settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (val: string) => {
    try {
      await request('/dev/auth-settings', {
        method: 'PUT',
        body: JSON.stringify({ authProvider: val }),
      });
      setProvider(val);
      toast.success('Auth provider updated');
    } catch {
      toast.error('Failed to update auth provider');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <UserCog className="w-6 h-6 text-emerald-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCog className="w-5 h-5 text-emerald-400" />
          Auth Settings
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Choose which authentication provider handles user login.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-300">Affects all users</p>
          <p className="text-xs text-amber-200/60 mt-1">
            Changing the auth provider will affect how all users log in. Make sure the new provider is properly configured before switching.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {PROVIDERS.map((p) => {
          const active = provider === p.value;
          return (
            <button
              key={p.value}
              onClick={() => handleSave(p.value)}
              className={`w-full text-left rounded-2xl border p-5 transition-all ${
                active
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-white/40'}`} />
                    <span className={`text-sm font-semibold ${active ? 'text-emerald-300' : 'text-white'}`}>
                      {p.label}
                    </span>
                    {active && (
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1">{p.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${active ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'}`}>
                  {active && <div className="w-2.5 h-2.5 bg-white rounded-full m-auto mt-0.5" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
