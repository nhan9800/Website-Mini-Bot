'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Music,
  Shield,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Sparkles,
  ArrowRight,
  Headphones,
  Server,
  Zap,
  Terminal,
} from 'lucide-react';
import { env } from '@/lib/env';

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Headline */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mimi-green/10 border border-mimi-green/30 text-mimi-green text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discord Music Bot Thế Hệ Mới</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Biến Voice Channel Thành{' '}
                <span className="text-gradient-mimi">Không Gian Âm Nhạc</span> Sống Động
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Mimi kết hợp chất lượng âm thanh Hi-Fi tuyệt đỉnh với hệ thống quản trị cộng đồng thông minh: xác thực tự động 24h, chấm công độc lập và giám sát kinh tế.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-bold text-base shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Mời Mimi Vào Server</span>
                </a>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition-all duration-200"
                >
                  <span>Mở Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Stats Pill */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-mimi-green" />
                  <span><strong className="text-white font-bold">500+</strong> Máy Chủ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-mimi-purple" />
                  <span><strong className="text-white font-bold">2.4M+</strong> Bài Hát Phát</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-mimi-cyan" />
                  <span><strong className="text-white font-bold">99.9%</strong> Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Live Player Card Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-mimi-green via-mimi-purple to-mimi-cyan opacity-40 blur-2xl -z-10" />

                {/* Main Card */}
                <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  {/* Top bar: Channel status */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-mimi-green animate-pulse" />
                      <span className="text-sm font-semibold text-white">Voice: #nhac-chill-cung-mimi</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono">
                      Hi-Fi 128kbps
                    </span>
                  </div>

                  {/* Artwork & Song Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-mimi-purple/30 to-mimi-green/30 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
                      <Music className="w-10 h-10 text-mimi-green animate-bounce" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <h3 className="text-lg font-bold text-white truncate">
                        Sài Gòn Hôm Nay Mưa — Hoàng Dũng
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        Đang phát bởi <span className="text-mimi-green">@nhan9800</span>
                      </p>
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-mimi-purple/20 text-mimi-purple font-medium">
                        YouTube Audio • HD
                      </span>
                    </div>
                  </div>

                  {/* Animated Soundwave Visualizer */}
                  <div className="h-12 flex items-end justify-between gap-1.5 px-2 bg-black/40 rounded-xl p-2 border border-white/5">
                    {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 65, 85, 35, 75, 55, 90, 60, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-gradient-to-t from-mimi-green to-mimi-cyan transition-all duration-300"
                        style={{
                          height: isPlaying ? `${h}%` : '15%',
                          transitionDelay: `${i * 30}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-mimi-green to-mimi-cyan rounded-full transition-all duration-500"
                        style={{ width: isPlaying ? '64%' : '30%' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                      <span>02:35</span>
                      <span>04:12</span>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-20 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-mimi-green"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 rounded-2xl bg-mimi-green hover:bg-mimi-green-hover text-[#070711] flex items-center justify-center shadow-glow transition-all duration-200 active:scale-95"
                      >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                      </button>
                      <button
                        type="button"
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hệ Sinh Thái Tính Năng <span className="text-gradient-mimi">Đa Năng & Toàn Diện</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400">
              Không chỉ là bot nghe nhạc, Mimi được thiết kế riêng với kiến trúc hướng sự kiện, giúp quản lý toàn diện máy chủ Discord của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Smart Music */}
            <div className="glass-panel rounded-3xl p-7 space-y-4 hover:border-mimi-green/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-mimi-green/10 border border-mimi-green/20 flex items-center justify-center text-mimi-green group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Music Player</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Phát nhạc âm thanh Hi-Fi với bộ điều khiển nút bấm trực quan ngay trong tin nhắn Discord. Hỗ trợ hàng chờ thông minh, Loop, Shuffle và Auto-leave.
              </p>
            </div>

            {/* Card 2: 24h Verification */}
            <div className="glass-panel rounded-3xl p-7 space-y-4 hover:border-mimi-purple/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-mimi-purple/10 border border-mimi-purple/20 flex items-center justify-center text-mimi-purple group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Xác Thực 24 Giờ</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Quản lý role Đã/Chưa Xác Thực tự động. Tự động reset trạng thái thành viên vào 00:00 mỗi ngày theo chuẩn múi giờ Việt Nam (UTC+7).
              </p>
            </div>

            {/* Card 3: Attendance */}
            <div className="glass-panel rounded-3xl p-7 space-y-4 hover:border-mimi-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-mimi-cyan/10 border border-mimi-cyan/20 flex items-center justify-center text-mimi-cyan group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Chấm Công Độc Lập</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Hệ thống theo dõi giờ công nhân sự tách biệt hoàn toàn với xác thực. Cho phép check-in/check-out và xuất báo cáo tuần tự động.
              </p>
            </div>

            {/* Card 4: Economy Alert */}
            <div className="glass-panel rounded-3xl p-7 space-y-4 hover:border-mimi-yellow/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cảnh Báo Economy</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Tự động phát hiện thu nhập bất thường (&gt; 5.000.000 xu/ngày) và báo động ngay cho Bot Owner qua tin nhắn DM có chống spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-glow rounded-3xl p-10 sm:p-14 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-mimi-green/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-mimi-purple/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Sẵn Sàng Nâng Tầm <span className="text-gradient-mimi">Server Discord</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Chỉ mất chưa đầy 30 giây để mời Mimi vào máy chủ và bắt đầu trải nghiệm âm nhạc đỉnh cao cùng hệ thống quản trị chuyên nghiệp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-bold text-base shadow-glow hover:scale-105 transition-transform"
              >
                <Sparkles className="w-5 h-5" />
                <span>Thêm Vào Discord Ngay</span>
              </a>
              <Link
                href="/commands"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition-colors"
              >
                <Terminal className="w-5 h-5" />
                <span>Tra Cứu Tất Cả Lệnh</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
