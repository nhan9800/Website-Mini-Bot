# Hướng Dẫn Triển Khai Website-Mini-Bot Lên cPanel Nhân Hòa (Node.js App)

> **Mục Tiêu**: Hướng dẫn chi tiết cách deploy website Next.js 14 App Router của Mimi Bot lên hosting **cPanel Nhân Hòa** (gói Startup hoặc cao hơn) có tích hợp **Setup Node.js App (Phusion Passenger)**.

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
   - **Application URL**: Chọn tên miền (domain/subdomain) của bạn, ví dụ `mimibot.id.vn`.
   - **Application startup file**: Nhập chính xác `server.js` (rất quan trọng, Passenger sẽ gọi file này để khởi chạy Next.js).
3. Bấm **Create** để cPanel tạo môi trường ảo (virtual environment) và file cấu hình `.htaccess`.

---

## 3. Upload & Cập Nhật Mã Nguồn Từ GitHub

Có 2 cách để đưa mã nguồn từ repo `https://github.com/nhan9800/Website-Mini-Bot` vào cPanel:

### Cách A: Dùng Git Version Control của cPanel (Khuyên Dùng)
1. Trong cPanel -> Chọn **Git Version Control**.
2. Nhấp **Create**:
   - **Clone URL**: `https://github.com/nhan9800/Website-Mini-Bot.git`
   - **Repository Path**: Trỏ đúng vào thư mục `Application root` đã tạo ở bước 2 (`website-mini-bot`).
3. Mỗi khi có code mới trên GitHub, bạn chỉ cần bấm **Update from Remote** (hoặc `git pull` trong terminal cPanel) là code tự động đồng bộ.

### Cách B: Nén và Upload bằng File Manager / FTP
1. Tải source code về từ GitHub (nhánh `main`).
2. Nén thành file `.zip` (Lưu ý: KHÔNG bao gồm thư mục `node_modules` và `.next`).
3. Dùng File Manager upload file `.zip` vào thư mục `website-mini-bot` và giải nén.

---

## 4. Cài Đặt Dependencies & Build Production

Sau khi code đã có trong thư mục `Application root`:
1. Mở lại trang **Setup Node.js App** trong cPanel -> Nhấp vào nút **Run NPM Install** để tải các gói thư viện (`node_modules`).
2. Mở **Terminal** của cPanel (hoặc SSH), chạy lệnh kích hoạt môi trường ảo được hiển thị trên đầu trang Node.js App (ví dụ: `source /home/username/nodevenv/website-mini-bot/20/bin/activate`).
3. Chạy lệnh build Next.js:
   ```bash
   npm run build
   ```
   Lệnh này sẽ tạo thư mục production `.next/` và chuẩn bị các trang static/dynamic. **Mỗi lần thay đổi code, bạn bắt buộc phải chạy lại `npm run build`**.

---

## 5. Cấu Hình Biến Môi Trường (Environment Variables)

Trong mục **Setup Node.js App** -> Phần **Environment variables**, nhấp **Add Variable** và thêm các biến sau:

| Tên Biến | Giá Trị Mẫu | Mô Tả |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Chế độ chạy thực tế |
| `NEXT_PUBLIC_SITE_URL` | `https://mimibot.id.vn` | URL chính thức của website |
| `NEXT_PUBLIC_DISCORD_SUPPORT_URL` | `https://discord.gg/q8CfajzPuc` | Link Discord hỗ trợ |
| `MIMI_API_HOST` | `http://ip-caching-or-vibehost.com` | IP hoặc Domain công khai của Bot |
| `MIMI_API_PORT` | `4869` | Cổng Internal API mà Bot mở |
| `MIMI_API_TOKEN` | `chuỗi-token-bí-mật` | Token bảo mật khớp với Bot |

---

## 6. Khởi Động Lại (Restart Application)

1. Sau khi đã `npm run build` thành công và khai báo biến môi trường:
2. Nhấp nút **Restart** (icon nút nguồn/xoay tròn) trong mục **Setup Node.js App**.
3. Phusion Passenger sẽ nạp lại file `server.js`.
4. Mở trình duyệt truy cập vào `https://mimibot.id.vn` để kiểm tra kết quả!

---

## 7. Giải Quyết Lỗi Thường Gặp (Troubleshooting)

- **Lỗi 503 / Application Not Starting**: Kiểm tra lại xem bạn đã chạy `npm run build` chưa. File `server.js` cần thư mục `.next/` đã được build trước để phục vụ.
- **Không điều khiển được nhạc trên Dashboard**: Kiểm tra biến `MIMI_API_HOST`, `MIMI_API_PORT`, `MIMI_API_TOKEN`. Đảm bảo VPS chạy Bot đã mở tường lửa (Firewall) cho cổng API đó để Web cPanel có thể kết nối.
