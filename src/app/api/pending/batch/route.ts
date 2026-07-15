import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PENDING_DIR = path.join(process.cwd(), 'pending-data');

interface PendingSubmission {
  id: string;
  type: string;
  data: Record<string, unknown>;
  status: 'pending' | 'pushed' | 'kept';
  createdAt: string;
  updatedAt: string;
  source: string;
}

async function readSubmission(id: string): Promise<PendingSubmission | null> {
  try {
    const content = await fs.readFile(path.join(PENDING_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(content);
  } catch { return null; }
}

async function writeSubmission(id: string, data: PendingSubmission) {
  await fs.mkdir(PENDING_DIR, { recursive: true });
  await fs.writeFile(path.join(PENDING_DIR, `${id}.json`), JSON.stringify(data, null, 2), 'utf-8');
}

async function deleteSubmission(id: string) {
  try { await fs.unlink(path.join(PENDING_DIR, `${id}.json`)); } catch { /* ok */ }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ids } = body as { action: string; ids: string[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: false, message: 'No IDs provided' }, { status: 400 });
  }

  const results: { id: string; status: string }[] = [];

  for (const id of ids) {
    try {
      const sub = await readSubmission(id);
      if (!sub) {
        results.push({ id, status: 'not_found' });
        continue;
      }

      switch (action) {
        case 'push-to-db': {
          await writeSubmission(id, { ...sub, status: 'pushed', updatedAt: new Date().toISOString() });
          results.push({ id, status: 'pushed' });
          break;
        }
        case 'move-to-db': {
          await deleteSubmission(id);
          results.push({ id, status: 'moved_to_db' });
          break;
        }
        case 'keep': {
          await writeSubmission(id, { ...sub, status: 'kept', updatedAt: new Date().toISOString() });
          results.push({ id, status: 'kept' });
          break;
        }
        case 'delete': {
          await deleteSubmission(id);
          results.push({ id, status: 'deleted' });
          break;
        }
        default:
          results.push({ id, status: 'unknown_action' });
      }
    } catch {
      results.push({ id, status: 'error' });
    }
  }

  return NextResponse.json({ success: true, results });
}
