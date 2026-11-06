import { callMimiApi, toRouteResponse } from '@/lib/mimi-api';
import type { ApiCommand } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** Proxy: GET /api/commands → GET {bot}/internal/commands */
export async function GET() {
  const result = await callMimiApi<{ ok: boolean; commands: ApiCommand[]; count: number }>(
    '/internal/commands'
  );
  if (result.ok && Array.isArray(result.data?.commands)) {
    // Trong lúc website và bot nhận bản dựng khác nhau, không công bố lệnh Shield cũ.
    const retired = new Set(['license', 'banquyen', 'kichhoat', 'xacnhan', 'genkey']);
    const commands = result.data.commands.filter(command => !retired.has(command.name));
    return toRouteResponse({ ...result, data: { ...result.data, commands, count: commands.length } });
  }
  return toRouteResponse(result);
}
