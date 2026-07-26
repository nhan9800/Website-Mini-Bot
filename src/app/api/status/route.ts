import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import type { BotStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** Proxy: GET /api/status → GET {bot}/internal/status */
export async function GET() {
  const result = await callMimiApi<BotStatus>('/internal/status');
  return toRouteResponse(result);
}
