import { callMimiApi } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

export interface CommunitySummary {
  id: string;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  boostCount: number;
  onlineCount: number | null;
  owner: { id: string; username: string | null; displayName: string | null; avatarUrl: string | null } | null;
  features: { music: boolean; ticket: boolean; level: boolean };
}

/** Proxy dữ liệu các cộng đồng đã được chủ bot cho phép hiển thị. */
export async function GET() {
  const result = await callMimiApi<{
    ok: boolean;
    communities: CommunitySummary[];
    count: number;
    source: string;
    updatedAt: string;
  }>('/internal/communities');

  if (!result.ok || !result.data?.ok) {
    return Response.json({ ok: false, communities: [], source: 'unavailable', error: result.error }, { status: result.status || 503 });
  }
  return Response.json(result.data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
