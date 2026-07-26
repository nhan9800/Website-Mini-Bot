import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import type { PlayerState } from '@/lib/types';

export const dynamic = 'force-dynamic';

const GUILD_ID_RE = /^\d{15,22}$/;
const ALLOWED_ACTIONS = new Set(['pause', 'resume', 'skip', 'stop', 'volume']);

function badRequest(message: string): Response {
  return new Response(
    JSON.stringify({ ok: false, error: { code: 'BAD_REQUEST', message } }),
    { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}

/** GET /api/guilds/:id/player → GET {bot}/internal/guilds/:id/player */
export async function GET(
  _request: Request,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;
  if (!GUILD_ID_RE.test(guildId)) return badRequest('Guild ID không hợp lệ (phải là dãy 15–22 chữ số).');

  const result = await callMimiApi<{ ok: boolean; player: PlayerState }>(
    `/internal/guilds/${guildId}/player`
  );
  return toRouteResponse(result);
}

/**
 * POST /api/guilds/:id/player  body: { action: 'pause'|'resume'|'skip'|'stop'|'volume', volume? }
 * → POST {bot}/internal/guilds/:id/player/:action
 */
export async function POST(
  request: Request,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;
  if (!GUILD_ID_RE.test(guildId)) return badRequest('Guild ID không hợp lệ (phải là dãy 15–22 chữ số).');

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return badRequest('Body phải là JSON.');
  }

  const action = String(body?.action || '');
  if (!ALLOWED_ACTIONS.has(action)) {
    return badRequest(`Hành động không hỗ trợ: "${action}". Cho phép: pause, resume, skip, stop, volume.`);
  }

  const result = await callMimiApi<{ ok: boolean; player: PlayerState }>(
    `/internal/guilds/${guildId}/player/${action}`,
    {
      method: 'POST',
      body: action === 'volume' ? { volume: Number(body?.volume) } : undefined,
    }
  );
  return toRouteResponse(result);
}
