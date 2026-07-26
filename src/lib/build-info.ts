/**
 * Thông tin bản dựng — để trả lời "site đang chạy commit nào?" bằng một request.
 *
 * Giá trị được nhúng lúc `next build` qua biến môi trường do GitHub Actions đặt.
 * Build ở máy dev (không có biến) thì hiện 'dev' — đó là trạng thái bình thường,
 * không phải lỗi.
 */
export const buildInfo = {
  commit: process.env.NEXT_PUBLIC_BUILD_COMMIT || 'dev',
  shortCommit: (process.env.NEXT_PUBLIC_BUILD_COMMIT || 'dev').slice(0, 7),
  branch: process.env.NEXT_PUBLIC_BUILD_BRANCH || null,
  builtAt: process.env.NEXT_PUBLIC_BUILD_TIME || null,
  runNumber: process.env.NEXT_PUBLIC_BUILD_RUN || null,
} as const;
