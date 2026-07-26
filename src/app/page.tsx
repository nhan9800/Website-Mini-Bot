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
  Server,
  Zap,
  Terminal,
  Users,
  Radio,
  MousePointerClick,
  MicVocal,
  DoorOpen,
  ListPlus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { env } from '@/lib/env';
import { useBotStatus } from '@/lib/use-bot-status';
import { formatCompact, formatUptime } from '@/lib/format';
import { Soundwave } from '@/components/ui/soundwave';

const features = [
  {
    icon: Music,
    color: 'text-mimi-green',
    bg: 'bg-mimi-green/10 border-mimi-green/25',
    hover: 'hover:border-mimi-green/50',
    title: 'Trình Phát Nhạc Thông Minh',
    desc: 'Phát nhạc từ YouTube với hàng chờ thông minh, Loop, Autoplay và tự rời kênh khi vắng người. Không cần API key — bot tự xử lý mọi thứ.',
  },
  {
    icon: MousePointerClick,
    color: 'text-mimi-cyan',
    bg: 'bg-mimi-cyan/10 border-mimi-cyan/25',
    hover: 'hover:border-mimi-cyan/50',
    title: 'Điều Khiển Bằng Nút Bấm',
    desc: 'Pause, Skip, Loop, Volume — tất cả bằng nút bấm ngay trong tin nhắn Discord, hoặc điều khiển từ xa qua dashboard web thời gian thực.',
  },
  {
    icon: MicVocal,
    color: 'text-mimi-violet',
    bg: 'bg-mimi-purple/10 border-mimi-purple/25',
    hover: 'hover:border-mimi-purple/50',
    title: 'Lời Bài Hát & TTS',
    desc: 'Tra lời bài hát tức thì (lrclib) và đọc tin nhắn bằng giọng nói (Text-to-Speech) ngay trong kênh thoại.',
  },
  {
    icon: Shield,
    color: 'text-mimi-green',
    bg: 'bg-mimi-green/10 border-mimi-green/25',
    hover: 'hover:border-mimi-green/50',
    title: 'Xác Thực 24 Giờ',
    desc: 'Tự động quản lý role Đã/Chưa Xác Thực, reset trạng thái thành viên vào 00:00 mỗi ngày theo giờ Việt Nam (UTC+7).',
  },
  {
    icon: Clock,
    color: 'text-mimi-cyan',
    bg: 'bg-mimi-cyan/10 border-mimi-cyan/25',
    hover: 'hover:border-mimi-cyan/50',
    title: 'Chấm Công Nhân Sự',
    desc: 'Hệ thống check-in/check-out độc lập với xác thực, theo dõi giờ công và xuất báo cáo tuần tự động cho quản trị viên.',
  },
  {
    icon: AlertTriangle,
    color: 'text-mimi-amber',
    bg: 'bg-mimi-amber/10 border-mimi-amber/25',
    hover: 'hover:border-mimi-amber/50',
    title: 'Giám Sát Kinh Tế',
    desc: 'Phát hiện thu nhập bất thường (trên 5.000.000 xu/ngày) và báo động ngay cho Bot Owner qua DM có chống spam.',
  },
  {
    icon: DoorOpen,
    color: 'text-mimi-pink',
    bg: 'bg-mimi-pink/10 border-mimi-pink/25',
    hover: 'hover:border-mimi-pink/50',
    title: 'Phòng Voice Tự Động',
    desc: 'Thành viên vào kênh chờ là có ngay phòng voice riêng, tự xóa khi trống — giữ server luôn gọn gàng.',
  },
  {
    icon: Radio,
    color: 'text-mimi-violet',
    bg: 'bg-mimi-purple/10 border-mimi-purple/25',
    hover: 'hover:border-mimi-purple/50',
    title: 'Ở Lại Kênh Thoại 24/7',
    desc: 'Mimi có thể trực chiến trong kênh thoại cả ngày, sẵn sàng phát nhạc bất cứ lúc nào không cần gọi lại.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Mời Mimi vào server',
    desc: 'Bấm nút mời, chọn máy chủ của bạn và cấp quyền. Chưa đầy 30 giây là xong.',
  },
  {
    n: '02',
    title: 'Vào kênh thoại & gõ /play',
    desc: 'Tham gia voice channel bất kỳ rồi gõ /play cùng tên bài hát hoặc link YouTube.',
  },
  {
    n: '03',
    title: 'Điều khiển mọi thứ',
    desc: 'Dùng nút bấm trong Discord hoặc mở Dashboard web để điều khiển nhạc thời gian thực.',
  },
];

export default function HomePage() {
  const { status, loading } = useBotStatus(20000);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);

  const online = status?.online === true;

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-24 pt-10 lg:pb-32 lg:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            {/* Cột trái: tiêu đề */}
            <div className="space-y-8 text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green">
                {loading ? (
                  <span className="h-2 w-2 animate-pulse-soft rounded-full bg-gray-400" />
                ) : online ? (
                  <Wifi className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-mimi-amber" />
                )}
                <span>
                  {loading
                    ? 'Đang kiểm tra trạng thái bot…'
                    : online
                      ? 'Bot đang trực tuyến — sẵn sàng phát nhạc'
                      : 'Bot đang bảo trì — quay lại sau ít phút'}
                </span>
              </div>

              <h1 className="animate-fade-up text-4xl font-black leading-[1.12] tracking-tight text-white delay-75ms sm:text-6xl lg:text-[4.2rem]">
                Biến Voice Channel Thành{' '}
                <span className="text-gradient-mimi">Sân Khấu Âm Nhạc</span>{' '}
                Của Riêng Bạn
              </h1>

              <p className="mx-auto max-w-2xl animate-fade-up text-lg leading-relaxed text-gray-300 delay-150ms sm:text-xl lg:mx-0">
                Mimi mang trải nghiệm nghe nhạc mượt mà cùng bộ công cụ quản trị cộng đồng
                toàn diện: xác thực tự động, chấm công nhân sự, giám sát kinh tế — tất cả
                điều khiển được từ dashboard web.
              </p>

              <div className="flex animate-fade-up flex-wrap items-center justify-center gap-4 pt-2 delay-225ms lg:justify-start">
                <a
                  href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !px-8 !py-4 !text-base"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Mời Mimi Vào Server</span>
                </a>
                <Link href="/dashboard" className="btn-secondary !px-8 !py-4 !text-base">
                  <span>Mở Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Số liệu THẬT từ Internal API */}
              <div className="flex animate-fade-up flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/10 pt-6 text-sm text-gray-400 delay-300ms lg:justify-start">
                <div className="flex items-center gap-2.5">
                  <Server className="h-4 w-4 text-mimi-green" />
                  <span>
                    <strong className="font-mono text-base font-bold text-white">
                      {status ? formatCompact(status.guildCount) : '—'}
                    </strong>{' '}
                    máy chủ
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-mimi-violet" />
                  <span>
                    <strong className="font-mono text-base font-bold text-white">
                      {status ? formatCompact(status.reachableUsers) : '—'}
                    </strong>{' '}
                    thành viên tiếp cận
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="h-4 w-4 text-mimi-cyan" />
                  <span>
                    <strong className="font-mono text-base font-bold text-white">
                      {status ? formatUptime(status.uptimeSeconds) : '—'}
                    </strong>{' '}
                    uptime
                  </span>
                </div>
              </div>
            </div>

            {/* Cột phải: mockup trình phát */}
            <div className="animate-fade-up delay-300ms lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 -z-10 animate-pulse-soft rounded-[2rem] bg-gradient-to-r from-mimi-green/40 via-mimi-purple/30 to-mimi-cyan/40 opacity-50 blur-3xl" />

                <div className="glass-panel-glow gradient-ring animate-float space-y-6 rounded-[2rem] p-6 shadow-2xl sm:p-8">
                  {/* Thanh trạng thái kênh */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mimi-green opacity-60" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-mimi-green" />
                      </span>
                      <span className="text-sm font-semibold text-white">
                        Voice: #nhac-chill-cung-mimi
                      </span>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-gray-300">
                      Opus HQ
                    </span>
                  </div>

                  {/* Bìa & thông tin bài hát */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-mimi-purple/30 to-mimi-green/30 shadow-lg">
                      <div className="absolute inset-0 animate-spin-slow rounded-2xl bg-[conic-gradient(from_0deg,transparent,rgba(46,204,113,0.35),transparent_60%)]" />
                      <Music className="relative h-9 w-9 text-mimi-green" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="truncate text-lg font-bold text-white">
                        Sài Gòn Hôm Nay Mưa — Hoàng Dũng
                      </h3>
                      <p className="truncate text-sm text-gray-400">
                        Yêu cầu bởi <span className="text-mimi-green">@nhan9800</span>
                      </p>
                      <span className="inline-block rounded bg-mimi-purple/20 px-2 py-0.5 text-[11px] font-medium text-mimi-violet">
                        YouTube Audio • HD
                      </span>
                    </div>
                  </div>

                  {/* Sóng nhạc */}
                  <Soundwave playing={isPlaying} />

                  {/* Thanh tiến trình */}
                  <div className="space-y-1.5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-brand transition-all duration-700"
                        style={{ width: isPlaying ? '64%' : '30%' }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-xs text-gray-400">
                      <span>02:35</span>
                      <span>04:12</span>
                    </div>
                  </div>

                  {/* Điều khiển */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="h-5 w-5 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="mimi-slider w-24"
                        style={{ '--fill': `${volume}%` } as React.CSSProperties}
                        aria-label="Âm lượng"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-[#05060f] shadow-glow transition-all duration-200 hover:shadow-glow-lg active:scale-95"
                        aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6 fill-current" />
                        ) : (
                          <Play className="ml-0.5 h-6 w-6 fill-current" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-white/5 p-3 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Bài kế tiếp"
                      >
                        <SkipForward className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee nguồn phát ───────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-6">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-14 px-7 font-mono text-sm uppercase tracking-[0.25em] text-gray-500">
            {Array.from({ length: 2 }).map((_, half) => (
              <React.Fragment key={half}>
                <span>YouTube</span><span className="text-mimi-green">◆</span>
                <span>YouTube Music</span><span className="text-mimi-cyan">◆</span>
                <span>Playlist</span><span className="text-mimi-violet">◆</span>
                <span>Livestream</span><span className="text-mimi-pink">◆</span>
                <span>Lyrics lrclib</span><span className="text-mimi-amber">◆</span>
                <span>Text-To-Speech</span><span className="text-mimi-green">◆</span>
                <span>Spotify Link</span><span className="text-mimi-cyan">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tính năng ────────────────────────────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-mimi-purple/30 bg-mimi-purple/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-violet">
              <Sparkles className="h-3.5 w-3.5" />
              <span>8 nhóm tính năng chính</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Một Bot — <span className="text-gradient-mimi">Cả Hệ Sinh Thái</span>
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              Không chỉ phát nhạc. Mimi được thiết kế để vận hành trọn vẹn một cộng đồng
              Discord: từ giải trí, an ninh đến quản lý nhân sự.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`glass-panel card-lift group space-y-4 rounded-3xl p-7 ${f.hover}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${f.bg} ${f.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3 bước bắt đầu ───────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 space-y-3 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Bắt Đầu Trong <span className="text-gradient-mimi">30 Giây</span>
            </h2>
            <p className="text-gray-400">Không cần cấu hình phức tạp — mời bot là chạy ngay.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className="glass-panel card-lift relative rounded-3xl p-8">
                <span className="absolute -top-5 left-7 font-mono text-5xl font-black text-white/10">
                  {s.n}
                </span>
                <div className="relative space-y-3 pt-4">
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-mimi-green/60 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA cuối trang ───────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-glow gradient-ring relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mimi-green/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-mimi-purple/10 blur-3xl" />

            <div className="relative space-y-7">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-brand text-[#05060f] shadow-glow">
                <ListPlus className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Sẵn Sàng Nâng Tầm <span className="text-gradient-mimi">Server Discord</span>?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-300">
                Mời Mimi ngay hôm nay — miễn phí, không cần thẻ, không quảng cáo. Cộng đồng
                của bạn xứng đáng có trải nghiệm âm nhạc tốt nhất.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !px-8 !py-4 !text-base"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Thêm Vào Discord Ngay</span>
                </a>
                <Link href="/commands" className="btn-secondary !px-8 !py-4 !text-base">
                  <Terminal className="h-5 w-5" />
                  <span>Xem Tất Cả Lệnh</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
