import { NextRequest, NextResponse } from 'next/server';
import { callMimiApi } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

export interface DiscordUserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  inServer: boolean;
  verified: boolean;
  roles?: string[];
}

/**
 * Proxy: GET /api/user?q=username_or_id -> GET {bot}/internal/user?q=...
 * Kiểm tra tài khoản Discord trong máy chủ để xác thực khi liên kết đánh giá.
 */
export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') || '';
    if (!q.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Vui lòng cung cấp username hoặc ID Discord.' },
        { status: 400 }
      );
    }

    const result = await callMimiApi<{ ok: boolean; user: DiscordUserProfile }>(
      `/internal/user?q=${encodeURIComponent(q.trim())}`
    );

    if (result.ok && result.data?.user) {
      return NextResponse.json({
        ok: true,
        user: result.data.user,
        source: 'discord_bot',
      });
    }
    return NextResponse.json({ ok: false, user: null, error: 'Chưa xác minh được tài khoản từ Discord. Hãy thử lại khi bot kết nối.' }, { status: result.status >= 400 ? result.status : 503 });
  } catch (err) {
    // Bot chưa kết nối: không dựng trạng thái xác minh hoặc vai trò giả.
  }

  return NextResponse.json({ ok: false, user: null, error: 'Chưa kết nối được với bot để xác minh tài khoản.' }, { status: 503 });
}
