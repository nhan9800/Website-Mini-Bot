import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import type { ApiCommand } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** Proxy: GET /api/commands → GET {bot}/internal/commands */
export async function GET() {
  const result = await callMimiApi<{ ok: boolean; commands: ApiCommand[]; count: number }>(
    '/internal/commands'
  );
  return toRouteResponse(result);
}
