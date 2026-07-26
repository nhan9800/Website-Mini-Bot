# Hướng Dẫn Triển Khai Website-Mini-Bot Lên cPanel Nhân Hòa (Node.js App)

> **Mục Tiêu**: Deploy website Next.js 14 App Router của Mimi Bot lên hosting **cPanel Nhân Hòa** có **Setup Node.js App (Phusion Passenger)**.

> ⚡ **QUAN TRỌNG — quy trình từ v2.2.0**: GitHub Actions build sẵn rồi đẩy kết quả sang **nhánh `deploy`**; cPanel chỉ kéo nhánh đó về, `npm install` và restart. Không build ở máy dev, cũng **TUYỆT ĐỐI KHÔNG build trên host** (2GB RAM LVE sẽ bị OOM `Killed`).
>
> Trên cPanel phải checkout đúng nhánh **`deploy`** — nhánh `main` không chứa `.next` nên site sẽ lỗi 500.
>
> Chi tiết đầy đủ: `CI-CD-AUTO-DEPLOY.md` ở thư mục gốc.

---

## 1. Yêu Cầu Gói Hosting
- Hosting cPanel phải có tính năng **Setup Node.js App** (phân hệ CloudLinux LVE Manager).
- Hỗ trợ Node.js phiên bản **18.x** hoặc **20.x**.

---

## 2. Các Bước Tạo Ứng Dụng Trên cPanel

1. Đăng nhập vào **cPanel** -> Chọn mục **Setup Node.js App** trong nhóm Software.
2. Nhấp nút **Create Application**:
   - **Node.js version**: Chọn `20.x` (hoặc `18.x`).
   - **Application mode**: Chọn `Production`.
   - **Application root**: Nhập tên thư mục lưu code, ví dụ `website-mini-bot`.
   - **Application URL**: Chọn tên miền của bạn, ví dụ `mimibot.id.vn`.
   - **Application startup file**: Nhập chính xác `server.cjs` (đuôi .cjs bắt buộc: package.json có `"type": "module"` nên Passenger require() file .js sẽ lỗi ERR_REQUIRE_ESM).
3. Bấm **Create** để cPanel tạo môi trường ảo (virtual environment) và file `.htaccess`.

---

## 3. Lấy Mã Nguồn Từ GitHub

### Cách A: Dùng Git Version Control của cPanel (Khuyên Dùng)
1. Trong cPanel -> Chọn **Git Version Control** -> **Create**:
   - **Clone URL**: `https://github.com/nhan9800/Website-Mini-Bot.git`
   - **Repository Path**: trỏ đúng thư mục `website-mini-bot` đã tạo ở bước 2.
2. Bấm **Manage** -> đổi **Checked-Out Branch** sang **`deploy`**. Đây là bước hay bị bỏ sót: nhánh `main` chỉ có mã nguồn, không có `.next`.
3. Khi có code mới: bấm **Update from Remote** (hoặc để webhook tự làm — xem `CI-CD-AUTO-DEPLOY.md`).

### Cách B: Terminal cPanel
```bash
cd ~
git clone -b deploy https://github.com/nhan9800/Website-Mini-Bot.git website-mini-bot
```

---

## 4. Cài Dependencies & Khởi Động (KHÔNG BUILD)

Mở **Terminal** của cPanel và chạy:

```bash
# 1. Kích hoạt môi trường Node.js của cPanel
source ~/nodevenv/website-mini-bot/*/bin/activate

# 2. Vào thư mục web, kéo bản build mới nhất (nhánh deploy!)
cd ~/website-mini-bot
git pull origin deploy

# 3. Cài thư viện runtime (KHÔNG chạy npm run build!)
npm ci --omit=dev --no-audit --no-fund

# 4. Kiểm tra đúng nhánh: phải có BUILD_ID
cat .next/BUILD_ID || echo "THIEU .next — dang o nham nhanh main?"

# 5. Restart Passenger
mkdir -p tmp && touch tmp/restart.txt
echo "=== DEPLOY XONG ==="
```

Thư mục `.next/` (bản build production) do GitHub Actions dựng sẵn trên nhánh `deploy` — host chỉ việc chạy.

Kiểm chứng sau khi restart:

```bash
curl -s https://mimibot.id.vn/api/version
```

Trường `shortCommit` phải khớp commit mới nhất trên `main`.

---

## 5. Cấu Hình Biến Môi Trường (Environment Variables)

Trong **Setup Node.js App** -> **Environment variables**, thêm:

| Tên Biến | Giá Trị | Mô Tả |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Chế độ chạy thực tế |
| `MIMI_API_HOST` | `http://hcm3.vibehost.vn` | Host công khai của Bot (VibeHost) |
| `MIMI_API_PORT` | `20019` | Cổng Internal API của Bot |
| `MIMI_API_TOKEN` | `chuỗi-token-bí-mật` | **BẮT BUỘC** — phải khớp `mimiApiToken` trong `config.json` của Bot |

> Ghi chú: `MIMI_API_HOST`/`MIMI_API_PORT` đã có giá trị mặc định đúng trong code, nhưng `MIMI_API_TOKEN` **bắt buộc phải khai báo** thì Dashboard/Trạng thái mới hiện dữ liệu thật.
>
> Có thể thay 2 biến host+port bằng một biến duy nhất `MIMI_API_BASE` = `http://hcm3.vibehost.vn:20019`.

### Cách mở Dashboard của một server (từ v2.2.0)

Dashboard không còn mở bằng cách gõ Guild ID nữa. Người dùng vào server Discord, gõ **`/dashboard`** — Mimi kiểm tra quyền **Quản Lý Máy Chủ** rồi gửi lại link kèm khoá truy cập (hạn 7 ngày).

Lý do: web luôn tự đính service token khi gọi bot, nên nếu không có khoá riêng thì bất kỳ ai biết Guild ID cũng dừng được nhạc hay đổi prefix của server lạ. Xem `docs/SECURITY.md` bên repo bot.

Phía bot (VibeHost) nên đặt thêm biến `MIMI_WEB_BASE` = `https://mimibot.id.vn` để link `/dashboard` trỏ đúng tên miền.

Sau khi thêm/sửa biến môi trường phải bấm **Restart** thì mới có hiệu lực.

---

## 6. Khởi Động Lại (Restart Application)

- Bấm nút **Restart** trong **Setup Node.js App**, hoặc chạy `touch ~/website-mini-bot/tmp/restart.txt`.
- Mở `https://mimibot.id.vn` để kiểm tra.

---

## 7. Giải Quyết Lỗi Thường Gặp (Troubleshooting)

- **Lỗi `Killed` khi build**: Bạn đang chạy `npm run build` trên host — KHÔNG cần và không nên. Bản build do GitHub Actions dựng sẵn trên nhánh `deploy`, host chỉ việc kéo về.
- **Trang trắng / file `_next/static/*` báo 500**: Thư mục `.next` trên host bị hỏng hoặc đang ở nhầm nhánh. Lấy lại bản chuẩn từ nhánh `deploy`:
  ```bash
  cd ~/website-mini-bot
  git fetch origin deploy && git checkout deploy && git reset --hard origin/deploy
  cat .next/BUILD_ID   # phải in ra một chuỗi, nếu trống là vẫn sai nhánh
  touch tmp/restart.txt
  ```
- **`git pull` báo "local changes would be overwritten"**: có file bị sửa trên host (thường do chạy `npm install` làm đổi `package-lock.json`). Dùng `git reset --hard origin/deploy` như trên, và về sau dùng `npm ci` thay cho `npm install`.
- **`git pull` báo "refusing to merge unrelated histories"**: nhánh `deploy` đã bị dựng lại từ đầu. Xoá thư mục và clone lại: `cd ~ && rm -rf website-mini-bot && git clone -b deploy https://github.com/nhan9800/Website-Mini-Bot.git website-mini-bot`.
- **Lỗi 503 / Application Not Starting**: Kiểm tra `Application startup file` phải là `server.cjs` và đã `npm ci` xong.
- **Dashboard báo "Chưa cấu hình MIMI_API_TOKEN"**: Thêm biến `MIMI_API_TOKEN` (mục 5) rồi Restart.
- **Trạng thái bot hiện "ngoại tuyến" dù bot đang chạy**: Kiểm tra `curl http://hcm3.vibehost.vn:20019/health/live` từ Terminal cPanel — nếu không phản hồi, VibeHost đang chặn cổng hoặc bot chưa bật Internal API.
