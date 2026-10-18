import { callMimiApi } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

/**
 * Đồng bộ catalog gói và thông tin nhận tiền từ bot. Trang pricing giữ fallback
 * tĩnh khi route này chưa có dữ liệu; không đưa service token xuống trình duyệt.
 */
export async function GET() {
  const result = await callMimiApi<{
    ok: boolean;
    plans?: Record<string, { id: string; name: string; durationDays: number; price: number; priceFormatted: string }>;
    bank?: { bankName?: string; accountNumber?: string; accountName?: string };
  }>('/api/pricing');
  if (result.ok) {
    return Response.json(result.data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  }
  // Không trả MIMI_API_BASE về trình duyệt; chỉ báo mã và thông điệp cần thiết.
  return Response.json({ ok: false, error: result.error }, { status: result.status, headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
