/**
 * Khoá truy cập Dashboard theo từng server.
 *
 * Bot phát khoá qua lệnh `/dashboard` (chỉ người có quyền Quản Lý Máy Chủ),
 * kèm trong link dưới dạng `?key=...`. Trình duyệt giữ khoá trong sessionStorage
 * và gửi lại ở header `x-mimi-key` cho các route API của web; web chuyển tiếp
 * sang bot. Không có khoá thì bot từ chối — nhờ vậy dashboard không còn là
 * proxy mở cho bất kỳ ai biết guild ID.
 */

const PREFIX = 'mimi.key.';

/** Đọc khoá đã lưu cho 1 server (chỉ chạy phía trình duyệt). */
export function readAccessKey(guildId: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.sessionStorage.getItem(PREFIX + guildId) || '';
  } catch {
    return '';
  }
}

export function saveAccessKey(guildId: string, key: string): void {
  if (typeof window === 'undefined' || !key) return;
  try {
    window.sessionStorage.setItem(PREFIX + guildId, key);
  } catch {}
}

export function clearAccessKey(guildId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(PREFIX + guildId);
  } catch {}
}

/**
 * Lấy khoá từ `?key=` trên URL (nếu có), lưu lại rồi xoá khỏi thanh địa chỉ để
 * khoá không nằm trong lịch sử duyệt hay bị copy nhầm khi chia sẻ link.
 * Trả về khoá đang dùng cho server này.
 */
export function adoptAccessKeyFromUrl(guildId: string): string {
  if (typeof window === 'undefined') return '';
  try {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('key');
    if (fromUrl) {
      saveAccessKey(guildId, fromUrl);
      url.searchParams.delete('key');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      return fromUrl;
    }
  } catch {}
  return readAccessKey(guildId);
}

/** Header đính kèm mọi request tới /api/guilds/* của web. */
export function accessKeyHeader(key: string): Record<string, string> {
  return key ? { 'x-mimi-key': key } : {};
}
