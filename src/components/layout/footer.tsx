import React from 'react';
import Link from 'next/link';
import { Heart, ExternalLink, Github, MessageSquare, Headphones } from 'lucide-react';
import { env } from '@/lib/env';

const exploreLinks = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/dashboard', label: 'Dashboard Điều Khiển' },
  { href: '/commands', label: 'Danh Sách Lệnh' },
  { href: '/status', label: 'Trạng Thái Hệ Thống' },
];

const legalLinks = [
  { href: '/privacy', label: 'Chính Sách Bảo Mật' },
  { href: '/terms', label: 'Điều Khoản Dịch Vụ' },
  { href: '/support', label: 'Trung Tâm Hỗ Trợ' },
  { href: '/changelog', label: 'Nhật Ký Thay Đổi' },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-28 border-t border-white/10 bg-[#05060f]/90 pb-10 pt-16 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Thương hiệu */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.webp" alt="Mimi Bot Logo" className="h-9 w-9 object-cover rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              <span className="text-lg font-extrabold tracking-tight text-white">Mimi Bot</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Bot nhạc Discord dành cho cộng đồng Việt Nam — âm thanh chất lượng cao,
              điều khiển bằng nút bấm hoặc dashboard web, quản trị minh bạch.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Máy chủ hỗ trợ Discord"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a
                href={env.NEXT_PUBLIC_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Kho mã nguồn GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Khám phá */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mimi-green">Khám Phá</h3>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pháp lý */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mimi-green">
              Pháp Lý & Hỗ Trợ
            </h3>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cộng đồng */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mimi-green">
              Tham Gia Cộng Đồng
            </h3>
            <p className="text-sm text-gray-400">
              Cần giải đáp thắc mắc hoặc báo lỗi? Tham gia máy chủ hỗ trợ chính thức trên Discord.
            </p>
            <div className="pt-2">
              <a
                href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <span>Mimi Support Server</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Thanh dưới cùng */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Mimi Bot Ecosystem. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Được phát triển với</span>
            <Heart className="h-3.5 w-3.5 fill-mimi-pink text-mimi-pink" />
            <span>bởi cộng đồng Mimi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
