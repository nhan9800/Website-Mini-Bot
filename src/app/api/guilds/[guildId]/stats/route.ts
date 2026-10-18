import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import type { GuildStatsResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

const GUILD_ID_RE = /^\d{15,22}$/;

/** Proxy: GET /api/guilds/:id/stats → GET /internal/guilds/:id/stats */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const { guildId } = await params;
  if (!GUILD_ID_RE.test(guildId)) {
    return Response.json({ ok: false, error: { code: 'INVALID_GUILD_ID', message: 'Guild ID không hợp lệ.' } }, { status: 400 });
  }
  const accessKey = (request.headers.get('x-mimi-key') || '').trim();
  if (!accessKey) {
    return Response.json({ ok: false, error: { code: 'DASHBOARD_KEY_REQUIRED', message: 'Thiếu khoá truy cập. Gõ /dashboard trong server Discord để lấy link có khoá.' } }, { status: 403 });
  }
  const result = await callMimiApi<GuildStatsResponse>(`/internal/guilds/${guildId}/stats`, { accessKey });
  return toRouteResponse(result);
}
