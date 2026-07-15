import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CHAT_DIR = path.join(process.cwd(), 'chat-data');

async function ensureDir() {
  try { await fs.mkdir(CHAT_DIR, { recursive: true }); } catch { /* ok */ }
}

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  source: string;
  status: string;
  isUnread: boolean;
  pageUrl: string;
  pageTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

async function readAll(): Promise<Conversation[]> {
  await ensureDir();
  const items: Conversation[] = [];
  try {
    const files = await fs.readdir(CHAT_DIR);
    for (const f of files) {
      if (!f.startsWith('conv_') || !f.endsWith('.json')) continue;
      const content = await fs.readFile(path.join(CHAT_DIR, f), 'utf-8');
      items.push(JSON.parse(content));
    }
  } catch { /* empty */ }
  return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

async function writeOne(conv: Conversation): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(CHAT_DIR, `${conv.id}.json`), JSON.stringify(conv, null, 2), 'utf-8');
}

export async function GET() {
  const conversations = await readAll();
  return NextResponse.json({
    conversations,
    total: conversations.length,
    unreadCount: conversations.filter((c) => c.isUnread).length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conv: Conversation = {
      id: `conv_${Date.now()}`,
      visitorName: body.visitorName || 'Anonymous',
      visitorEmail: body.visitorEmail || '',
      source: body.source || 'website',
      status: 'active',
      isUnread: true,
      pageUrl: body.pageUrl || '',
      pageTitle: body.pageTitle || '',
      lastMessage: body.lastMessage || '',
      lastMessageAt: new Date().toISOString(),
      messageCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await writeOne(conv);
    return NextResponse.json({ conversation: conv }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
