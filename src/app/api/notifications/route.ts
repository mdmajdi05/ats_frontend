import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIF_DIR = path.join(process.cwd(), 'notifications-data');
const SETTINGS_FILE = path.join(NOTIF_DIR, '_settings.json');

interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  forUserId?: string;
  forRole?: string;
  fromUserId?: string;
  fromName?: string;
  relatedType?: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

async function ensureDir() {
  try { await fs.mkdir(NOTIF_DIR, { recursive: true }); } catch { /* ok */ }
}

async function readNotif(id: string): Promise<AppNotification | null> {
  try {
    const content = await fs.readFile(path.join(NOTIF_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(content);
  } catch { return null; }
}

async function writeNotif(n: AppNotification): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(NOTIF_DIR, `${n.id}.json`), JSON.stringify(n, null, 2), 'utf-8');
}

async function deleteNotif(id: string): Promise<void> {
  try { await fs.unlink(path.join(NOTIF_DIR, `${id}.json`)); } catch { /* ok */ }
}

function matchesFilter(n: AppNotification, params: URLSearchParams): boolean {
  if (params.get('forUserId') && n.forUserId !== params.get('forUserId')) return false;
  if (params.get('forRole') && n.forRole !== params.get('forRole')) return false;
  if (params.get('isRead') !== null) {
    const wantRead = params.get('isRead') === 'true';
    if (n.isRead !== wantRead) return false;
  }
  if (params.get('type') && n.type !== params.get('type')) return false;
  return true;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  await ensureDir();
  let files: string[];
  try { files = (await fs.readdir(NOTIF_DIR)).filter((f) => f.endsWith('.json') && !f.startsWith('_')); }
  catch { files = []; }

  const all: AppNotification[] = [];
  for (const f of files) {
    const n = await readNotif(f.replace('.json', ''));
    if (n && matchesFilter(n, searchParams)) all.push(n);
  }

  all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const paginated = all.slice(offset, offset + limit);

  return NextResponse.json({ success: true, data: paginated, total: all.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const notif: AppNotification = {
    id: generateId(),
    type: body.type || 'rfq_submitted',
    title: body.title || '',
    message: body.message || '',
    forUserId: body.forUserId || undefined,
    forRole: body.forRole || undefined,
    fromUserId: body.fromUserId || undefined,
    fromName: body.fromName || undefined,
    relatedType: body.relatedType || undefined,
    relatedId: body.relatedId || undefined,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  await writeNotif(notif);
  return NextResponse.json({ success: true, id: notif.id });
}
