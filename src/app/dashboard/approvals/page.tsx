'use client';

import { useState, useEffect, useCallback } from 'react';
import { request } from '@/lib/api-client';
import { CheckCircle, XCircle, Clock, History, Send, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Approval {
  id: string;
  resourceType: string;
  resourceId: string;
  resourceTitle?: string;
  requestedBy: string;
  requestedByEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerRole?: string;
  reviewedBy?: string;
  reviewNote?: string;
  changeData: Record<string, unknown>;
  createdAt: string;
  reviewedAt?: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

export default function ApprovalsPage() {
  const [tab, setTab] = useState<'pending' | 'submissions'>('pending');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [historyModal, setHistoryModal] = useState<Approval[] | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'pending' ? '/approval/pending' : '/approval/my-submissions';
      const res = await request<{ success: boolean; data: Approval[] }>(endpoint);
      setApprovals(res.data ?? []);
    } catch {
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleApprove(id: string) {
    setActionLoading(true);
    try {
      await request('/approval/' + id + '/approve', { method: 'POST', body: JSON.stringify({}) });
      toast.success('Approved successfully');
      fetchData();
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await request('/approval/' + rejectModal.id + '/reject', { method: 'POST', body: JSON.stringify({ reason: rejectReason }) });
      toast.success('Rejected');
      setRejectModal({ open: false, id: '' });
      setRejectReason('');
      fetchData();
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  }

  async function showHistory(item: Approval) {
    try {
      const res = await request<{ success: boolean; data: Approval[] }>(`/approval/history/${item.resourceType}/${item.resourceId}`);
      setHistoryModal(res.data ?? []);
    } catch {
      toast.error('Failed to load history');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Send className="w-6 h-6 text-orange-400" />
          Approvals
        </h1>

        <div className="flex gap-2 border-b border-gray-700 pb-2">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Pending Approvals
          </button>
          <button
            onClick={() => setTab('submissions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'submissions' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <History className="w-4 h-4 inline mr-1" />
            My Submissions
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : approvals.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No {tab === 'pending' ? 'pending' : 'submitted'} approvals</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">Resource</th>
                    <th className="text-left px-4 py-3">Requested By</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {approvals.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.resourceTitle || item.resourceId}</div>
                        <div className="text-xs text-gray-400">{item.resourceType}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{item.requestedBy}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[item.status] || ''}`}>
                          {item.status === 'pending' && <Clock className="w-3 h-3" />}
                          {item.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => showHistory(item)}
                            className="p-1.5 rounded-lg hover:bg-gray-600 transition-colors text-gray-400 hover:text-white"
                            title="View history"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {item.status === 'pending' && tab === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                disabled={actionLoading}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectModal({ open: true, id: item.id })}
                                disabled={actionLoading}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3 h-3 inline mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Reject Approval</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setRejectModal({ open: false, id: '' })}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {historyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Approval History</h2>
              <button onClick={() => setHistoryModal(null)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            {historyModal.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No history found</p>
            ) : (
              <div className="space-y-3">
                {historyModal.map((h) => (
                  <div key={h.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[h.status] || ''}`}>
                        {h.status}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-300"><span className="text-gray-400">By:</span> {h.requestedBy}</p>
                    {h.reviewedBy && <p className="text-sm text-gray-300"><span className="text-gray-400">Reviewed by:</span> {h.reviewedBy}</p>}
                    {h.reviewNote && <p className="text-sm text-gray-300 mt-1"><span className="text-gray-400">Note:</span> {h.reviewNote}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
