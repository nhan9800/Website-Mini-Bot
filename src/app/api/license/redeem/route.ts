import { NextRequest } from 'next/server';
import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

/** Proxy: POST /api/license/redeem → POST {bot}/api/license/redeem */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guildId, key } = body || {};
    if (!guildId || !key) {
      return Response.json({ ok: false, error: 'Thiếu Server ID hoặc mã Key.' }, { status: 400 });
    }
    const result = await callMimiApi<{
      ok: boolean;
      planName?: string;
      daysAdded?: number;
      license?: any;
      error?: string;
    }>('/api/license/redeem', {
      method: 'POST',
      body: JSON.stringify({ guildId, key }),
      headers: { 'Content-Type': 'application/json' },
    });
    return toRouteResponse(result);
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message || 'Lỗi xử lý yêu cầu.' }, { status: 500 });
  }
}
