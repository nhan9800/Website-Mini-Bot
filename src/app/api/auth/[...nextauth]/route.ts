import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const handler = NextAuth(authOptions);

function configured(): boolean {
  return Boolean(process.env.NEXTAUTH_SECRET?.trim() && process.env.DISCORD_CLIENT_ID?.trim() && process.env.DISCORD_CLIENT_SECRET?.trim());
}

export async function GET(request: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!configured()) return Response.json({ ok: false, error: 'Đăng nhập Discord chưa được cấu hình trên máy chủ.' }, { status: 503 });
  return handler(request, context);
}

export async function POST(request: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!configured()) return Response.json({ ok: false, error: 'Đăng nhập Discord chưa được cấu hình trên máy chủ.' }, { status: 503 });
  return handler(request, context);
}
