import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PENDING_DIR = path.join(process.cwd(), 'pending-data');

async function readSubmission(id: string) {
  try {
    const content = await fs.readFile(path.join(PENDING_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(content);
  } catch { return null; }
}

async function writeSubmission(id: string, data: Record<string, unknown>) {
  await fs.mkdir(PENDING_DIR, { recursive: true });
  await fs.writeFile(path.join(PENDING_DIR, `${id}.json`), JSON.stringify(data, null, 2), 'utf-8');
}

async function deleteSubmission(id: string) {
  try { await fs.unlink(path.join(PENDING_DIR, `${id}.json`)); } catch { /* ok */ }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sub = await readSubmission(id);
  if (!sub) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: sub });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteSubmission(id);
  return NextResponse.json({ success: true, message: 'Deleted' });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const sub = await readSubmission(id);
  if (!sub) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  const updated = { ...sub, ...body, updatedAt: new Date().toISOString() };
  await writeSubmission(id, updated);
  return NextResponse.json({ success: true, message: 'Updated' });
}
