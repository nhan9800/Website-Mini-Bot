import { NextRequest } from 'next/server';
import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

/** Proxy: POST /api/license/admin/confirm → POST {bot}/api/license/admin/confirm */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guildId, plan, secret, action, note } = body || {};

    if (!secret) {
      return Response.json({ ok: false, error: 'Thiếu mã xác thực bảo mật Admin.' }, { status: 400 });
    }

    const result = await callMimiApi<{
      ok: boolean;
      license?: any;
      key?: string;
      planName?: string;
      durationDays?: number;
      message?: string;
      error?: string;
    }>('/api/license/admin/confirm', {
      method: 'POST',
      body: { guildId, plan, secret, action, note },
    });

    return toRouteResponse(result);
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message || 'Lỗi xử lý yêu cầu Admin.' }, { status: 500 });
  }
}
