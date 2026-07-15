import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WA_DIR = path.join(process.cwd(), 'pending-data');

async function ensureDir() {
  try { await fs.mkdir(WA_DIR, { recursive: true }); } catch { /* ok */ }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'aeroturbine_verify_2025';

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Verification failed', { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (value?.messages) {
      await ensureDir();
      for (const msg of value.messages) {
        const from = msg.from;
        const text = msg.text?.body || '';
        const msgId = msg.id;

        const record = {
          id: msgId,
          from,
          text,
          timestamp: new Date().toISOString(),
          raw: msg,
          status: 'received',
        };

        await fs.writeFile(
          path.join(WA_DIR, `wa_${msgId}.json`),
          JSON.stringify(record, null, 2),
          'utf-8'
        );

        // Auto-reply
        const replyText = `Thanks for your message! We'll review your query about "${text.slice(0, 50)}" and get back to you shortly.`;

        await fs.writeFile(
          path.join(WA_DIR, `wa_reply_${msgId}.json`),
          JSON.stringify({
            id: `reply_${msgId}`,
            to: from,
            text: replyText,
            timestamp: new Date().toISOString(),
            status: 'pending_send',
          }, null, 2),
          'utf-8'
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
