# Website MIMI 2.5.0

## Môi trường

Yêu cầu Node.js **22.12.0 trở lên** ở máy phát triển, CI và nodevenv hosting. Bản này dùng Next.js 15.5.27, React 19.3, React Three Fiber 9 và Drei 10 theo [hướng dẫn App Router của Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15). Giữ giao diện và tính năng hiện có; tham số route được chuyển sang API bất đồng bộ của Next.js 15. Website 2.5.0 đã triển khai ngày 17/10/2026; `/api/version` xác nhận source `271a357`, build run 82. cPanel Passenger đã chuyển sang Node 22.23.0.

Đợt 02/10/2026 làm mới header/footer, trang chủ, nhật ký cập nhật và hướng dẫn cộng đồng; hỗ trợ giao diện sáng/tối, giảm chuyển động và phân biệt rõ Mimi Bot miễn phí với Mimi Shield trả phí. `src/lib/release-info.ts` là nguồn phiên bản/ngày phát hành chung; `package.json`, header, nhật ký và `/api/version` phải đồng bộ. API phiên bản vẫn trả metadata commit bản dựng thật để kiểm chứng deploy.

Next.js được giữ ở nhánh 15; PostCSS nội bộ có override riêng lên 8.5.28 để sửa cảnh báo bảo mật, cùng Nanoid 3.3.19 trong lockfile. `npm audit` không còn lỗ hổng được registry công bố trong lần kiểm tra ngày 02/10/2026; kiểm tra lại trước các lần phát hành sau.

## Cấu hình

Sao chép `.env.example` thành `.env.local` ở máy phát triển hoặc đặt biến môi trường trên hosting. Không commit token hoặc khoá thật.

- `MIMI_API_BASE` và `MIMI_API_TOKEN`: kết nối tới Internal API của bot; token phải khớp phía bot.
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: đăng nhập Discord. Khi thiếu cấu hình, API đăng nhập trả trạng thái 503. Khoá ký cần một giá trị ngẫu nhiên riêng cho môi trường triển khai.
- `ADMIN_SECRET`: khoá riêng của bảng duyệt Admin, được web kiểm tra trước khi chuyển yêu cầu tới bot. Không đặt biến này thì chức năng Admin bị vô hiệu hóa.
- `MIMI_FEEDBACK_STORE`: đường dẫn tuyệt đối đến kho đánh giá bền vững, ngoài thư mục triển khai. Mặc định dùng `data/mimi_feedback_store.json`; cần giữ thư mục `data/` qua các lần cập nhật và sao lưu theo vận hành hosting.

`npm run build` nạp `.env.local` trước bước migration, giống lúc Next.js khởi động. Lệnh CLI migration không cần khởi chạy website. `npm run build` chạy bước bảo toàn đánh giá thật trong kho `.next` cũ trước khi rebuild. Dữ liệu mẫu bị loại; cờ xác minh do client tự khai trong bản cũ không được giữ. Kho mới đã có sẽ không bị ghi đè. Build dừng nếu kho cũ bị hỏng để tránh làm mất dữ liệu. Khi triển khai artifact build sẵn vào hosting cũ, chạy `node scripts/migrate-feedback.cjs` trên host trước khi thay thế `.next`, hoặc sao lưu/chuyển kho đánh giá sang đường dẫn `MIMI_FEEDBACK_STORE`.

Điểm đánh giá, đội ngũ và trạng thái xác minh hiển thị theo dữ liệu thật. Khi bot không kết nối, website trả trạng thái chưa có dữ liệu thay vì tạo thông tin thay thế.

## Kiểm tra trước khi triển khai

```text
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Các bài kiểm tra API chạy với mock ngoại tuyến, không gọi bot, OAuth hoặc gửi đánh giá thật. Build bắt buộc vượt qua TypeScript và ESLint. Quy trình triển khai và khởi động lại hosting là bước vận hành riêng.

Trang Lệnh dùng danh mục trực tiếp khi API trả dữ liệu; khi chưa tải được API, trang ghi rõ bản chụp từ mã nguồn. Đợt này snapshot **99 lệnh** được dựng từ mã Mimi local 1.4.0; đây không phải bằng chứng mã bot đã deploy. Sau khi đổi đăng ký slash command trong bot, chạy từ thư mục website: `node scripts/snapshot-commands.cjs ../D-n-MimiBot` rồi kiểm tra bằng `node scripts/snapshot-commands.cjs ../D-n-MimiBot --check`. Thay đường dẫn nếu kho bot ở nơi khác và cài dependencies của bot trước. Script chỉ thực thi riêng khai báo lệnh với builder thật của Discord.js; không chạy entrypoint, đăng nhập hoặc gọi Discord.

## Hosting cPanel

Pull request chạy workflow **Kiểm tra và đóng gói website** để tạo gói Linux
`mimi-website-2.5.0.tar.gz` và checksum, sau typecheck/lint/test/build,
audit dependency production và kiểm tra khởi động khi đã bỏ dependency build.
Gói không chứa dependency đã cài, cache build, cấu hình riêng hoặc dữ liệu đánh giá.
Workflow này chỉ tạo artifact để kiểm tra; không đẩy nhánh `deploy` hoặc restart host.
Chỉ đưa gói lên hosting sau khi xác nhận Node phù hợp và sao lưu/migrate dữ liệu cũ.

Tailwind, PostCSS, TypeScript và các gói kiểu chỉ dùng khi phát triển/build, nên đặt
trong `devDependencies`; hosting nhận build sẵn và cài bằng `npm ci --omit=dev`.
Ngày 03/10/2026, audit đầy đủ ghi nhận cảnh báo
[braces GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
qua công cụ build Tailwind/ESLint, chưa có bản vá npm. Audit production không còn
cảnh báo này sau khi tách công cụ build. Báo cáo đầy đủ được lưu cùng artifact;
cảnh báo build vẫn còn, không được coi là đã vá. CI dùng mẫu glob từ source repo,
không nhận mẫu glob từ request người dùng; cập nhật công cụ khi upstream có bản vá.

Workflow dùng Node.js 22 và dựng artifact trên GitHub Actions. Hosting phải chọn nodevenv Node.js 22.12+ trước khi cập nhật; `.cpanel.yml` chạy `scripts/install-runtime.sh` và migration trước khi yêu cầu Passenger khởi động lại. Không build trên host giới hạn RAM.

CloudLinux bọc lệnh npm và đổi prefix sang `nodevenv/<app>/<major>/lib`; wrapper chỉ tự chép manifest. `install-runtime.sh` chép cả lockfile vào prefix trước `npm ci --omit=dev`, giữ symlink `node_modules` và xác minh phiên bản dependency trực tiếp theo lockfile. Script không đổi manifest/lockfile trong checkout, không dùng `--force` hoặc `--legacy-peer-deps`. Nếu hash lockfile và runtime đã khớp, giữ nguyên dependencies để tránh cài lại khi chỉ sửa giao diện. Folder vật lý hoặc symlink sai Node bị từ chối, không tự xoá hay thay đích. `tmp/` và `stderr.log` được Git bỏ qua vì thuộc Passenger.

Ngày 17/10/2026, audit production không có cảnh báo; audit đầy đủ còn 7 high và 2 moderate ở cây công cụ phát triển. Kho legacy trên host được sao lưu nguyên trạng (SHA-256 `66076977dc0ebe8a064d67b7b3c4326c01ad3b6742c7601c3425dfa542272e73`) và migrate sang `data/`; API xác nhận 19 đánh giá thật. Không khôi phục seed ID 1–4 hoặc cờ verified do client cũ tự khai.

Giữ `.env.local`, `data/` và kho `MIMI_FEEDBACK_STORE` ngoài artifact. Trước lần cập nhật đầu tiên từ bản cũ, sao lưu rồi chạy migration khi `.next` cũ còn nguyên. Task cPanel sau pull chỉ chuyển được kho cũ nếu file `.next/mimi_feedback_store.json` vẫn còn; task đó không thể phục hồi file đã bị xoá hoặc bị deployment ghi đè.

`scripts/host-pull.sh` chỉ cập nhật checkout sạch đang ở nhánh `deploy` với lịch sử tiến thẳng. Trước khi đổi checkout, script kiểm tra artifact và Node.js 22.12+, sao lưu kho đánh giá cũ vào `$HOME/mimi-deploy-backups/<tên-app>/`, rồi chạy migration của bản sắp triển khai trong thư mục ứng dụng để đọc đúng `.env.local`. Artifact chứa `.env`, `data/`, `tmp/`, `node_modules/` hoặc kho đánh giá trong `.next` bị từ chối; dữ liệu runtime và file không theo dõi được giữ nguyên. Lần chuyển đầu tiên từ cron cũ vẫn cần sao lưu/migration trước khi chạy cron hoặc pull; mã mới chưa lên host thì chưa thể bảo vệ lượt cập nhật đó.

Cron dùng khóa thư mục để tránh chạy đồng thời. Nếu `npm ci` lỗi sau khi checkout đã đổi, script giữ checkpoint `$HOME/.mimi-deploy-<tên-app>.pending` và chưa yêu cầu restart; lượt cron tiếp theo thử hoàn tất đúng bản dựng đó. Đây chưa phải triển khai atomic: dependency có thể đã bị thay một phần khi cài lỗi, nên cần kiểm tra dịch vụ và xử lý checkpoint khi tiến trình bị ngắt. Script không tự reset hay rollback; thay đổi mã nguồn trên host hoặc lịch sử phân nhánh cần được xử lý riêng. Không dùng `bootstrap-host.sh --yes` cho cập nhật thường vì công cụ dựng lại xóa thư mục ứng dụng, gồm cấu hình/dữ liệu bên trong.
