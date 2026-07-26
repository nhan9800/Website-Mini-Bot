import { buildInfo } from '@/lib/build-info';

export const dynamic = 'force-dynamic';

/**
 * GET /api/version — cho biết máy chủ web đang chạy bản dựng nào.
 *
 * Không cần token: chỉ trả commit hash công khai (repo là mã nguồn mở), không
 * chạm tới bot hay dữ liệu người dùng. Mục đích là để một lệnh curl phân biệt
 * được "deploy đã lên" với "deploy im lặng thất bại".
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      commit: buildInfo.commit,
      shortCommit: buildInfo.shortCommit,
      branch: buildInfo.branch,
      builtAt: buildInfo.builtAt,
      runNumber: buildInfo.runNumber,
      servedAt: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
