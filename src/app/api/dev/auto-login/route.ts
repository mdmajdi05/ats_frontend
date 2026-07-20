import { NextResponse } from 'next/server';

const DEV_USER = {
  id: 'dev-auto',
  email: 'mdmajdi05@gmail.com',
  fullName: 'Majdi Dev',
  role: 'Dev' as const,
  avatar: null,
  isActive: true,
  createdAt: new Date().toISOString(),
};

export async function GET() {
  const res = NextResponse.json({
    success: true,
    data: {
      user: DEV_USER,
      token: 'dev-auto-token',
    },
  });
  res.cookies.set('ats_role', 'Dev', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
