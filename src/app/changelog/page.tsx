import React from 'react';
import type { Metadata } from 'next';
import { History, Sparkles, Wrench, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nhật Ký Thay Đổi',
  description: 'Lịch sử cập nhật của hệ sinh thái Mimi Bot — bot nhạc Discord và website dashboard.',
};

const releases = [
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
          {releases.map((rel) => {
            const Icon = rel.icon;
            return (
              <div key={rel.version} className="relative sm:pl-20">
                <div className="absolute left-0 top-8 hidden h-[52px] w-[52px] items-center justify-center rounded-2xl border border-mimi-green/30 bg-[#0b0d1c] text-mimi-green shadow-glow sm:flex">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="glass-panel card-lift space-y-5 rounded-3xl p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white sm:text-2xl">{rel.version}</h2>
                      <p className="font-mono text-xs text-gray-400">Phát hành: {rel.date}</p>
                    </div>
                    <span className="rounded-full bg-mimi-green/20 px-3 py-1 text-xs font-bold uppercase text-mimi-green">
                      {rel.tag}
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
                    {rel.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mimi-green" />
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
