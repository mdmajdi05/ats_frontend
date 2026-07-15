'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitBranch, GitCommitHorizontal, GitPullRequest, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface GitFile {
  status: string;
  file: string;
}

interface GitCommit {
  hash: string;
  message: string;
}

export default function GitPage() {
  const [branch, setBranch] = useState('');
  const [files, setFiles] = useState<GitFile[]>([]);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [committing, setCommitting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [branchRes, statusRes, logRes] = await Promise.all([
        request<{ data: { branch: string } }>('/dev/git/branch'),
        request<{ data: GitFile[] }>('/dev/git/status'),
        request<{ data: GitCommit[] }>('/dev/git/log'),
      ]);
      setBranch(branchRes.data?.branch || '');
      setFiles(statusRes.data || []);
      setCommits(logRes.data || []);
    } catch {
      toast.error('Failed to load git data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handlePull = async () => {
    setPulling(true);
    try {
      const res = await request<{ data: string }>('/dev/git/pull', { method: 'POST' });
      toast.success('Pull complete');
      fetchAll();
    } catch {
      toast.error('Pull failed');
    } finally {
      setPulling(false);
    }
  };

  const handlePush = async () => {
    setPushing(true);
    try {
      await request<{ data: string }>('/dev/git/push', { method: 'POST' });
      toast.success('Push complete');
      fetchAll();
    } catch {
      toast.error('Push failed');
    } finally {
      setPushing(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMsg.trim()) { toast.error('Commit message required'); return; }
    setCommitting(true);
    try {
      await request<{ data: string }>('/dev/git/commit', {
        method: 'POST',
        body: JSON.stringify({ message: commitMsg }),
      });
      toast.success('Commit successful');
      setCommitMsg('');
      fetchAll();
    } catch {
      toast.error('Commit failed');
    } finally {
      setCommitting(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === 'M') return 'text-yellow-400';
    if (s === 'A') return 'text-green-400';
    if (s === 'D') return 'text-red-400';
    if (s === '??') return 'text-blue-400';
    if (s === 'R') return 'text-purple-400';
    return 'text-white/60';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            Git Control
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Manage repository — commit, pull, push, and view status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              Current Branch: <span className="text-emerald-400 font-mono">{branch || '—'}</span>
            </h2>

            <div className="flex gap-3 mb-4">
              <button onClick={handlePull} disabled={pulling} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <ArrowDown className="w-4 h-4" /> {pulling ? 'Pulling...' : 'Pull'}
              </button>
              <button onClick={handlePush} disabled={pushing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <ArrowUp className="w-4 h-4" /> {pushing ? 'Pushing...' : 'Push'}
              </button>
            </div>

            <div className="flex gap-3">
              <input
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="Commit message"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
              />
              <button onClick={handleCommit} disabled={committing || !commitMsg.trim()} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <GitCommitHorizontal className="w-4 h-4" /> {committing ? 'Committing...' : 'Commit'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              Changed Files ({files.length})
            </h2>
            {loading ? (
              <div className="text-white/40 text-sm">Loading...</div>
            ) : files.length === 0 ? (
              <div className="text-white/40 text-sm">No changes — working tree clean</div>
            ) : (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/5">
                    <span className={`font-mono text-xs font-bold w-8 ${statusColor(f.status)}`}>{f.status}</span>
                    <span className="text-sm text-white/80 font-mono truncate">{f.file}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <GitCommitHorizontal className="w-4 h-4 text-emerald-400" />
            Recent Commits
          </h2>
          {loading ? (
            <div className="text-white/40 text-sm">Loading...</div>
          ) : commits.length === 0 ? (
            <div className="text-white/40 text-sm">No commits found</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {commits.map((c, i) => (
                <div key={i} className="px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400">{c.hash}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5 truncate">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
