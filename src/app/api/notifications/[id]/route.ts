import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIF_DIR = path.join(process.cwd(), 'notifications-data');

async function readNotif(id: string) {
  try {
    const content = await fs.readFile(path.join(NOTIF_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(content);
  } catch { return null; }
}

async function writeNotif(id: string, data: Record<string, unknown>) {
  await fs.mkdir(NOTIF_DIR, { recursive: true });
  await fs.writeFile(path.join(NOTIF_DIR, `${id}.json`), JSON.stringify(data, null, 2), 'utf-8');
}

async function deleteNotif(id: string) {
  try { await fs.unlink(path.join(NOTIF_DIR, `${id}.json`)); } catch { /* ok */ }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const n = await readNotif(id);
  if (!n) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  await writeNotif(id, { ...n, ...body });
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteNotif(id);
  return NextResponse.json({ success: true });
}
