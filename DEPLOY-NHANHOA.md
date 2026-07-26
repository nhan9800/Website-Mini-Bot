# Hướng Dẫn Triển Khai Website-Mini-Bot Lên cPanel Nhân Hòa (Node.js App)

> **Mục Tiêu**: Deploy website Next.js 14 App Router của Mimi Bot lên hosting **cPanel Nhân Hòa** có **Setup Node.js App (Phusion Passenger)**.

> ⚡ **QUAN TRỌNG — quy trình mới từ v2.1.0**: Website được **BUILD SẴN** ở máy dev và commit thư mục `.next/` lên GitHub. Trên hosting **TUYỆT ĐỐI KHÔNG chạy `npm run build`** — hosting chỉ có 2GB RAM (LVE) nên build sẽ bị hệ thống kill (lỗi `Killed` / OOM). Chỉ cần `git pull` + `npm install` + restart.

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
   - **Application startup file**: Nhập chính xác `server.js` (Passenger gọi file này để khởi chạy Next.js).
3. Bấm **Create** để cPanel tạo môi trường ảo (virtual environment) và file `.htaccess`.

---

## 3. Lấy Mã Nguồn Từ GitHub

### Cách A: Dùng Git Version Control của cPanel (Khuyên Dùng)
1. Trong cPanel -> Chọn **Git Version Control** -> **Create**:
   - **Clone URL**: `https://github.com/nhan9800/Website-Mini-Bot.git`
   - **Repository Path**: trỏ đúng thư mục `website-mini-bot` đã tạo ở bước 2.
2. Khi có code mới: bấm **Update from Remote** hoặc chạy `git pull` trong Terminal.

### Cách B: Terminal cPanel
```bash
cd ~
git clone https://github.com/nhan9800/Website-Mini-Bot.git website-mini-bot
```

---

## 4. Cài Dependencies & Khởi Động (KHÔNG BUILD)

Mở **Terminal** của cPanel và chạy:

```bash
# 1. Kích hoạt môi trường Node.js của cPanel
source ~/nodevenv/website-mini-bot/*/bin/activate

# 2. Vào thư mục web, kéo code + bản build mới nhất
cd ~/website-mini-bot
git pull origin main

# 3. Cài thư viện runtime (KHÔNG chạy npm run build!)
npm install --no-audit --no-fund

# 4. Restart Passenger
mkdir -p tmp && touch tmp/restart.txt
echo "=== DEPLOY XONG ==="
```

Thư mục `.next/` (bản build production) đã nằm sẵn trong repo — host chỉ việc chạy.

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

Sau khi thêm/sửa biến môi trường phải bấm **Restart** thì mới có hiệu lực.

---

## 6. Khởi Động Lại (Restart Application)

- Bấm nút **Restart** trong **Setup Node.js App**, hoặc chạy `touch ~/website-mini-bot/tmp/restart.txt`.
- Mở `https://mimibot.id.vn` để kiểm tra.

---

## 7. Giải Quyết Lỗi Thường Gặp (Troubleshooting)

- **Lỗi `Killed` khi build**: Bạn đang chạy `npm run build` trên host — KHÔNG cần và không nên. Bản build đã có sẵn trong repo, chỉ cần `git pull`.
- **Trang trắng / file `_next/static/*` báo 500**: Thư mục `.next` trên host bị hỏng (thường do build dở bị kill). Xóa và lấy lại bản chuẩn:
  ```bash
  cd ~/website-mini-bot && rm -rf .next && git checkout -- .next 2>/dev/null || git pull origin main
  touch tmp/restart.txt
  ```
- **Lỗi 503 / Application Not Starting**: Kiểm tra `Application startup file` phải là `server.js` và đã `npm install` xong.
- **Dashboard báo "Chưa cấu hình MIMI_API_TOKEN"**: Thêm biến `MIMI_API_TOKEN` (mục 5) rồi Restart.
- **Trạng thái bot hiện "ngoại tuyến" dù bot đang chạy**: Kiểm tra `curl http://hcm3.vibehost.vn:20019/health/live` từ Terminal cPanel — nếu không phản hồi, VibeHost đang chặn cổng hoặc bot chưa bật Internal API.
