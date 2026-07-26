import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import type { GuildSettingsResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

const GUILD_ID_RE = /^\d{15,22}$/;
// Khớp allowlist editableSettingKeys của bot (internalApi.js)
const EDITABLE_KEYS = ['prefix', 'unverifyOnMute', 'verifyDailyMode'] as const;

function badRequest(message: string): Response {
  return new Response(
    JSON.stringify({ ok: false, error: { code: 'BAD_REQUEST', message } }),
    { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}

function missingKey(): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      error: {
        code: 'DASHBOARD_KEY_REQUIRED',
        message: 'Thiếu khoá truy cập. Gõ /dashboard trong server Discord để lấy link có khoá.',
      },
    }),
    { status: 403, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}

/** Khoá do bot ký, trình duyệt gửi lên qua header — web chỉ chuyển tiếp. */
function readAccessKey(request: Request): string {
  return (request.headers.get('x-mimi-key') || '').trim();
}

/** GET /api/guilds/:id/settings → GET {bot}/internal/guilds/:id/settings */
export async function GET(
  request: Request,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;
  if (!GUILD_ID_RE.test(guildId)) return badRequest('Guild ID không hợp lệ (phải là dãy 15–22 chữ số).');

  const accessKey = readAccessKey(request);
  if (!accessKey) return missingKey();

  const result = await callMimiApi<GuildSettingsResponse>(
    `/internal/guilds/${guildId}/settings`,
    { accessKey }
  );
  return toRouteResponse(result);
}

/**
 * PATCH /api/guilds/:id/settings → PATCH {bot}/internal/guilds/:id/settings
 * Bot chỉ nhận PATCH (không phải POST) và chỉ cho sửa các key trong allowlist.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;
  if (!GUILD_ID_RE.test(guildId)) return badRequest('Guild ID không hợp lệ (phải là dãy 15–22 chữ số).');

  const accessKey = readAccessKey(request);
  if (!accessKey) return missingKey();

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return badRequest('Body phải là JSON.');
  }

  // Lọc trước ở web để báo lỗi sớm, thay vì đẩy rác sang bot
  const patch: Record<string, unknown> = {};
  for (const key of EDITABLE_KEYS) {
    if (key in body) patch[key] = body[key];
  }
  if (Object.keys(patch).length === 0) {
    return badRequest(`Không có trường hợp lệ nào để cập nhật. Cho phép: ${EDITABLE_KEYS.join(', ')}.`);
  }

  const result = await callMimiApi<{ ok: boolean; applied: Record<string, unknown> }>(
    `/internal/guilds/${guildId}/settings`,
    { method: 'PATCH', accessKey, body: patch }
  );
  return toRouteResponse(result);
}
