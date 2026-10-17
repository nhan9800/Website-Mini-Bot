# Quy ước website Mimi

Repository Next.js của `mimibot.id.vn`, tách riêng khỏi bot Discord và Mimi Shield. Đọc `../WORKSPACE.md` và checkpoint `../D-n-MimiBot/docs/PROJECT_MEMORY.md` ở đầu phiên hoặc sau compact; cập nhật bằng chứng có ngày và bước đang chờ trước bàn giao.

- Giữ thay đổi chưa commit; không reset/clean hoặc ghi đè dữ liệu runtime.
- Website 2.5.0 dùng Node >=22.12.0. Kiểm tra `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm audit` trước triển khai. Test dùng mock/fixture, không gửi đánh giá hay OAuth thật.
- Phiên bản website ở `package.json` và `src/lib/release-info.ts` phải khớp; `/api/version` trả cả phiên bản và commit bản dựng thật. Không dùng phiên bản website làm phiên bản bot đang chạy.
- Mimi Bot cộng đồng miễn phí; Mimi Shield trả phí là sản phẩm riêng. Giữ route và các luồng dashboard/key/license; không gán số sao, đội ngũ hoặc số liệu trạng thái giả.
- Hosting website là cPanel/Passenger; VibeHost là hosting bot. Build artifact trong CI, không build trên hosting giới hạn RAM. Xác minh Node thực của Passenger và migration trước khi artifact đầu tiên thay `.next` cũ.
- Giữ `.env.local`, `data/`, `MIMI_FEEDBACK_STORE`; sao lưu/migrate `.next/mimi_feedback_store.json` trước thay `.next`. Không dùng `bootstrap-host.sh --yes` cho cập nhật thường, không chạy cron cũ chưa có migration.
- Không commit credential/config/kho đánh giá hoặc tự gửi broadcast Discord theo GEMINI.md. Triển khai được thực hiện trong phạm vi yêu cầu cập nhật website của người dùng; không suy rộng sang bot/Shield hoặc dịch vụ khác.
- Tiếng Việt có dấu, giữ logo và nhận diện mint, kiểm tra desktop/mobile và theme sáng/tối. Theo yêu cầu trực tiếp ngày 17/10/2026, các model 3D tự chuyển động cả desktop/mobile, không có công tắc hoặc thao tác bắt đầu, không để prefers-reduced-motion chặn model. Giữ dừng render khi khuất màn hình/ẩn tab để tiết kiệm GPU; các chuyển động CSS khác vẫn theo lựa chọn hệ thống.
