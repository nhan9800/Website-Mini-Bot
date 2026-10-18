# Creative Engine — Mimi website

Storyboard triển khai tiếp ngày 18/10/2026. Đây là bản ghi bền vững từ các yêu cầu và cấu trúc website hiện hành; các bản audit cũ chưa lưu một storyboard riêng. Chỉ coi bản live hoàn tất sau khi kiểm tra commit ở `/api/version` và lưu receipt.

## Nhịp chuyển động theo section

| Section | Câu chuyện / kỹ thuật | Trigger và nhịp |
| --- | --- | --- |
| Hero | Hai dòng chữ mở bằng mask; sân khấu robot GLB tự nhảy/vẫy tay | Mask 760ms, Expo Out `(0.19,1,0.22,1)`; 3D tự chạy, dừng render khi khuất màn hình/ẩn tab |
| Số liệu thật | Odometer chuyển giá trị khi API cập nhật | Spring stiffness280/damping24; không tạo số liệu mẫu |
| Top nhạc | Đĩa quay, equalizer biểu thị bản nghe thử; danh sách cuộn riêng | Preview audio điều khiển trạng thái; đĩa/equalizer thương hiệu giữ chuyển động theo yêu cầu desktop/mobile |
| Tính năng | Bốn chương có sơ đồ riêng; desktop giữ sân khấu và dịch ngang theo cuộn dọc | `useScroll` + `useTransform`, một pixel cuộn bằng một pixel dịch; desktop ≥1024×650, chuyển về bố cục dọc trên màn hình nhỏ/thấp |
| Về Mimi | Thanh đọc được vẽ theo tiến trình; nội dung trôi nhẹ 28px qua cả section | Tiến trình từ đầu section ở 80% viewport đến cuối ở 35%; cuộn ngược đảo chuyển động |
| Đội ngũ | Founder huy chương vàng, Developer terminal xanh; hai ID vinh danh riêng | Founder clip, Developer flip, easing `(0.16,1,0.3,1)`; không suy ra người vinh danh từ tên role |
| Đánh giá | Các thẻ trích dẫn xuất hiện theo nhịp; dữ liệu đồng bộ từ kho thật | Reveal theo viewport; hủy request khi rời trang |
| FAQ | Bảng trả lời mở theo chiều nội dung, icon xoay | Spring stiffness300/damping30; nút giữ ARIA expanded/controls |
| Lời mời cuối trang | CTA từ tính và chuyển lớp nền | Spring cho pointer, không thay vị trí hit target của các luồng quản trị |
| Footer | Đường SVG vừa vẽ vừa đổi độ cong khi người đọc tới chân trang | Scroll-linked `pathLength` và `d`, không chạy hết animation từ lúc mở trang |

## Cuộn và tương tác nhỏ

- Lenis chỉ chạy ở trang chủ, desktop con trỏ chính xác và chế độ hệ thống cho phép nội suy. Touch và reduced-motion giữ cuộn gốc; phần scrubbing theo cuộn vẫn hoạt động. Không đổi cài đặt hệ điều hành.
- `lerp:0.14`; các vùng chart, model, thẻ tính năng cần cuộn riêng, form và dialog giữ input gốc. Chapter/keyboard gửi `mimi:scroll-to`, đồng bộ target của Lenis hoặc dùng native instant fallback.
- Con trỏ bổ trợ là vòng mint với spring360/31/mass0.4, mở rộng trên link/nút, ẩn ở input/canvas/dialog; con trỏ gốc vẫn hiện. Không chạy trên touch/reduced-motion.
- Khi rời trang/đổi breakpoint: hủy Lenis, RAF, media listeners, observers và pointer handlers. Ẩn tab hoặc mở modal: dừng scroll interpolation; đóng modal tiếp tục cuộn.
- Modal dùng portal phía trên header/player, quản lý focus, Escape và khóa cuộn. Enter chỉ kích hoạt nút/form đang được focus; không có xác nhận toàn cục.
- Dùng transition theo thuộc tính cụ thể, không `transition-all`. Không thêm GSAP khi Framer Motion đang đáp ứng timeline/scroll cần thiết.

## Kiểm chứng bắt buộc

Desktop cuộn xuôi/ngược qua từng chương, chapter bằng chuột/phím; mobile dọc, chart cuộn riêng, modal ở màn hình thấp; sáng/tối; route đi/đến không nhân đôi listener hoặc giữ Lenis; robot luôn tự chạy. Chạy typecheck/lint/test/build/audit trước deploy. Không tạo review, giao dịch hoặc phiên Discord thật để thử giao diện.

Nguồn kỹ thuật: [Motion useScroll](https://motion.dev/docs/react-use-scroll), [Motion useTransform](https://motion.dev/docs/react-use-transform), [Lenis](https://github.com/darkroomengineering/lenis). Receipt và kết quả live được ghi vào `WORKSPACE.md`/`PROJECT_MEMORY.md` sau triển khai.
