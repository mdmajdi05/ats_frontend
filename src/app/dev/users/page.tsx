'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Shield, UserX, UserCheck, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

const ROLES = ['Dev', 'SuperAdmin', 'Admin', 'SEOManager', 'ContentManager', 'Trader', 'User'];

interface UserData {
  id: string;
  email: string;
  fullName: string;
  company: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ role: '', isActive: true });

  const limit = 20;

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const res = await request<{ data: UserData[]; pagination: { total: number } }>(`/dev/users?${params}`);
      setUsers(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = () => { setPage(1); fetchUsers(); };

  const handleUpdate = async (id: string) => {
    try {
      await request(`/dev/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      toast.success('User updated');
      setEditId(null);
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await request(`/dev/users/${id}`, { method: 'DELETE' });
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            All Users
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Manage every user including SuperAdmin. Total: {total}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Users className="w-6 h-6 text-emerald-400 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
              {editId === u.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-sm text-white/60">
                      <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} className="rounded" />
                      Active
                    </label>
                    <button onClick={() => handleUpdate(u.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-colors">Save</button>
                    <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      u.role === 'Dev' ? 'bg-emerald-700' : u.role === 'SuperAdmin' ? 'bg-red-700' : u.role === 'Admin' ? 'bg-blue-700' : 'bg-gray-700'
                    }`}>
                      {u.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{u.fullName}</p>
                      <p className="text-xs text-white/40 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      u.role === 'Dev' ? 'bg-emerald-900/50 text-emerald-300' :
                      u.role === 'SuperAdmin' ? 'bg-red-900/50 text-red-300' :
                      u.role === 'Admin' ? 'bg-blue-900/50 text-blue-300' :
                      'bg-gray-800 text-gray-400'
                    }`}>{u.role}</span>
                    <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                    <button onClick={() => { setEditId(u.id); setEditForm({ role: u.role, isActive: u.isActive }); }} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/60">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
