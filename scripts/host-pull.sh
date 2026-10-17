#!/bin/bash
# Cron cPanel: kiểm tra bản dựng, bảo toàn đánh giá rồi cập nhật Passenger.
# Không xóa ứng dụng, không reset Git và không thay cấu hình/dữ liệu runtime.
set -u

APP="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPNAME="$(basename "$APP")"
BRANCH="${MIMI_DEPLOY_BRANCH:-deploy}"
LOCK_DIR="$HOME/.mimi-deploy-$APPNAME.lock"
PENDING_FILE="$HOME/.mimi-deploy-$APPNAME.pending"
MIGRATION_RUNNER=""

fail() { echo "[$(date -u +%FT%TZ)] HUỶ: $*"; exit 1; }
cleanup() {
    if [ -n "$MIGRATION_RUNNER" ]; then rm -f -- "$MIGRATION_RUNNER"; fi
    rmdir -- "$LOCK_DIR" 2>/dev/null || true
}

mkdir -- "$LOCK_DIR" 2>/dev/null || fail "Đang có lượt cập nhật khác; không chạy song song."
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
cd "$APP" || fail "Không vào được thư mục ứng dụng."

# Chỉ sửa checkout triển khai sạch và lịch sử có thể tiến thẳng.
[ "$(git branch --show-current)" = "$BRANCH" ] || fail "Ứng dụng phải ở nhánh $BRANCH."
git diff --quiet && git diff --cached --quiet || fail "Có thay đổi mã nguồn trên host; giữ nguyên để kiểm tra."
git fetch origin "$BRANCH" --quiet || fail "Không tải được thông tin bản dựng."
LOCAL="$(git rev-parse HEAD)" || fail "Không đọc được phiên bản hiện tại."
REMOTE="$(git rev-parse "origin/$BRANCH")" || fail "Không đọc được phiên bản mới."

# npm ci lỗi ở lượt trước: thử hoàn tất đúng checkout đó, không bỏ qua vì HEAD
# đã mới. Chỉ sau khi hoàn tất mới nhận bản dựng tiếp theo ở lượt cron sau.
if [ -f "$PENDING_FILE" ]; then
    PENDING="$(cat "$PENDING_FILE")"
    [[ "$PENDING" =~ ^[0-9a-f]{40,64}$ ]] || fail "Checkpoint triển khai không hợp lệ."
    [ "$LOCAL" = "$PENDING" ] || fail "Checkout khác checkpoint chưa hoàn tất; giữ nguyên để kiểm tra."
    REMOTE="$PENDING"
elif [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi
git merge-base --is-ancestor "$LOCAL" "$REMOTE" || fail "Lịch sử phân nhánh; không tự reset hoặc ghi đè."

git cat-file -e "$REMOTE:.next/BUILD_ID" 2>/dev/null || fail "Bản dựng thiếu .next/BUILD_ID."
BUILD_ID="$(git show "$REMOTE:.next/BUILD_ID")" || fail "Không đọc được BUILD_ID."
[[ "$BUILD_ID" =~ ^[A-Za-z0-9_-]+$ ]] || fail "BUILD_ID không hợp lệ."
git cat-file -e "$REMOTE:scripts/migrate-feedback.cjs" 2>/dev/null || fail "Bản dựng thiếu công cụ bảo toàn đánh giá."
# Các đường dẫn này phải luôn ở ngoài Git; từ chối artifact có thể ghi đè chúng.
ARTIFACT_PATHS="$(git ls-tree -r --name-only "$REMOTE")" || fail "Không đọc được danh sách file artifact."
RUNTIME_PATHS="$(printf '%s\n' "$ARTIFACT_PATHS" | awk '$0 == ".env" || ($0 ~ /^\.env\./ && $0 != ".env.example") || $0 ~ /^(data|tmp|node_modules)(\/|$)/ || $0 == ".next/mimi_feedback_store.json"')"
[ -z "$RUNTIME_PATHS" ] || fail "Artifact chứa cấu hình hoặc dữ liệu runtime; không cập nhật."

# Kích hoạt đúng nodevenv trước migration, cài thư viện hay thay checkout.
VENV=""
for CANDIDATE in "$HOME"/nodevenv/"$APPNAME"/*/bin/activate; do
    [ -f "$CANDIDATE" ] || continue
    if ( set +u; . "$CANDIDATE" && node -e 'const [major,minor]=process.versions.node.split(".").map(Number); if(major<22||(major===22&&minor<12)) process.exit(1)' ); then
        VENV="$CANDIDATE"; break
    fi
done
[ -n "$VENV" ] || fail "Cần nodevenv Node.js 22.12 trở lên."
set +u
. "$VENV" || fail "Không kích hoạt được nodevenv."
set -u

# Backup nguyên bản trước migration; giữ bên ngoài ứng dụng qua các lần pull.
# Không sao chép .env hoặc token vào backup/log.
if [ -f "$APP/.next/mimi_feedback_store.json" ]; then
    BACKUP_DIR="$HOME/mimi-deploy-backups/$APPNAME/$(date -u +%Y%m%dT%H%M%SZ)-${REMOTE:0:7}"
    mkdir -p -- "$BACKUP_DIR" || fail "Không tạo được thư mục sao lưu đánh giá."
    cp -p -- "$APP/.next/mimi_feedback_store.json" "$BACKUP_DIR/feedback-legacy.json" || fail "Không sao lưu được đánh giá."
fi

# Runner trong tmp tìm được @next/env của ứng dụng hiện tại. CWD vẫn là APP để
# .env.local và MIMI_FEEDBACK_STORE được nạp trước khi .next bị thay thế.
mkdir -p -- "$APP/tmp" || fail "Không tạo được thư mục tạm."
MIGRATION_RUNNER="$(mktemp "$APP/tmp/mimi-feedback-migrate.XXXXXX.cjs")" || fail "Không tạo được runner migration."
git show "$REMOTE:scripts/migrate-feedback.cjs" > "$MIGRATION_RUNNER" || fail "Không đọc được công cụ migration."
node "$MIGRATION_RUNNER" || fail "Migration lỗi; mã nguồn và .next cũ được giữ nguyên."

printf '%s\n' "$REMOTE" > "$PENDING_FILE" || fail "Không lưu được checkpoint triển khai."
if ! git merge --ff-only --quiet "$REMOTE"; then
    rm -f -- "$PENDING_FILE"
    fail "Không thể cập nhật tiến thẳng; không tự ghi đè thay đổi trên host."
fi
# Nếu bước này lỗi, checkpoint cho cron thử lại đúng bản dựng. Không tự rollback
# hay restart một bộ thư viện chưa cài xong; lưu ý đây không phải triển khai atomic.
npm ci --omit=dev --no-audit --no-fund || fail "Cài thư viện lỗi; chưa yêu cầu restart. Checkpoint được giữ để thử lại."
touch "$APP/tmp/restart.txt" || fail "Không tạo được yêu cầu Passenger restart."
rm -f -- "$PENDING_FILE"
echo "[$(date -u +%FT%TZ)] Đã yêu cầu Passenger nạp bản dựng $BUILD_ID @ ${REMOTE:0:7}. Cần kiểm tra /api/version và các trang sau triển khai."
