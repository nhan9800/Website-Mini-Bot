import { NextRequest } from 'next/server';
import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

/** Proxy: GET /api/license/check?guildId=... → GET {bot}/api/license/check?guildId=... */
export async function GET(req: NextRequest) {
  const guildId = req.nextUrl.searchParams.get('guildId')?.trim();
  if (!guildId) {
    return Response.json({ ok: false, error: 'Thiếu Server ID (guildId).' }, { status: 400 });
  }
  const result = await callMimiApi<{ ok: boolean; license?: any; error?: string }>(
    `/api/license/check?guildId=${encodeURIComponent(guildId)}`
  );
  return toRouteResponse(result);
}
