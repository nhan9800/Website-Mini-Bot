import 'server-only';

/**
 * Client gọi Internal API của bot Mimi.
 *
 * QUAN TRỌNG — các endpoint thật mà bot phục vụ (xem internalApi.js):
 *   GET   /health/live                          (không cần token)
 *   GET   /health/ready                         (không cần token)
 *   GET   /internal/status
 *   GET   /internal/commands
 *   GET   /internal/guilds/:id/settings
 *   PATCH /internal/guilds/:id/settings
 *   GET   /internal/guilds/:id/player
 *   GET   /internal/guilds/:id/queue
 *   POST  /internal/guilds/:id/player/:action   (pause|resume|skip|stop|volume)
 *
 * Token luôn ở phía server, không bao giờ lộ ra trình duyệt.
 *
 * Các endpoint /internal/guilds/:id/* còn đòi header X-Mimi-Access-Key — khoá do
 * bot ký, người dùng lấy bằng lệnh /dashboard trong Discord (bot kiểm tra quyền
 * Quản Lý Máy Chủ trước khi phát). Web chỉ chuyển tiếp khoá, không tự tạo được.
 */

function trimSlash(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

const rawBase = process.env.MIMI_API_BASE?.trim();
const rawHost = trimSlash(process.env.MIMI_API_HOST || 'http://hcm3.vibehost.vn');
const rawPort = (process.env.MIMI_API_PORT || '20019').trim();

/** Host đã có sẵn cổng (vd: http://abc.vn:20019) thì không ghép thêm nữa. */
const hostHasPort = /:\d+$/.test(rawHost.replace(/^https?:\/\//, ''));

export const MIMI_API_BASE = rawBase
  ? trimSlash(rawBase)
  : hostHasPort
    ? rawHost
    : `${rawHost}:${rawPort}`;

const serverEnv = {
  /** Service token bắt buộc cho mọi endpoint /internal/*. */
  MIMI_API_TOKEN: process.env.MIMI_API_TOKEN || '',
  /** Thời gian chờ tối đa khi gọi bot (ms). */
  MIMI_API_TIMEOUT_MS: Number(process.env.MIMI_API_TIMEOUT_MS || 6000),
};

export interface MimiApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: { code: string; message: string } | null;
}

function describeNetworkError(err: unknown): { code: string; message: string } {
  const raw = err instanceof Error ? err.message : String(err);

  if (raw.includes('aborted') || raw.includes('AbortError') || raw.includes('timeout')) {
    return {
      code: 'TIMEOUT',
      message: `Bot không phản hồi trong ${serverEnv.MIMI_API_TIMEOUT_MS}ms. Có thể bot đang khởi động lại hoặc cổng bị chặn.`,
    };
  }
  if (raw.includes('ECONNREFUSED')) {
    return {
      code: 'CONNECTION_REFUSED',
      message: `Không kết nối được tới ${MIMI_API_BASE}. Bot chưa bật Internal API hoặc sai cổng.`,
    };
  }
  if (raw.includes('ENOTFOUND') || raw.includes('EAI_AGAIN')) {
    return {
      code: 'DNS_ERROR',
      message: `Không phân giải được tên miền của bot (${MIMI_API_BASE}).`,
    };
  }
  return { code: 'NETWORK_ERROR', message: raw };
}

export async function callMimiApi<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown; accessKey?: string } = {}
): Promise<MimiApiResult<T>> {
  if (!serverEnv.MIMI_API_TOKEN) {
    return {
      ok: false,
      status: 500,
      data: null,
      error: {
        code: 'MISSING_TOKEN',
        message:
          'Chưa cấu hình MIMI_API_TOKEN trên máy chủ web. Vào cPanel → Setup Node.js App → Environment variables để thêm.',
      },
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), serverEnv.MIMI_API_TIMEOUT_MS);

  try {
    const res = await fetch(`${MIMI_API_BASE}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${serverEnv.MIMI_API_TOKEN}`,
        ...(init.accessKey ? { 'X-Mimi-Access-Key': init.accessKey } : {}),
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
      signal: controller.signal,
    });

    const text = await res.text();
    let payload: any = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        return {
          ok: false,
          status: res.status,
          data: null,
          error: { code: 'INVALID_RESPONSE', message: 'Bot trả về dữ liệu không phải JSON.' },
        };
      }
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: payload?.error ?? {
          code: 'UPSTREAM_ERROR',
          message: `Bot trả về mã lỗi ${res.status}.`,
        },
      };
    }

    return { ok: true, status: res.status, data: payload as T, error: null };
  } catch (err) {
    return { ok: false, status: 503, data: null, error: describeNetworkError(err) };
  } finally {
    clearTimeout(timer);
  }
}

/** Chuyển kết quả từ callMimiApi thành Response cho route handler. */
export function toRouteResponse<T>(result: MimiApiResult<T>): Response {
  const body = result.ok
    ? result.data
    : { ok: false, error: result.error, apiBase: MIMI_API_BASE };

  return new Response(JSON.stringify(body), {
    status: result.ok ? 200 : result.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
