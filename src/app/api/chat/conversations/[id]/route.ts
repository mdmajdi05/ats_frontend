import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CHAT_DIR = path.join(process.cwd(), 'chat-data');
const MSG_DIR = path.join(CHAT_DIR, 'messages');

async function ensureDirs() {
  try { await fs.mkdir(MSG_DIR, { recursive: true }); } catch { /* ok */ }
}

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  type: string;
  text: string;
  createdAt: string;
}

async function readConversation(id: string): Promise<Record<string, unknown> | null> {
  try {
    const content = await fs.readFile(path.join(CHAT_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(content);
  } catch { return null; }
}

async function readMessages(conversationId: string): Promise<Message[]> {
  await ensureDirs();
  const msgs: Message[] = [];
  try {
    const files = await fs.readdir(MSG_DIR);
    for (const f of files) {
      if (!f.startsWith(`${conversationId}_`) || !f.endsWith('.json')) continue;
      const content = await fs.readFile(path.join(MSG_DIR, f), 'utf-8');
      msgs.push(JSON.parse(content));
    }
  } catch { /* empty */ }
  return msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conversation = await readConversation(id);
  const messages = await readMessages(id);

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  return NextResponse.json({ conversation, messages });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const conv = await readConversation(id);
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    const updated = { ...conv, ...body, updatedAt: new Date().toISOString() };
    await fs.writeFile(path.join(CHAT_DIR, `${id}.json`), JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}
