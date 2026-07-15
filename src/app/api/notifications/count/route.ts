import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIF_DIR = path.join(process.cwd(), 'notifications-data');

interface AppNotification { id: string; isRead: boolean; forRole?: string; forUserId?: string; }

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return true;
  const roleCookie = request.cookies.get('ats_role');
  return !!roleCookie?.value;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: true, count: 0 });
  }
  const { searchParams } = new URL(request.url);
  try {
    const files = (await fs.readdir(NOTIF_DIR)).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
    let count = 0;
    const forRole = searchParams.get('forRole');
    const forUserId = searchParams.get('forUserId');

    for (const f of files) {
      try {
        const content = await fs.readFile(path.join(NOTIF_DIR, f), 'utf-8');
        const n: AppNotification = JSON.parse(content);
        if (n.isRead) continue;
        if (forRole && n.forRole !== forRole) continue;
        if (forUserId && n.forUserId !== forUserId) continue;
        count++;
      } catch { /* skip corrupted */ }
    }
    return NextResponse.json({ success: true, count });
  } catch {
    return NextResponse.json({ success: true, count: 0 });
  }
}
