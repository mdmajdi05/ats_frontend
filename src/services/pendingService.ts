export interface PendingSubmission {
  id: string;
  type: 'rfq' | 'contact' | 'registration' | 'inventory';
  data: Record<string, unknown>;
  status: 'pending' | 'pushed' | 'kept';
  createdAt: string;
  updatedAt: string;
  source: string;
}

export async function getPendingList(type?: string): Promise<{ data: PendingSubmission[]; count: number }> {
  const qs = type ? `?type=${type}` : '';
  const res = await fetch(`/api/pending${qs}`);
  const json = await res.json();
  return { data: json.data || [], count: json.count || 0 };
}

export async function getPendingCount(): Promise<number> {
  try {
    const res = await fetch('/api/pending');
    const json = await res.json();
    return json.count || 0;
  } catch { return 0; }
}

export async function saveToPending(type: string, data: Record<string, unknown>, source = 'frontend'): Promise<string> {
  const res = await fetch('/api/pending', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data, source }),
  });
  const json = await res.json();
  return json.id;
}

export async function batchAction(action: 'push-to-db' | 'move-to-db' | 'keep' | 'delete', ids: string[]): Promise<boolean> {
  const res = await fetch('/api/pending/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ids }),
  });
  return res.ok;
}
