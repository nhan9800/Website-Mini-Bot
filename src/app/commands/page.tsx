'use client';

import React, { useState, useMemo } from 'react';
import { Search, Terminal, Music, Shield, Clock, DollarSign, Settings, Sparkles } from 'lucide-react';
import type { CommandItem } from '@/lib/types';

const commandsList: CommandItem[] = [
  // Music
  {
    name: 'play',
    category: 'music',
    description: 'Phát nhạc từ YouTube, Spotify hoặc SoundCloud vào Voice Channel hiện tại.',
    usage: '/play <tên bài hát hoặc URL>',
    aliases: ['p', 'sing'],
    slashCommand: true,
  },
  {
    name: 'pause',
    category: 'music',
    description: 'Tạm dừng hoặc tiếp tục bài hát đang phát.',
    usage: '/pause',
    aliases: ['resume'],
    slashCommand: true,
  },
  {
    name: 'skip',
    category: 'music',
    description: 'Bỏ qua bài hát hiện tại và chuyển sang bài tiếp theo trong hàng chờ.',
    usage: '/skip',
    aliases: ['s', 'next'],
    slashCommand: true,
  },
  {
    name: 'queue',
    category: 'music',
    description: 'Hiển thị danh sách hàng chờ bài hát hiện tại của máy chủ.',
    usage: '/queue [trang]',
    aliases: ['q', 'list'],
    slashCommand: true,
  },
  {
    name: 'volume',
    category: 'music',
    description: 'Điều chỉnh âm lượng phát nhạc (từ 1% đến 150%).',
    usage: '/volume <mức %>',
    aliases: ['v', 'vol'],
    slashCommand: true,
  },
  {
    name: 'loop',
    category: 'music',
    description: 'Bật/tắt chế độ lặp lại bài hát hiện tại hoặc toàn bộ danh sách phát.',
    usage: '/loop <off | track | queue>',
    aliases: ['repeat'],
    slashCommand: true,
  },
  {
    name: 'leave',
    category: 'music',
    description: 'Dừng phát nhạc, xóa hàng chờ và rời khỏi Voice Channel.',
    usage: '/leave',
    aliases: ['dc', 'disconnect', 'stop'],
    slashCommand: true,
  },

  // Verification
  {
    name: 'setupverify',
    category: 'verification',
    description: 'Thiết lập hệ thống xác thực 24h và role cho máy chủ.',
    usage: '/setupverify <role_unverified> <role_verified>',
    slashCommand: true,
  },
  {
    name: 'verify',
    category: 'verification',
    description: 'Tự xác thực tài khoản để nhận role thành viên hợp lệ.',
    usage: '/verify',
    slashCommand: true,
  },
  {
    name: 'resetverify',
    category: 'verification',
    description: 'Quản trị viên đặt lại trạng thái xác thực lúc 00:00 UTC+7 thủ công.',
    usage: '/resetverify',
    slashCommand: true,
  },

  // Attendance
  {
    name: 'setupattendance',
    category: 'attendance',
    description: 'Cấu hình kênh chấm công độc lập cho nhân sự máy chủ.',
    usage: '/setupattendance <channel>',
    slashCommand: true,
  },
  {
    name: 'attendance',
    category: 'attendance',
    description: 'Chấm công vào/ra ca làm việc (check-in / check-out).',
    usage: '/attendance <in | out>',
    slashCommand: true,
  },
  {
    name: 'reportattendance',
    category: 'attendance',
    description: 'Xuất báo cáo tổng hợp giờ làm việc của thành viên trong tuần/tháng.',
    usage: '/reportattendance [user]',
    slashCommand: true,
  },

  // Economy
  {
    name: 'balance',
    category: 'economy',
    description: 'Xem số dư xu của bạn hoặc của một thành viên khác trong máy chủ.',
    usage: '/balance [user]',
    aliases: ['bal', 'money'],
    slashCommand: true,
  },
  {
    name: 'daily',
    category: 'economy',
    description: 'Nhận phần thưởng xu điểm danh hằng ngày.',
    usage: '/daily',
    slashCommand: true,
  },
  {
    name: 'transfer',
    category: 'economy',
    description: 'Chuyển xu cho thành viên khác (tự động cảnh báo nếu > 5.000.000 xu).',
    usage: '/transfer <user> <số xu>',
    slashCommand: true,
  },

  // System
  {
    name: 'help',
    category: 'system',
    description: 'Hiển thị menu hướng dẫn sử dụng toàn bộ lệnh của Mimi.',
    usage: '/help [lệnh]',
    slashCommand: true,
  },
  {
    name: 'ping',
    category: 'system',
    description: 'Kiểm tra độ trễ kết nối (latency) của Bot và Discord API.',
    usage: '/ping',
    slashCommand: true,
  },
  {
    name: 'status',
    category: 'system',
    description: 'Xem thống kê tình trạng hệ thống, uptime và bộ nhớ của Mimi.',
    usage: '/status',
    slashCommand: true,
  },
];

const categories = [
  { id: 'all', label: 'Tất Cả Lệnh', icon: Terminal },
  { id: 'music', label: 'Âm Nhạc', icon: Music },
  { id: 'verification', label: 'Xác Thực 24h', icon: Shield },
  { id: 'attendance', label: 'Chấm Công', icon: Clock },
  { id: 'economy', label: 'Kinh Tế', icon: DollarSign },
  { id: 'system', label: 'Hệ Thống', icon: Settings },
];

export default function CommandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCommands = useMemo(() => {
    return commandsList.filter((cmd) => {
      const matchCategory = activeCategory === 'all' || cmd.category === activeCategory;
      const matchSearch =
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cmd.aliases && cmd.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mimi-green/10 border border-mimi-green/30 text-mimi-green text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Danh Sách Lệnh Chuẩn</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Khám Phá Toàn Bộ <span className="text-gradient-mimi">Lệnh Mimi Bot</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Hỗ trợ cả Slash Commands (cú pháp <code className="text-mimi-green bg-white/5 px-1.5 py-0.5 rounded">/</code>) và lệnh prefix truyền thống cho quản trị máy chủ.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-6">
          {/* Search Input */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lệnh theo tên, công dụng hoặc từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-panel text-white placeholder-gray-500 border border-white/10 focus:border-mimi-green/50 focus:outline-none transition-all shadow-lg text-sm sm:text-base"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-mimi-green text-[#070711] shadow-glow'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.name}
                className="glass-panel rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-mimi-green font-mono">
                        /{cmd.name}
                      </span>
                      {cmd.slashCommand && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                          Slash
                        </span>
                      )}
                    </div>
                    <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-mimi-purple/20 text-mimi-purple font-semibold">
                      {cmd.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {cmd.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>Cách dùng:</span>
                    <span className="text-white bg-black/40 px-2 py-1 rounded">
                      {cmd.usage}
                    </span>
                  </div>
                  {cmd.aliases && cmd.aliases.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span>Viết tắt:</span>
                      {cmd.aliases.map((alias) => (
                        <span
                          key={alias}
                          className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 font-mono"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-3">
              <p className="text-lg text-gray-400">
                Không tìm thấy lệnh nào phù hợp với từ khóa &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-sm text-mimi-green hover:underline"
              >
                Đặt lại bộ lọc tìm kiếm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
