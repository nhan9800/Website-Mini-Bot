import React from 'react';
import { History, Sparkles, Shield, Music, Clock } from 'lucide-react';

const releases = [
  {
    version: 'v2.0.0 (Web Ecosystem Complete Rebuild)',
    date: '26/07/2026',
    tag: 'Major Update',
    items: [
      'Rebuild 100% Website-Mini-Bot từ A-Z với giao diện Ultra-Premium Dark Mode, Glassmorphism và micro-animations Framer Motion.',
      'Tách biệt hoàn toàn kho chứa code giữa Bot Discord (D-n-MimiBot) và Web (Website-Mini-Bot).',
      'Bảng điều khiển âm nhạc thời gian thực (Dashboard realtime) cho phép xem sóng âm thanh, chỉnh âm lượng 150%, xóa bài trong hàng chờ.',
      'Tương thích tuyệt đối với cPanel Nhân Hòa Node.js App thông qua Phusion Passenger (server.js tối ưu hoá).',
    ],
  },
  {
    version: 'v1.1.0 (Bot Core Enhancement)',
    date: '15/07/2026',
    tag: 'Feature Release',
    items: [
      'Hệ thống xác thực 24h tự động reset role vào 00:00 UTC+7 (múi giờ Việt Nam).',
      'Hệ thống chấm công nhân sự độc lập hoàn toàn với xác thực (/setupattendance, /attendance).',
      'Cảnh báo Economy bất thường: phát hiện thu nhập > 5.000.000 xu/ngày và báo tới Bot Owner.',
      'Tích hợp Internal API bảo mật với Bearer token cho phép kết nối điều khiển nhạc từ Web Dashboard.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mimi-green/10 border border-mimi-green/30 text-mimi-green text-xs font-semibold uppercase tracking-wide">
            <History className="w-3.5 h-3.5" />
            <span>Lịch Sử Cập Nhật</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Nhật Ký Thay Đổi <span className="text-gradient-mimi">Mimi Ecosystem</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Theo dõi từng bước phát triển và cải tiến của hệ sinh thái âm nhạc và cộng đồng Mimi.
          </p>
        </div>

        <div className="space-y-8">
          {releases.map((rel, idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-8 space-y-5 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">{rel.version}</h2>
                  <p className="text-xs text-gray-400 font-mono">Ngày phát hành: {rel.date}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-mimi-green/20 text-mimi-green text-xs font-bold uppercase">
                  {rel.tag}
                </span>
              </div>

              <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                {rel.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-mimi-green shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
