import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIF_DIR = path.join(process.cwd(), 'notifications-data');

export async function POST() {
  try {
    const files = (await fs.readdir(NOTIF_DIR)).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
    for (const f of files) {
      try {
        const fp = path.join(NOTIF_DIR, f);
        const content = await fs.readFile(fp, 'utf-8');
        const data = JSON.parse(content);
        if (!data.isRead) {
          data.isRead = true;
          await fs.writeFile(fp, JSON.stringify(data, null, 2), 'utf-8');
        }
      } catch { /* skip */ }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
