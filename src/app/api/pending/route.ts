import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PENDING_DIR = path.join(process.cwd(), 'pending-data');

interface PendingSubmission {
  id: string;
  type: 'rfq' | 'contact' | 'registration' | 'inventory';
  data: Record<string, unknown>;
  status: 'pending' | 'pushed' | 'kept';
  createdAt: string;
  updatedAt: string;
  source: string;
}

function generateId(): string {
  return `pend_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

async function ensureDir() {
  try { await fs.mkdir(PENDING_DIR, { recursive: true }); } catch { /* ok */ }
}

async function getAllFiles(): Promise<string[]> {
  await ensureDir();
  try {
    const entries = await fs.readdir(PENDING_DIR);
    return entries.filter((f) => f.endsWith('.json')).sort();
  } catch { return []; }
}

async function readSubmission(id: string): Promise<PendingSubmission | null> {
  try {
    const content = await fs.readFile(path.join(PENDING_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(content);
  } catch { return null; }
}

async function writeSubmission(sub: PendingSubmission): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(PENDING_DIR, `${sub.id}.json`), JSON.stringify(sub, null, 2), 'utf-8');
}

async function deleteSubmission(id: string): Promise<void> {
  try {
    await fs.unlink(path.join(PENDING_DIR, `${id}.json`));
  } catch { /* ok */ }
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return true;
  const roleCookie = request.cookies.get('ats_role');
  return !!roleCookie?.value;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const files = await getAllFiles();
  const subs: PendingSubmission[] = [];
  for (const f of files) {
    const id = f.replace('.json', '');
    const sub = await readSubmission(id);
    if (sub && (!type || sub.type === type) && sub.status === 'pending') {
      subs.push(sub);
    }
  }
  subs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ success: true, data: subs, count: subs.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sub: PendingSubmission = {
    id: generateId(),
    type: body.type || 'rfq',
    data: body.data || {},
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: body.source || 'frontend',
  };
  await writeSubmission(sub);
  return NextResponse.json({ success: true, id: sub.id, message: 'Saved to pending queue' });
}
