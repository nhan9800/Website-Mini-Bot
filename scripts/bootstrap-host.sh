#!/bin/bash
# =====================================================================
# Dựng lại website Mimi trên cPanel từ đầu, chạy một lượt trong Terminal.
# =====================================================================
#
# MẶC ĐỊNH KHÔNG XOÁ GÌ — chạy không tham số thì chỉ IN RA KẾ HOẠCH để bạn đọc.
# Muốn thực sự làm thì thêm --yes.
#
#   bash scripts/bootstrap-host.sh                          # xem trước
#   bash scripts/bootstrap-host.sh --yes                     # làm thật
#   bash scripts/bootstrap-host.sh --yes --remove-old mimi_app
#
# Script chỉ đụng vào những đường dẫn được liệt kê ở phần KẾ HOẠCH. Không bao giờ
# chạm tới public_html, email, hay domain khác.
#
# Tuỳ chọn:
#   --yes                bỏ chế độ xem trước, thực thi thật
#   --app-name NAME      tên thư mục ứng dụng (mặc định: website-mini-bot)
#   --domain DOMAIN      tên miền (mặc định: mimibot.id.vn)
#   --remove-old DIR     thư mục app cũ cần xoá (lặp lại được nhiều lần)
#   --branch BRANCH      nhánh cần chạy (mặc định: deploy)
#   --reset-venv         xoá luôn môi trường Node hiện có (mặc định GIỮ LẠI —
#                        môi trường này chỉ tạo lại được qua giao diện cPanel,
#                        xoá đi là phải vào UI bấm tay mới đi tiếp được)
# =====================================================================
set -uo pipefail

REPO_URL="https://github.com/nhan9800/Website-Mini-Bot.git"
APP_NAME="website-mini-bot"
DOMAIN="mimibot.id.vn"
BRANCH="deploy"
DO_IT=0
RESET_VENV=0
OLD_DIRS=()

while [ $# -gt 0 ]; do
    case "$1" in
        --yes) DO_IT=1; shift ;;
        --app-name) APP_NAME="$2"; shift 2 ;;
        --domain) DOMAIN="$2"; shift 2 ;;
        --branch) BRANCH="$2"; shift 2 ;;
        --remove-old) OLD_DIRS+=("$2"); shift 2 ;;
        --reset-venv) RESET_VENV=1; shift ;;
        *) echo "Tham số lạ: $1"; exit 2 ;;
    esac
done

APP_DIR="$HOME/$APP_NAME"
VENV_DIR="$HOME/nodevenv/$APP_NAME"

say()  { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
ok()   { printf '   \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '   \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$*"; exit 1; }

# Xoá thư mục, nhưng chỉ khi nó THỰC SỰ nằm bên trong thư mục nhà.
# So sánh trên đường dẫn đã chuẩn hoá (pwd -P) chứ không so chuỗi thô, vì "."
# hay "app/../.." đều trỏ ngược ra ngoài mà nhìn chuỗi thì không thấy.
HOME_REAL="$(cd "$HOME" 2>/dev/null && pwd -P)" || die "Không xác định được thư mục nhà."

safe_rm() {
    local target="$1" label="${2:-}" real base
    [ -n "$target" ] || return 0
    [ -e "$target" ] || return 0

    real="$(cd "$target" 2>/dev/null && pwd -P)" || {
        warn "Bỏ qua (không phải thư mục): $target"; return 0;
    }

    [ "$real" = "$HOME_REAL" ] && die "Từ chối xoá chính thư mục nhà: $real"
    case "$real" in
        "$HOME_REAL"/*) : ;;
        *) die "Từ chối xoá đường dẫn nằm ngoài thư mục nhà: $real" ;;
    esac

    base="$(basename "$real")"
    case "$base" in
        public_html|mail|etc|ssl|logs|.cpanel|.ssh|tmp)
            die "Từ chối xoá thư mục hệ thống của cPanel: $real" ;;
    esac

    rm -rf "$real" && ok "Đã xoá $real${label:+ ($label)}"
}

# ---------------------------------------------------------------------
say "KẾ HOẠCH"
cat <<PLAN
   Tên miền        : $DOMAIN
   Thư mục app     : $APP_DIR
   Môi trường Node : $VENV_DIR
   Nguồn           : $REPO_URL (nhánh $BRANCH)

   Sẽ XOÁ:
     - $APP_DIR
$( if [ "$RESET_VENV" = 1 ]; then echo "     - $VENV_DIR  (môi trường Node — sẽ phải tạo lại trong cPanel!)";
   elif [ -d "$VENV_DIR" ]; then echo "     (GIỮ LẠI $VENV_DIR — dùng lại môi trường Node sẵn có)";
   fi )
$(for d in ${OLD_DIRS[@]+"${OLD_DIRS[@]}"}; do [ -n "$d" ] && echo "     - $HOME/$d  (app cũ)"; done)

   Sẽ TẠO LẠI:
     - clone nhánh $BRANCH vào $APP_DIR
     - cài thư viện runtime (npm ci --omit=dev)
     - restart Passenger

   KHÔNG đụng tới: public_html, email, domain khác, dữ liệu ngoài các đường dẫn trên.
PLAN

if [ "$DO_IT" -ne 1 ]; then
    warn "Đang ở chế độ XEM TRƯỚC — chưa có gì bị thay đổi."
    echo "   Chạy lại kèm --yes để thực hiện."
    exit 0
fi

# ---------------------------------------------------------------------
say "1/6 · Kiểm tra môi trường"

command -v git >/dev/null || die "Không có git trên host này."
ok "git $(git --version | awk '{print $3}')"

FREE_KB=$(df -Pk "$HOME" | awk 'NR==2 {print $4}')
FREE_MB=$((FREE_KB / 1024))
if [ "$FREE_MB" -lt 700 ]; then
    warn "Dung lượng trống chỉ ${FREE_MB}MB — cần khoảng 700MB. Sẽ thử dọn bớt."
else
    ok "Dung lượng trống: ${FREE_MB}MB"
fi

# ---------------------------------------------------------------------
say "2/6 · Gỡ bản cũ"

# Gỡ đăng ký các app CŨ KHÁC (nếu được chỉ định qua --remove-old).
#
# KHÔNG đụng vào đăng ký của chính app đang dùng: destroy sẽ xoá luôn môi trường
# Node và gỡ khối cấu hình Passenger khỏi .htaccess — tức là hạ site, rồi phải
# vào giao diện cPanel tạo lại mới chạy được. Chỉ làm khi người dùng yêu cầu rõ
# bằng --reset-venv.
if [ "$RESET_VENV" = 1 ] && command -v cloudlinux-selector >/dev/null 2>&1; then
    cloudlinux-selector destroy --json --interpreter nodejs \
        --user "$(whoami)" --app-root "$APP_NAME" >/dev/null 2>&1 \
        && ok "Đã gỡ đăng ký app: $APP_NAME" || true
fi

# "${ARR[@]:-}" trên mảng RỖNG nở ra một chuỗi trắng, khiến "$HOME/$d" thành
# "$HOME/" — tức là đi xoá thư mục nhà. Dùng dạng ${ARR[@]+...} để mảng rỗng nở
# ra đúng con số không phần tử.
for d in ${OLD_DIRS[@]+"${OLD_DIRS[@]}"}; do
    [ -n "$d" ] || continue
    if command -v cloudlinux-selector >/dev/null 2>&1; then
        cloudlinux-selector destroy --json --interpreter nodejs \
            --user "$(whoami)" --app-root "$d" >/dev/null 2>&1 \
            && ok "Đã gỡ đăng ký app cũ: $d" || true
    fi
    safe_rm "$HOME/$d" "app cũ"
done

safe_rm "$APP_DIR"

# Môi trường Node chỉ tạo lại được qua giao diện cPanel (hoặc cloudlinux-selector).
# Còn dùng được thì giữ — xoá đi chỉ tổ phải vào UI bấm tay mới đi tiếp được.
if [ "$RESET_VENV" = 1 ]; then
    safe_rm "$VENV_DIR" "môi trường Node"
elif [ -d "$VENV_DIR" ]; then
    ok "Giữ lại môi trường Node sẵn có: $VENV_DIR"
fi

npm cache clean --force >/dev/null 2>&1 && ok "Đã dọn npm cache" || true

# ---------------------------------------------------------------------
say "3/6 · Tải mã nguồn"

git clone -b "$BRANCH" --single-branch --depth 1 "$REPO_URL" "$APP_DIR" \
    || die "Clone thất bại — kiểm tra mạng hoặc URL repo."

[ -f "$APP_DIR/.next/BUILD_ID" ] \
    || die "Nhánh '$BRANCH' không có .next/BUILD_ID. Nhánh main không dùng được, phải là 'deploy'."
ok "Đã tải bản dựng $(cat "$APP_DIR/.next/BUILD_ID")"
ok "Commit: $(git -C "$APP_DIR" rev-parse --short HEAD)"

# ---------------------------------------------------------------------
say "4/6 · Đăng ký ứng dụng Node.js"

if [ -d "$VENV_DIR" ]; then
    ok "App '$APP_NAME' đã tồn tại — không tạo lại."
elif command -v cloudlinux-selector >/dev/null 2>&1; then
    cloudlinux-selector create --json --interpreter nodejs \
        --user "$(whoami)" \
        --app-root "$APP_NAME" \
        --app-uri "/" \
        --app-mode production \
        --startup-file server.cjs \
        --domain "$DOMAIN" >/dev/null 2>&1 \
        && ok "Đã tạo app Node.js trỏ vào $DOMAIN" \
        || warn "Tạo bằng CLI không thành công — hãy tạo tay trong Setup Node.js App."
else
    warn "Không có CLI. Vào cPanel → Setup Node.js App → Create Application:"
    echo "       Node.js version         : 20.x"
    echo "       Application mode        : Production"
    echo "       Application root        : $APP_NAME"
    echo "       Application URL         : $DOMAIN"
    echo "       Application startup file: server.cjs"
    echo "     Tạo xong chạy lại lệnh này để sang bước cài thư viện."
fi

# ---------------------------------------------------------------------
say "5/6 · Cài thư viện"

VENV_ACTIVATE=$(ls -d "$VENV_DIR"/*/bin/activate 2>/dev/null | head -1)
if [ -z "$VENV_ACTIVATE" ]; then
    warn "Chưa có môi trường Node cho '$APP_NAME'."
    echo "   → Tạo app trong Setup Node.js App (thông tin ở bước 4) rồi chạy lại lệnh này."
    echo "   → Mã nguồn đã sẵn ở $APP_DIR, chạy lại sẽ không tải lại từ đầu."
    exit 0
fi

# Tắt `set -u` khi nạp: script activate của cPanel tham chiếu CL_VIRTUAL_ENV khi
# biến này chưa được gán, gặp `set -u` là chết ngay giữa chừng.
set +u
# shellcheck disable=SC1090
. "$VENV_ACTIVATE" || die "Không kích hoạt được môi trường Node."
set -u
ok "Node $(node -v)"

cd "$APP_DIR" || die "Không vào được $APP_DIR"

# --omit=dev bỏ eslint và các gói chỉ dùng lúc phát triển, tiết kiệm đáng kể dung lượng.
npm ci --omit=dev --no-audit --no-fund || die "npm ci thất bại."
ok "Đã cài thư viện runtime"

npm cache clean --force >/dev/null 2>&1 || true
ok "Còn trống: $(df -Ph "$HOME" | awk 'NR==2 {print $4}')"

# ---------------------------------------------------------------------
say "6/6 · Khởi động"

mkdir -p "$APP_DIR/tmp" && touch "$APP_DIR/tmp/restart.txt"
ok "Đã yêu cầu Passenger nạp lại"

sleep 8
VERSION_JSON=$(curl -s -m 15 "https://$DOMAIN/api/version" 2>/dev/null || true)
case "$VERSION_JSON" in
    *shortCommit*)
        ok "Site đang chạy: $VERSION_JSON" ;;
    *)
        warn "Chưa đọc được https://$DOMAIN/api/version"
        echo "   Thường vì còn thiếu biến môi trường, hoặc app chưa khởi động xong."
        echo "   Đợi 30 giây rồi thử: curl -s https://$DOMAIN/api/version" ;;
esac

# ---------------------------------------------------------------------
say "CÒN LẠI (làm trong giao diện cPanel)"
cat <<NEXT
   1. Setup Node.js App → app '$APP_NAME' → Environment variables, thêm:
        NODE_ENV       = production
        MIMI_API_BASE  = http://hcm3.vibehost.vn:20019
        MIMI_API_TOKEN = <khớp mimiApiToken trong config.json của bot>
      Rồi bấm Restart. (Token KHÔNG đặt qua dòng lệnh để khỏi lưu vào lịch sử shell.)

   2. Cron Jobs → thêm, chạy mỗi 5 phút, để lần sau push là tự lên:
        bash \$HOME/$APP_NAME/scripts/host-pull.sh >> \$HOME/mimi-deploy.log 2>&1

   Kiểm tra bất cứ lúc nào:
        curl -s https://$DOMAIN/api/version
NEXT
