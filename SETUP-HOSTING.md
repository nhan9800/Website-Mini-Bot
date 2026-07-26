# Setup Hosting Nhân Hòa — làm một lần, sau đó push là tự lên

> Làm theo đúng thứ tự. Mỗi bước có cách kiểm tra "đúng chưa" ngay sau đó, để không đi tiếp với một bước sai.
>
> Nếu gói hosting **không có Terminal/SSH**, xem [Phụ lục B](#phụ-lục-b--không-có-terminal).

---

## Bối cảnh: chuyện gì đang xảy ra

`mimibot.id.vn` hiện chạy một bản Next.js **upload tay** từ dự án cũ. Nó không nối với repo nào, nên push code lên GitHub không làm site đổi.

Sau khi làm xong tài liệu này, chuỗi sẽ là:

```
push main → GitHub Actions build → nhánh `deploy` → cron trên hosting kéo về → site đổi
```

GitHub Actions **đã chạy được rồi** — nhánh `deploy` đã tồn tại và có bản dựng sẵn. Việc còn lại nằm hết ở phía cPanel.

---

## Cách nhanh — một lệnh làm gần hết

Nếu hosting có **Terminal**, không cần làm thủ công từng bước. Mở Terminal và chạy:

```bash
cd ~ && git clone -b deploy --depth 1 https://github.com/nhan9800/Website-Mini-Bot.git .mimi-setup && bash .mimi-setup/scripts/bootstrap-host.sh
```

Lệnh này **chưa xoá gì cả** — nó chỉ in ra kế hoạch để bạn đọc trước. Xem xong, nếu đồng ý thì chạy lại kèm `--yes`, và khai tên thư mục app cũ cần dọn:

```bash
bash ~/.mimi-setup/scripts/bootstrap-host.sh --yes
```

> Script tự nhận ra app Node sẵn có và GIỮ LẠI môi trường Node của nó (môi trường này chỉ tạo lại được qua giao diện cPanel). Muốn dọn luôn thư mục app cũ khác thì thêm `--remove-old TÊN_THƯ_MỤC`.

Script tự làm: dọn bản cũ → tải nhánh `deploy` → tạo app Node (nếu host có CLI) → `npm ci --omit=dev` → restart → kiểm tra `/api/version`. Chỗ nào không tự làm được, nó dừng lại và in đúng thông tin cần điền vào giao diện cPanel, rồi bạn chạy lại chính lệnh đó để đi tiếp — chạy nhiều lần vô hại.

Hai việc script **cố ý không làm**, bạn phải tự làm trong giao diện:
- Đặt `MIMI_API_TOKEN` (không truyền secret qua dòng lệnh, tránh lưu vào lịch sử shell).
- Thêm Cron Job tự động kéo code.

Chống xoá nhầm: script chỉ xoá thư mục nằm **bên trong** thư mục nhà, và từ chối thẳng `public_html`, `mail`, `tmp`, `.ssh`, hay bất kỳ đường dẫn nào trỏ ngược ra ngoài (`..`, `.`). Đã test các trường hợp này.

Dọn thư mục cài đặt sau khi xong: `rm -rf ~/.mimi-setup`

---

## Bước 0 — Kiểm tra gói hosting có đủ điều kiện

Đăng nhập cPanel Nhân Hòa, tìm trong ô Search:

| Cần có | Nằm ở nhóm | Nếu không thấy |
| :--- | :--- | :--- |
| **Setup Node.js App** | Software | Gói không hỗ trợ Node — phải nâng cấp, không có cách khác |
| **Terminal** | Advanced | Dùng [Phụ lục B](#phụ-lục-b--không-có-terminal) |
| **Cron Jobs** | Advanced | Dùng Git Version Control + bấm tay mỗi lần deploy |
| **Git™ Version Control** | Files | Không bắt buộc nếu có Terminal |

---

## Bước 1 — Xác định thư mục đang phục vụ tên miền

Đừng đoán — hỏi thẳng cấu hình Passenger:

```bash
grep -i passenger ~/public_html/.htaccess
```

Dòng `PassengerAppRoot` chỉ đích danh thư mục đang chạy site, `PassengerStartupFile` cho biết file khởi động. Ví dụ trên hosting Nhân Hòa hiện tại:

```
PassengerAppRoot "/home/nhmimjcc/website-mini-bot"
PassengerStartupFile server.js
```

Nghĩa là app Node **đã tồn tại sẵn** với app root `website-mini-bot`. Trường hợp này **không cần tạo app mới, không cần Destroy gì cả** — chỉ thay nội dung thư mục rồi restart. Bỏ qua Bước 3, đi thẳng tới Bước 2 rồi Bước 4.

Nếu `PassengerAppRoot` trỏ vào thư mục tên khác, dùng tên đó cho `--app-name` ở các lệnh sau. Nếu `~/nodevenv/` trống (chưa có app nào), làm Bước 3 để tạo mới.

---

## Bước 2 — Tải mã nguồn

Nếu app **đã tồn tại** (Bước 1), thư mục app đang có mã nguồn cũ. Thay bằng bản mới:

```bash
cd ~ && mv website-mini-bot website-mini-bot.bak && \
git clone -b deploy https://github.com/nhan9800/Website-Mini-Bot.git website-mini-bot
```

Đổi tên thay vì xoá — còn bản cũ để quay lại nếu cần. Xong xuôi rồi dọn ở Bước 7.

Nếu app **chưa tồn tại**, chạy bước này trước Bước 3 (cPanel tạo app sẽ sinh sẵn file mẫu, khiến `git clone` sau đó báo "destination path already exists"):

```bash
cd ~ && git clone -b deploy https://github.com/nhan9800/Website-Mini-Bot.git website-mini-bot
```

**Kiểm tra** — lệnh sau phải in ra một chuỗi ngẫu nhiên, không được trống:

```bash
cat ~/website-mini-bot/.next/BUILD_ID
```

Trống nghĩa là đang ở nhầm nhánh `main`. Sửa bằng:

```bash
cd ~/website-mini-bot && git checkout deploy && git reset --hard origin/deploy
```

---

## Bước 3 — Tạo Node.js App

**Setup Node.js App** → **Create Application**:

| Ô | Điền |
| :--- | :--- |
| Node.js version | `20.x` (hoặc `18.x` nếu không có 20) |
| Application mode | `Production` |
| Application root | `website-mini-bot` |
| Application URL | `mimibot.id.vn` |
| Application startup file | `server.js` (mặc định, không cần đổi) |

> Dự án có sẵn cả `server.js` lẫn `server.cjs`, nội dung giống hệt nhau và đều là CommonJS — để tên nào Passenger cũng nạp được, không cần đụng vào ô này.

Bấm **Create**.

**Kiểm tra:** thư mục `~/nodevenv/website-mini-bot/` phải xuất hiện:

```bash
ls ~/nodevenv/website-mini-bot/
```

---

## Bước 4 — Khai báo biến môi trường

Vẫn trong **Setup Node.js App**, mở app vừa tạo → mục **Environment variables** → thêm 3 biến:

| Tên | Giá trị |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MIMI_API_BASE` | `http://hcm3.vibehost.vn:20019` |
| `MIMI_API_TOKEN` | *chuỗi token bí mật* — **phải khớp** `mimiApiToken` trong `config.json` của bot bên VibeHost |

`MIMI_API_TOKEN` sai hoặc thiếu thì trang chủ hiện "Đang đồng bộ" và Dashboard báo lỗi — đúng triệu chứng site đang gặp lúc này.

Bấm **Save**.

---

## Bước 5 — Cài thư viện rồi khởi động

Trong **Terminal**:

```bash
source ~/nodevenv/website-mini-bot/*/bin/activate
cd ~/website-mini-bot
npm ci --omit=dev --no-audit --no-fund
mkdir -p tmp && touch tmp/restart.txt
```

> Dùng `npm ci`, **không** dùng `npm install` — `npm install` sửa `package-lock.json` làm bẩn cây git, lần kéo code sau sẽ vướng lỗi "local changes would be overwritten".
>
> **Tuyệt đối không chạy `npm run build`** trên host: RAM 2GB sẽ bị OOM `Killed` và làm hỏng luôn bản `.next` đang chạy. Bản dựng đã có sẵn trong nhánh `deploy`.

**Kiểm tra** — đây là bước quan trọng nhất:

```bash
curl -s https://mimibot.id.vn/api/version
```

Phải ra dạng:

```json
{"ok":true,"commit":"d9b22c5...","shortCommit":"d9b22c5","branch":"main","builtAt":"..."}
```

Thấy `shortCommit` là xong — site đang chạy đúng bản từ pipeline. Nếu `commit` là `"dev"` thì đang chạy bản build tay, chưa phải bản từ Actions.

---

## Bước 6 — Bật tự động kéo code

Đến đây site đã chạy, nhưng mỗi lần push vẫn phải vào Terminal kéo tay. Thêm cron để tự động.

**Cron Jobs** → **Add New Cron Job**:

- **Common Settings**: `Twice Per Hour` (hoặc gõ tay `*/5 * * * *` để 5 phút một lần)
- **Command**:

```bash
bash $HOME/website-mini-bot/scripts/host-pull.sh >> $HOME/mimi-deploy.log 2>&1
```

Script tự so commit: không có gì mới thì thoát ngay, có bản mới thì `git reset --hard`, kiểm tra `.next`, `npm ci`, rồi restart Passenger. Chạy lại nhiều lần vô hại.

**Kiểm tra:** đợi qua một chu kỳ rồi xem log:

```bash
cat ~/mimi-deploy.log
```

Không có dòng nào là đúng (nghĩa là không có bản mới). Có lỗi thì log sẽ ghi rõ.

---

## Bước 7 — Dọn thư mục cũ (làm sau khi site mới chạy ổn vài ngày)

```bash
ls ~   # xem còn thư mục cũ nào
```

Chắc chắn site mới đã chạy ổn rồi hãy xoá:

```bash
rm -rf ~/website-mini-bot.bak     # bản cũ đã đổi tên ở Bước 2
```

---

## Từ giờ trở đi

Ở máy dev chỉ cần:

```bash
git add -A && git commit -m "..." && git push
```

Rồi kiểm tra bằng một lệnh (chạy ở thư mục gốc dự án trên máy dev):

```bash
node scripts/check-deploy.mjs
```

---

## Khi có trục trặc

| Hiện tượng | Nguyên nhân | Cách sửa |
| :--- | :--- | :--- |
| 503 / Application Not Starting | thiếu node_modules | Chạy lại `npm ci --omit=dev` trong nodevenv rồi Restart |
| Trang trắng, `_next/static/*` lỗi 500 | đang ở nhánh `main` (không có `.next`) | `git checkout deploy && git reset --hard origin/deploy` |
| `/api/version` trả `"dev"` | đang chạy bản build tay | Kéo lại từ nhánh `deploy` |
| `/api/version` báo 404 | code cũ hơn 26/07/2026 | Kéo lại từ nhánh `deploy` |
| Trang chủ hiện "Đang đồng bộ" | thiếu/sai `MIMI_API_TOKEN` | Bước 4, rồi Restart |
| `refusing to merge unrelated histories` | nhánh `deploy` đã bị dựng lại | `cd ~ && rm -rf website-mini-bot` rồi làm lại Bước 2 |
| `local changes would be overwritten` | đã lỡ chạy `npm install` | `git reset --hard origin/deploy`, sau này dùng `npm ci` |
| cron không chạy | sai đường dẫn app root | Sửa đường dẫn trong lệnh cron cho khớp thư mục thật |

---

## Phụ lục A — Dùng Git Version Control thay Terminal

Nếu thích giao diện hơn dòng lệnh:

1. **Git™ Version Control** → **Create**
   - Clone URL: `https://github.com/nhan9800/Website-Mini-Bot.git`
   - Repository Path: `website-mini-bot`
2. Vào **Manage** → đổi **Checked-Out Branch** sang **`deploy`**.
3. Tab **Pull or Deploy** → bấm **Update from Remote**, rồi **Deploy HEAD Commit**.

Bước 3 sẽ chạy `.cpanel.yml` có sẵn trong repo (kiểm tra `.next`, `npm ci`, restart). Vẫn cần Bước 3–4 ở trên để tạo Node.js App và khai báo biến môi trường.

Nếu trong **Manage** có mục **Webhook URL**, copy nó rồi dán vào GitHub → repo web → **Settings → Webhooks → Add webhook** (Content type `application/json`, *Just the push event*) để khỏi cần cron.

---

## Phụ lục B — Không có Terminal

Toàn bộ vẫn làm được qua giao diện:

1. Bước 2 → thay bằng **Phụ lục A** (Git Version Control lo việc clone).
2. Bước 5 `npm ci` → trong **Setup Node.js App**, bấm nút **Run NPM Install**. Nút này chạy `npm install`; sau đó cứ mỗi lần deploy nhớ dùng **Deploy HEAD Commit** (chạy `.cpanel.yml` với `npm ci`) để cây git không bị bẩn.
3. Bước 6 → nếu không có Cron Jobs, dùng webhook ở Phụ lục A, hoặc bấm **Update from Remote** thủ công mỗi lần deploy.
