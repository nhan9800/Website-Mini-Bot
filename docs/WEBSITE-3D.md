# Mimi 2.6.0: không gian âm nhạc 3D

## Yêu cầu hiện hành: tự chuyển động, không công tắc — 17/10/2026

Chủ website yêu cầu model tự chuyển động mặc định và không có nút bật/tắt. Cảnh 3D hiện tự tải trên cả desktop/mobile, bỏ Khám phá 3D, Bật chuyển động và Tạm dừng; không để lựa chọn reduced-motion của hệ thống chặn model theo yêu cầu trực tiếp này. Nút chọn model và đổi Dance/Wave vẫn hoạt động, không tắt chuyển động. Khi cảnh khuất màn hình hoặc ẩn tab, chỉ dừng render để tiết kiệm GPU và tự tiếp tục khi quay lại. Các mô tả chế độ opt-in/pause bên dưới là lịch sử thiết kế trước yêu cầu này.

## Hướng thiết kế

Làm lại diện mạo, giữ nhận diện mint, logo Mimi, Be Vietnam Pro và các URL/luồng quản trị hiện có. DESIGN_VARIANCE 7, MOTION_INTENSITY 7, VISUAL_DENSITY 4. Cảnh 3D có chức năng giới thiệu bot và mời người xem tương tác; các phần đọc nội dung không có vòng lặp chuyển động trang trí.

## Audit trước khi sửa

- Trang chủ bản 2.5.0 là bố cục hai cột, bên phải chỉ còn logo khi giảm chuyển động; không có mô hình để khám phá ở trạng thái đó.
- Cảnh vinyl cũ có pointer-events-none, camera parallax không nhận tương tác trực tiếp. Nhiều canvas đội ngũ chạy liên tục; màu tím/cyan không đồng nhất với mint.
- Giữ: dữ liệu trạng thái thật, 99 lệnh, chart Apple Music, review, đội ngũ, theme toggle, dashboard key và các URL/anchor.
- Thay: hero, sân khấu 3D, hình khối tính năng, nhịp bố cục và giao diện chung. Không đổi logo, điều khoản, thanh toán hoặc quyền truy cập.

## Nguồn và kỹ thuật

- https://threejs.org/ và mẫu https://threejs.org/examples/webgl_animation_skinning_morph.html
- RobotExpressive: Tomás Laulhé (Quaternius), chỉnh morph/conversion bởi Don McCurdy, CC0 1.0. Model lấy từ bộ examples Three.js, phối lại Main=mint/Grey=silver trong runtime; không nhận là nhân vật nguyên bản do Mimi tạo.
- Headphones: CreativeTrio, https://poly.pizza/m/PSsWSIAYIL, CC0 1.0. File GLB được lưu local, không hotlink runtime.
- Đĩa nhạc: geometry Three.js trong dự án. Robot dùng animation GLB thật Dance/Wave, đĩa quay, tai nghe trôi nhẹ; đều có pause.
- Áp dụng https://r3f.docs.pmnd.rs/advanced/scaling-performance và /api/hooks: mutate qua useFrame, chặn delta lớn, một canvas, DPR<=1.5, demand khi pause/ẩn, không cập nhật React state mỗi frame.
- Poster dự phòng được tạo bằng imagegen built-in từ logo tham chiếu, lưu public/images/mimi-studio.webp. Prompt: mint vinyl turntable, graphite headphones, red-blue Mimi helmet; polished isometric 3D still life, transparent, no text. Đây là ảnh minh họa khi WebGL không khả dụng, không phải model tương tác.

## Kiểm tra trước phát hành

Chạy typecheck/lint/test/build/audit. Xem desktop/mobile, sáng/tối, giảm chuyển động, 3 mô hình, pause/đổi animation, menu/FAQ/tìm lệnh; kiểm dữ liệu review trước/sau deploy. Chỉ xác nhận các kiểm tra đã có bằng chứng trong checkpoint cuối.
## Kết quả local ngày 17/10/2026

31/31 kiểm thử đạt, typecheck/lint/build đạt. Model robot đã sửa lỗi đo bounds của skeleton clone; đo scene gốc đã nạp để giữ tỷ lệ đúng. Tai nghe dùng shader đổi vỏ sang mint, giữ đệm tai đen. Đã kiểm tương tác Wave/Dance/pause, chọn 3 model và kéo xoay thật, sáng/tối và viewport 390x844; menu và lọc nowplaying hoạt động.

Lighthouse mobile local (CPU/network mô phỏng): performance 80, accessibility 96, best practices 96, SEO 100, TBT 20ms, CLS 0.001, LCP 4.5s. Lượt đầu performance 61/TBT 530ms/LCP 6.1s. Đã giảm ảnh chart 400px xuống 96px, poster mobile 33.8KB và chỉ tải 3D khi tương tác trên điện thoại; desktop tự tải. Cảnh báo tương phản cuối ở chữ nhãn logo đã sửa gray500 thành gray400 sau lượt audit. Console lỗi local là OAuth chưa cấu hình, không dùng tài khoản thật để kiểm. Đây không phải Core Web Vitals của người dùng production; chưa đạt mục tiêu LCP 2.5s trong lab mobile.

Bổ sung theo yêu cầu chuyển động: chọn một model chủ động bật animation; lựa chọn của người xem được giữ trong phiên component, không bị thay bởi sự kiện hệ thống sau khi đã chọn. Wave/Dance crossfade 0,3 giây, có trạng thái đang nhảy/vẫy/quay và hướng dẫn khi giảm chuyển động. Test hành vi component kiểm mobile poster, click model/animation/pause và dừng khi khuất màn hình.

## Cache khi triển khai trên cPanel

Kiểm tra live phát hiện `/api/version` đã mới nhưng trang chủ vẫn cũ: `.next/server/route-cache` không được Git quản lý, khóa cache chỉ chứa route nên tồn tại qua fast-forward. File cache trang chủ 73.763 byte khớp hoàn toàn HTML công khai cũ, trong khi seed mới có `experience-stage`. Restart đơn thuần vẫn đọc lại cache đĩa này.

Hai startup Passenger xóa riêng response cache này trước `Next.prepare()`, kiểm BUILD_ID và từ chối đường dẫn symlink/ngoài app. Không đụng fetch cache, build seed, cấu hình hoặc kho đánh giá. Test dùng FileSystemCache thật của Next để tái hiện stale HTML/RSC rồi xác nhận đọc seed mới sau reset; thêm kiểm tra symlink và thứ tự startup. Đây vẫn là triển khai Git tại chỗ, không phải thay thế ứng dụng nguyên tử.

Sau bản sửa cache: full suite 34/34 đạt, typecheck/lint/build đạt; chạy production qua `server.cjs` trả HTTP200 và có scene mới. Audit production vẫn 0, đầy đủ 7 high + 2 moderate trong công cụ dev. Kết quả live và commit cuối được ghi riêng trong checkpoint/receipt sau khi hosting nạp.
