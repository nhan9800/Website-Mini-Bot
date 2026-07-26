'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Heart, ExternalLink, Github, MessageSquare } from 'lucide-react';
import { env } from '@/lib/env';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#070711]/90 backdrop-blur-md pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Desc */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-mimi-green flex items-center justify-center text-[#070711] font-bold">
                <Music className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Mimi</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bot âm nhạc Discord thế hệ mới dành cho cộng đồng Việt Nam. Âm thanh Hi-Fi chất lượng cao, tính năng đa dạng, quản trị minh bạch.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Discord Support Server"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/nhan9800/Website-Mini-Bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Sản Phẩm */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-mimi-green">Khám Phá</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Trang Chủ</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Bảng Điều Khiển</Link>
              </li>
              <li>
                <Link href="/commands" className="text-gray-400 hover:text-white transition-colors">Danh Sách Lệnh</Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-400 hover:text-white transition-colors">Trạng Thái Hệ Thống</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tài Liệu & Pháp Lý */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-mimi-green">Pháp Lý & Hỗ Trợ</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Chính Sách Bảo Mật</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Điều Khoản Dịch Vụ</Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">Trung Tâm Hỗ Trợ</Link>
              </li>
              <li>
                <Link href="/changelog" className="text-gray-400 hover:text-white transition-colors">Nhật Ký Thay Đổi</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Hỗ Trợ Trực Tuyến */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-mimi-green">Tham Gia Cộng Đồng</h3>
            <p className="text-sm text-gray-400">
              Bạn cần giải đáp thắc mắc hoặc báo lỗi? Hãy tham gia máy chủ hỗ trợ chính thức trên Discord.
            </p>
            <div className="pt-2">
              <a
                href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <span>Mimi Support Server</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Mimi Ecosystem. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Được phát triển với</span>
            <Heart className="w-3.5 h-3.5 text-mimi-pink fill-mimi-pink" />
            <span>bởi cộng đồng Mimi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
