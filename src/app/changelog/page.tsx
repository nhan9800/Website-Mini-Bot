import React from 'react';
import type { Metadata } from 'next';
import { History, Sparkles, Wrench, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nhật Ký Thay Đổi',
  description: 'Lịch sử cập nhật của hệ sinh thái Mimi Bot — bot nhạc Discord và website dashboard.',
};

const releases = [
  {
    version: 'v2.3.0 — BXH LIVE, Role Discord Dev Team & Feedback Đồng Bộ',
    date: '27/07/2026',
    tag: 'Major Update',
    icon: Sparkles,
    items: [
      'Bảng Xếp Hạng Nhạc Việt LIVE ( Apple Music Vietnam): Kết nối trực tiếp 100% vào bảng xếp hạng iTunes/Apple Music chính thức tại Việt Nam (không cache tĩnh), thêm huy hiệu Apple Music VN và nhãn xu hướng #1 APPLE HIT, #2 HOT, #3 TREND.',
      'Tối ưu tự động nhận diện Đội Ngũ Đứng Sau MIMI: Đảm bảo 100% tự động load chính xác Avatar thật và Profile từ Discord của Founder Mimi (mi.mi2301) và Core Developer nhan9800 mà không phụ thuộc vào từ khóa tên role, loại bỏ hoàn toàn avatar mặc định.',
      'Liên Kết Tài Khoản Discord Khi Đánh Giá (Discord Account Linking): Khách hàng có thể nhập Discord Tag hoặc ID để xác thực tài khoản trực tiếp qua Bot Core, hiển thị Avatar thật và huy hiệu ✔ Verified Member trên các bài đánh giá.',
      'Đại tu trải nghiệm Đánh Giá & Góp Ý (Feedback UI): Thêm nút Đánh Giá phát sáng trên Header Navigation Bar ở mọi trang và chuyên mục "Khách Hàng Nói Gì Về MIMI BOT" rực rỡ ngay Trang Chủ.',
      'Hệ thống Đánh Giá & Phản Hồi Đồng Bộ: Nút floating nổi sang trọng trên toàn bộ website, hỗ trợ chấm điểm 1 - 5 sao và theo dõi đánh giá từ cộng đồng thời gian thực.',
      'Đại tu toàn bộ hệ thống icon: Chuyển đổi từ icon emoji 3D sang icon 2D Lucide có hộp viền mờ phát sáng (glassmorphism glow) cực kỳ đẳng cấp trên Status, Dashboard, BXH và Trang Chủ.',
      'Tích hợp cơ chế Smart Fallback an toàn 100% giúp website luôn mượt mà kể cả khi máy chủ bot đang khởi động lại hoặc chưa thiết lập cấu hình.',
    ],
  },
  {
    version: 'v2.2.0 — Hero 3D & Khoá Truy Cập Dashboard',
    date: '26/07/2026',
    tag: 'Major Update',
    icon: Rocket,
    items: [
      'Trang chủ có cảnh 3D WebGL thật: đĩa vinyl quay theo trục, vòng equalizer 44 thanh chuyển màu theo nhịp, nốt nhạc phát sáng bay lơ lửng và camera nghiêng theo chuột.',
      'Cảnh 3D tự tắt khi cuộn qua khỏi hero, tôn trọng tuỳ chọn "giảm chuyển động" của hệ điều hành, và quay về nền particles nếu máy không hỗ trợ WebGL.',
      'Dashboard nay yêu cầu khoá truy cập: gõ /dashboard trong Discord để nhận link riêng. Trước đây bất kỳ ai biết ID server đều điều khiển được nhạc và đổi cấu hình server lạ.',
      'Sửa 44 lỗi trong bot sau đợt rà soát toàn bộ mã nguồn: rò rỉ bộ nhớ, tiến trình tải nhạc mồ côi, nút Bỏ Qua không ăn khi bật Lặp Bài, và nhiều lỗi hàng chờ khác.',
      'Nâng Next.js lên 14.2.35 để vá các lỗ hổng bảo mật đã công bố.',
    ],
  },
  {
    version: 'v2.1.0 — Website Đại Tu & Kết Nối Dữ Liệu Thật',
    date: '26/07/2026',
    tag: 'Major Update',
    icon: Rocket,
    items: [
      'Thiết kế lại toàn bộ giao diện website: hero mới, nền aurora, hiệu ứng glassmorphism và animation mượt trên mọi trang.',
      'Dashboard kết nối Internal API THẬT của bot: xem bài đang phát, hàng chờ, điều khiển pause/skip/stop/volume trực tiếp từ trình duyệt.',
      'Trang Trạng Thái hiển thị số liệu thời gian thực (ping, uptime, số server, phiên voice) — không còn số liệu mô phỏng.',
      'Trang Lệnh tự đồng bộ danh sách slash command đang đăng ký trên Discord.',
      'Sửa lỗi build tràn RAM (OOM Killed) trên hosting cPanel: web được build sẵn, host chỉ cần pull về chạy.',
    ],
  },
  {
    version: 'v2.0.0 — Tách Riêng Web & Bot',
    date: '26/07/2026',
    tag: 'Rebuild',
    icon: Wrench,
    items: [
      'Tách kho mã nguồn giữa Bot Discord (D-n-MimiBot) và Website (Website-Mini-Bot).',
      'Chuyển website sang Next.js 14 App Router, chạy trên cPanel Nhân Hòa qua Phusion Passenger.',
      'Thêm Internal API bảo mật bằng Bearer token để web và bot giao tiếp giữa hai máy chủ.',
    ],
  },
  {
    version: 'v1.1.0 — Nâng Cấp Bot Core',
    date: '15/07/2026',
    tag: 'Feature Release',
    icon: Sparkles,
    items: [
      'Hệ thống xác thực 24h: tự động reset role vào 00:00 UTC+7 mỗi ngày.',
      'Chấm công nhân sự độc lập với xác thực: check-in/check-out, báo cáo tuần tự động.',
      'Cảnh báo Economy bất thường: phát hiện thu nhập trên 5.000.000 xu/ngày, báo Bot Owner qua DM.',
      'Nghe nhạc không cần API key: lời bài hát qua lrclib.net, nhận diện link Spotify qua oEmbed.',
      'Tự động thử lại client khác khi YouTube chặn tải nhạc (lỗi 403).',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green">
            <History className="h-3.5 w-3.5" />
            <span>Lịch sử cập nhật</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Nhật Ký Thay Đổi <span className="text-gradient-mimi">Mimi</span>
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            Theo dõi từng bước phát triển của hệ sinh thái âm nhạc và cộng đồng Mimi.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-8 before:absolute before:bottom-8 before:left-[26px] before:top-8 before:hidden before:w-px before:bg-gradient-to-b before:from-mimi-green/50 before:via-mimi-purple/30 before:to-transparent sm:before:block">
          {releases.map((rel, index) => {
            const Icon = rel.icon;
            const isLatest = index === 0;
            return (
              <div key={rel.version} className="relative sm:pl-20">
                <div
                  className={`absolute left-0 top-8 hidden h-[52px] w-[52px] items-center justify-center rounded-2xl border bg-[#0b0d1c] shadow-glow sm:flex ${
                    isLatest
                      ? 'border-mimi-green text-mimi-green shadow-[0_0_20px_rgba(46,204,113,0.5)]'
                      : 'border-white/20 text-gray-400'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div
                  className={`glass-panel card-lift space-y-5 rounded-3xl p-8 transition-all duration-500 ${
                    isLatest
                      ? 'border-mimi-green/50 bg-mimi-green/[0.04] shadow-[0_0_35px_rgba(46,204,113,0.25)]'
                      : 'hover:border-white/25'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl font-bold text-white sm:text-2xl">{rel.version}</h2>
                        {isLatest && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-mimi-green/40 bg-mimi-green/20 px-2.5 py-0.5 text-[11px] font-extrabold text-mimi-green shadow-[0_0_12px_rgba(46,204,113,0.3)]">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mimi-green opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-mimi-green"></span>
                            </span>
                            <span>MỚI NHẤT</span>
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-gray-400">Phát hành: {rel.date}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        isLatest
                          ? 'bg-mimi-green/20 text-mimi-green'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {rel.tag}
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
                    {rel.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Sparkles
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isLatest ? 'text-mimi-green' : 'text-mimi-purple'
                          }`}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
