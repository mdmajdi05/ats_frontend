import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, company, message, partNumber, quantity, source } = body;

    const lead = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: type || 'quote',
      name: name || '',
      email: email || '',
      phone: phone || '',
      company: company || '',
      message: message || '',
      partNumber: partNumber || '',
      quantity: quantity || '',
      source: source || 'website',
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
      userAgent: req.headers.get('user-agent') || '',
    };

    const dir = join(process.cwd(), 'leads');
    const filePath = join(dir, `${lead.id}.json`);

    try { await mkdir(dir, { recursive: true }) } catch {}

    await writeFile(filePath, JSON.stringify(lead, null, 2));

    console.log('NEW LEAD:', JSON.stringify(lead, null, 2));

    return NextResponse.json({ success: true, id: lead.id, message: 'Lead captured successfully' });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ success: false, message: 'Failed to capture lead' }, { status: 500 });
  }
}
