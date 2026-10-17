import { NextRequest } from 'next/server';
import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import { timingSafeEqual } from 'node:crypto';

export const dynamic = 'force-dynamic';

/** Proxy: POST /api/license/admin/confirm → POST {bot}/api/license/admin/confirm */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ ok: false, error: 'Body phải là một object JSON.' }, { status: 400 });
    }
    const { guildId, plan, secret, action, note } = body || {};
    const configuredSecret = process.env.ADMIN_SECRET?.trim();
    if (!configuredSecret) {
      return Response.json({ ok: false, error: 'Chức năng Admin chưa được cấu hình trên máy chủ web.' }, { status: 503 });
    }
    const supplied = Buffer.from(typeof secret === 'string' ? secret : '');
    const expected = Buffer.from(configuredSecret);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return Response.json({ ok: false, error: 'Mã xác thực Admin không chính xác.' }, { status: 401 });
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
      body: { guildId, plan, action, note },
    });

    return toRouteResponse(result);
  } catch {
    return Response.json({ ok: false, error: 'Không xử lý được yêu cầu Admin.' }, { status: 400 });
  }
}
