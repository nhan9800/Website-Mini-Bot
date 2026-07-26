'use client';

import React from 'react';
import Link from 'next/link';
import { Server, Music, Settings, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { env } from '@/lib/env';

const sampleGuilds = [
  {
    id: '1001',
    name: 'Nhạc Chill Cùng Mimi (Official)',
    icon: null,
    memberCount: 1420,
    inGuild: true,
    activeVoice: true,
  },
  {
    id: '1002',
    name: 'Gaming Club Việt Nam — Esports',
    icon: null,
    memberCount: 890,
    inGuild: true,
    activeVoice: false,
  },
  {
    id: '1003',
    name: 'Học Viện Lập Trình Next.js & Discord.js',
    icon: null,
    memberCount: 310,
    inGuild: true,
    activeVoice: true,
  },
];

export default function DashboardSelectorPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mimi-green/10 text-mimi-green text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bảng Quản Trị Âm Nhạc & Hệ Thống</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Chọn Máy Chủ <span className="text-gradient-mimi">Đang Quản Lý</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Chọn một máy chủ Discord bạn có quyền quản trị để điều khiển trình phát nhạc thời gian thực, quản lý hàng chờ và thay đổi cấu hình bot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={env.NEXT_PUBLIC_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-bold text-sm shadow-glow"
            >
              <span>Thêm Bot Vào Server Mới</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Guilds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleGuilds.map((guild) => (
            <div
              key={guild.id}
              className="glass-panel-glow rounded-3xl p-7 space-y-6 hover:border-mimi-green/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mimi-green/20 to-mimi-purple/20 border border-white/10 flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
                    {guild.name.charAt(0)}
                  </div>
                  {guild.activeVoice ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mimi-green/20 text-mimi-green text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-mimi-green animate-pulse" />
                      Đang phát nhạc
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs">
                      Sẵn sàng
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight truncate">
                    {guild.name}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-mimi-purple" />
                    <span>{guild.memberCount} thành viên</span>
                    <span>•</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-mimi-green" />
                    <span>Quản trị viên</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <Link
                  href={`/dashboard/${guild.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-mimi-green hover:bg-mimi-green-hover text-[#070711] font-bold text-sm shadow-glow transition-all"
                >
                  <Music className="w-4 h-4" />
                  <span>Điều Khiển Nhạc</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/${guild.id}?tab=settings`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Cấu hình hệ thống"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              Bạn không tìm thấy máy chủ Discord của mình?
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl">
              Để máy chủ hiển thị trong danh sách này, tài khoản của bạn phải có quyền <strong>Manage Server (Quản Lý Máy Chủ)</strong> hoặc <strong>Administrator (Quản Trị Viên)</strong>.
            </p>
          </div>

          <a
            href={env.NEXT_PUBLIC_BOT_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors shrink-0"
          >
            <span>Đăng Nhập Lại Với Discord</span>
          </a>
        </div>
      </div>
    </div>
  );
}
