import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'notifications-data', '_settings.json');

const DEFAULT_SETTINGS = [
  { role: 'SuperAdmin', types: ['rfq_submitted','contact_submitted','user_registered','inventory_submitted','rfq_quoted','rfq_accepted','rfq_rejected'], toastEnabled: true, catchUpOnLogin: true },
  { role: 'Admin', types: ['rfq_submitted','contact_submitted','user_registered','inventory_submitted','rfq_quoted','rfq_accepted','rfq_rejected'], toastEnabled: true, catchUpOnLogin: true },
  { role: 'Dev', types: ['rfq_submitted','contact_submitted','user_registered','inventory_submitted','rfq_quoted','rfq_accepted','rfq_rejected'], toastEnabled: true, catchUpOnLogin: true },
  { role: 'User', types: ['rfq_quoted','rfq_accepted','rfq_rejected'], toastEnabled: true, catchUpOnLogin: true },
  { role: 'SEOManager', types: [], toastEnabled: false, catchUpOnLogin: false },
  { role: 'ContentManager', types: [], toastEnabled: false, catchUpOnLogin: false },
  { role: 'Trader', types: ['inventory_submitted'], toastEnabled: true, catchUpOnLogin: false },
];

export async function GET() {
  try {
    const content = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return NextResponse.json({ success: true, data: JSON.parse(content) });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();
    await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
