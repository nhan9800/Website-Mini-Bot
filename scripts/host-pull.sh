#!/bin/bash
# Kéo bản dựng mới nhất về hosting rồi restart Passenger.
#
# Dùng cho Cron Job trên cPanel — mắt xích cuối của pipeline, chạy khi không muốn
# phụ thuộc vào webhook. Chạy được nhiều lần liên tiếp mà không gây tác dụng phụ:
# không có commit mới thì thoát ngay, không restart vô ích.
#
# Cài (cPanel → Cron Jobs), chạy mỗi 5 phút — thay đường dẫn cho khớp app root:
#   */5 * * * * bash $HOME/website-mini-bot/scripts/host-pull.sh >> $HOME/mimi-deploy.log 2>&1
set -u

# Tự suy ra thư mục ứng dụng từ vị trí của chính script (script nằm trong repo),
# nên đặt app ở đâu cũng chạy — không cần sửa đường dẫn cứng.
APP="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${MIMI_DEPLOY_BRANCH:-deploy}"

cd "$APP" || { echo "[$(date -u +%FT%TZ)] Không vào được $APP"; exit 1; }

git fetch origin "$BRANCH" --quiet || { echo "[$(date -u +%FT%TZ)] git fetch lỗi"; exit 1; }

LOCAL=$(git rev-parse HEAD 2>/dev/null || echo none)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
    exit 0   # đã mới nhất, không làm gì
fi

echo "[$(date -u +%FT%TZ)] Có bản mới: ${LOCAL:0:7} → ${REMOTE:0:7}"

# reset --hard thay vì merge: nhánh deploy là kết quả build, không phải nơi sửa tay.
git reset --hard "origin/$BRANCH" --quiet || { echo "  reset lỗi"; exit 1; }

# Thiếu .next nghĩa là đang ở nhầm nhánh — dừng, để bản cũ tiếp tục chạy.
if [ ! -f "$APP/.next/BUILD_ID" ]; then
    echo "  HUỶ: không có .next/BUILD_ID (nhầm nhánh main?)"
    exit 1
fi

# npm chỉ có trong PATH sau khi kích hoạt môi trường Node của cPanel. Tên môi
# trường trùng tên thư mục ứng dụng, nên suy ra từ $APP thay vì ghi cứng.
APPNAME="$(basename "$APP")"
VENV=$(ls -d "$HOME"/nodevenv/"$APPNAME"/*/bin/activate 2>/dev/null | head -1)
if [ -z "$VENV" ]; then
    echo "  Không tìm thấy nodevenv cho '$APPNAME' — đã tạo Node.js App trong cPanel chưa?"
    exit 1
fi
# shellcheck disable=SC1090
. "$VENV" || { echo "  không activate được nodevenv"; exit 1; }

npm ci --omit=dev --no-audit --no-fund || { echo "  npm ci lỗi"; exit 1; }

mkdir -p "$APP/tmp" && touch "$APP/tmp/restart.txt"
echo "  Xong — đang chạy $(cat "$APP/.next/BUILD_ID") @ ${REMOTE:0:7}"
