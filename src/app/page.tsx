'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Terminal,
  LayoutDashboard,
  ChevronDown,
  Quote,
  HelpCircle,
  Wifi,
  WifiOff,
  Star,
  Code2,
  Heart,
} from 'lucide-react';
import { env } from '@/lib/env';
import { useBotStatus } from '@/lib/use-bot-status';
import { formatCompact, formatUptime } from '@/lib/format';
import { Soundwave } from '@/components/ui/soundwave';
import { Particles } from '@/components/ui/particles';
import { Reveal } from '@/components/ui/reveal';
import { Icon3D, type Icon3DName } from '@/components/ui/icon3d';
import { TiltCard } from '@/components/ui/tilt-card';
import { TrendingChart } from '@/components/trending-chart';

/* ── Dữ liệu nội dung ─────────────────────────────────────────── */

const services: {
  icon: Icon3DName;
  ring: string;
  hover: string;
  title: string;
  desc: string;
  bullets: string[];
}[] = [
  {
    icon: 'music',
    ring: 'border-mimi-green/25 bg-mimi-green/10',
    hover: 'hover:border-mimi-green/50',
    title: 'Bot Nhạc Chất Lượng Cao',
    desc: 'Phát nhạc YouTube âm thanh Opus HQ, hàng chờ thông minh, loop, autoplay, lời bài hát tức thì. Điều khiển bằng nút bấm ngay trong Discord.',
    bullets: ['Không cần API key', 'Ở lại kênh 24/7', 'Lyrics + TTS tiếng Việt'],
  },
  {
    icon: 'shield',
    ring: 'border-mimi-purple/25 bg-mimi-purple/10',
    hover: 'hover:border-mimi-purple/50',
    title: 'Xác Thực & An Ninh',
    desc: 'Hệ thống xác thực 24 giờ tự reset lúc 00:00 (UTC+7), quản lý role tự động, tùy chọn hủy xác thực khi thành viên bị mute.',
    bullets: ['Reset đúng giờ VN', 'Role tự động', 'Chống phá server'],
  },
  {
    icon: 'money',
    ring: 'border-mimi-cyan/25 bg-mimi-cyan/10',
    hover: 'hover:border-mimi-cyan/50',
    title: 'Chấm Công & Kinh Tế',
    desc: 'Check-in/check-out nhân sự độc lập, báo cáo tuần tự động. Giám sát Economy, cảnh báo Owner khi có thu nhập bất thường.',
    bullets: ['Báo cáo tự động', 'Cảnh báo gian lận', 'Quản lý minh bạch'],
  },
  {
    icon: 'dashboard',
    ring: 'border-mimi-amber/25 bg-mimi-amber/10',
    hover: 'hover:border-mimi-amber/50',
    title: 'Dashboard Web Thời Gian Thực',
    desc: 'Xem bài đang phát, quản lý hàng chờ, chỉnh âm lượng và cấu hình bot ngay trên trình duyệt — đồng bộ trực tiếp với bot.',
    bullets: ['Điều khiển từ xa', 'Cập nhật mỗi 5 giây', 'Không cần cài đặt'],
  },
];

// LƯU Ý: đánh giá mẫu minh họa — thay bằng phản hồi thật của thành viên khi có.
const testimonials = [
  {
    name: 'Minh Khang',
    role: 'Chủ server Gaming 1.2K thành viên',
    text: 'Chuyển từ bot nước ngoài sang Mimi vì tiếng Việt chuẩn và nút bấm tiện. Anh em trong server giờ toàn treo voice nghe nhạc cả ngày.',
  },
  {
    name: 'Thảo Vy',
    role: 'Quản trị viên cộng đồng học tập',
    text: 'Tính năng xác thực 24h giúp server sạch bóng acc ảo. Setup một lần rồi quên luôn, mọi thứ tự chạy đúng giờ Việt Nam.',
  },
  {
    name: 'Đức Anh',
    role: 'Trưởng nhóm nhân sự Discord shop',
    text: 'Chấm công tự động + báo cáo tuần là thứ mình cần bấy lâu. Dashboard web nhìn số liệu trực quan, không phải mò lệnh.',
  },
];

const faqs = [
  {
    q: 'Mimi có miễn phí không?',
    a: 'Có — toàn bộ tính năng nhạc, xác thực, chấm công và dashboard đều miễn phí. Không quảng cáo, không khóa tính năng sau paywall.',
  },
  {
    q: 'Làm sao để bắt đầu phát nhạc?',
    a: 'Mời Mimi vào server, vào một kênh thoại rồi gõ /play kèm tên bài hoặc link YouTube. Điều khiển tiếp bằng nút bấm hoặc Dashboard web.',
  },
  {
    q: 'Mimi có cần API key Spotify/Genius không?',
    a: 'Không. Lời bài hát lấy từ lrclib.net, link Spotify được nhận diện tự động rồi tìm bản phát trên YouTube — không cần cấu hình gì thêm.',
  },
  {
    q: 'Dashboard web hoạt động thế nào?',
    a: 'Web kết nối bot qua Internal API bảo mật bằng token. Bạn nhập ID server có Mimi là xem được bài đang phát, hàng chờ và chỉnh cấu hình ngay lập tức.',
  },
  {
    q: 'Bot có ổn định không? Server đặt ở đâu?',
    a: 'Bot chạy trên máy chủ đặt tại Việt Nam nên độ trễ với người dùng Việt rất thấp. Bạn có thể xem ping, uptime thời gian thực ở trang Trạng Thái.',
  },
];

/* ── Trang chủ ────────────────────────────────────────────────── */

export default function HomePage() {
  const { status, loading } = useBotStatus(20000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const online = status?.online === true;

  return (
    <div className="-mt-24 min-h-screen">
      {/* ══ HERO — cao hết màn hình, căn giữa, nền particles ══════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <Particles />
        {/* lớp phủ gradient cho chữ nổi */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(46,204,113,0.10),transparent_70%)]" />

        {/* Emoji 3D bay lơ lửng hai bên hero */}
        <div className="pointer-events-none absolute left-[8%] top-[24%] hidden animate-float opacity-90 lg:block">
          <Icon3D name="headphone" size={84} />
        </div>
        <div
          className="pointer-events-none absolute right-[9%] top-[30%] hidden animate-float opacity-90 lg:block"
          style={{ animationDelay: '1.2s' }}
        >
          <Icon3D name="music" size={72} />
        </div>
        <div
          className="pointer-events-none absolute bottom-[22%] left-[14%] hidden animate-float opacity-80 lg:block"
          style={{ animationDelay: '2s' }}
        >
          <Icon3D name="mic" size={58} />
        </div>
        <div
          className="pointer-events-none absolute bottom-[26%] right-[13%] hidden animate-float opacity-80 lg:block"
          style={{ animationDelay: '0.6s' }}
        >
          <Icon3D name="sparkles" size={56} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green backdrop-blur-sm">
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
                  ? 'Bot đang trực tuyến — sẵn sàng phục vụ'
                  : 'Bot đang bảo trì — quay lại sau ít phút'}
            </span>
          </div>

          <h1 className="animate-fade-up text-4xl font-black leading-[1.12] tracking-tight text-white delay-75ms sm:text-6xl lg:text-7xl">
            Giải Pháp Bot Discord{' '}
            <span className="text-gradient-mimi">Toàn Diện</span>
            <br className="hidden sm:block" /> Cho Cộng Đồng Việt
          </h1>

          <p className="mx-auto max-w-2xl animate-fade-up text-lg leading-relaxed text-gray-300 delay-150ms sm:text-xl">
            Nghe nhạc chất lượng cao, xác thực tự động, chấm công nhân sự và dashboard web
            thời gian thực — tất cả trong một bot duy nhất, hoàn toàn miễn phí.
          </p>

          <div className="flex animate-fade-up flex-wrap items-center justify-center gap-4 pt-2 delay-225ms">
            <a
              href={env.NEXT_PUBLIC_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-9 !py-4 !text-base"
            >
              <Sparkles className="h-5 w-5" />
              <span>Mời Mimi Miễn Phí</span>
            </a>
            <Link href="/dashboard" className="btn-secondary !px-9 !py-4 !text-base">
              <LayoutDashboard className="h-5 w-5" />
              <span>Mở Dashboard</span>
            </Link>
          </div>

          {/* Sóng nhạc trang trí */}
          <div className="mx-auto max-w-md animate-fade-up pt-4 delay-300ms">
            <Soundwave playing={online || loading} className="!h-12 !border-white/10 !bg-black/30" />
          </div>
        </div>

        {/* mũi tên cuộn xuống */}
        <a
          href="#dich-vu"
          className="absolute bottom-8 z-10 animate-float text-gray-500 transition-colors hover:text-mimi-green"
          aria-label="Cuộn xuống xem dịch vụ"
        >
          <ChevronDown className="h-8 w-8" />
        </a>
      </section>

      {/* ══ SỐ LIỆU THẬT ══════════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <StatBlock
            icon="robot"
            value={status ? formatCompact(status.guildCount) : '—'}
            label="Máy chủ đang phục vụ"
          />
          <StatBlock
            icon="heart"
            value={status ? formatCompact(status.reachableUsers) : '—'}
            label="Thành viên tiếp cận"
          />
          <StatBlock
            icon="headphone"
            value={status ? String(status.activeVoiceSessions) : '—'}
            label="Phiên nhạc đang phát"
          />
          <StatBlock
            icon="rocket"
            value={status ? formatUptime(status.uptimeSeconds) : '—'}
            label="Thời gian hoạt động"
          />
        </div>
      </section>

      {/* ══ BXH NHẠC VIỆT NAM (dữ liệu live iTunes VN) ═══════════ */}
      <TrendingChart />

      {/* ══ DỊCH VỤ / TÍNH NĂNG ═══════════════════════════════════ */}
      <section id="dich-vu" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green">
              <Star className="h-3.5 w-3.5" />
              <span>Dịch vụ của Mimi</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Một Bot — <span className="text-gradient-mimi">Bốn Trụ Cột</span>
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              Mỗi nhóm tính năng được xây như một dịch vụ hoàn chỉnh, phối hợp nhịp nhàng
              trong cùng một bot.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((s, i) => {
              return (
                <Reveal key={s.title} delay={i * 90}>
                  <TiltCard className="h-full">
                    <div className={`glass-panel group h-full space-y-5 rounded-3xl p-8 transition-colors ${s.hover}`}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${s.ring} transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110`}
                        >
                          <Icon3D name={s.icon} size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{s.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-400">{s.desc}</p>
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {s.bullets.map((b) => (
                          <li
                            key={b}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ VỀ MIMI ═══════════════════════════════════════════════ */}
      <section id="ve-mimi" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-mimi-purple/30 bg-mimi-purple/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-violet">
              <Heart className="h-3.5 w-3.5" />
              <span>Về Mimi</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sinh Ra Từ Nhu Cầu Thật Của{' '}
              <span className="text-gradient-mimi">Cộng Đồng Việt</span>
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-gray-400 sm:text-base">
              <p>
                Mimi bắt đầu từ một nhu cầu đơn giản: một bot nhạc tiếng Việt ổn định, không
                phụ thuộc API trả phí, không chết giữa chừng. Từ đó, bot lớn dần thành hệ
                sinh thái quản trị trọn vẹn cho server Discord.
              </p>
              <p>
                Toàn bộ hạ tầng đặt tại Việt Nam giúp độ trễ thấp nhất cho người dùng Việt.
                Mã nguồn website mở trên GitHub — minh bạch từ giao diện đến cách kết nối
                dữ liệu.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/status" className="btn-secondary !px-6 !py-3 !text-sm">
                <Zap className="h-4 w-4" />
                <span>Xem Trạng Thái Live</span>
              </Link>
              <Link href="/commands" className="btn-secondary !px-6 !py-3 !text-sm">
                <Terminal className="h-4 w-4" />
                <span>Danh Sách Lệnh</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass-panel-glow gradient-ring space-y-5 rounded-[2rem] p-8">
              <h3 className="flex items-center gap-2.5 border-b border-white/10 pb-4 text-lg font-bold text-white">
                <Code2 className="h-5 w-5 text-mimi-green" />
                <span>Cam Kết Vận Hành</span>
              </h3>
              <ul className="space-y-4">
                {[
                  ['Miễn phí trọn đời', 'Không paywall, không quảng cáo chèn giữa nhạc.'],
                  ['Máy chủ tại Việt Nam', 'Ping thấp, hỗ trợ tiếng Việt là mặc định.'],
                  ['Dữ liệu tối thiểu', 'Chỉ lưu ID cần thiết — không đọc tin nhắn riêng.'],
                  ['Cập nhật liên tục', 'Theo dõi lỗi và cải tiến mỗi tuần qua changelog.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mimi-green/15 text-mimi-green">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{t}</p>
                      <p className="text-xs leading-relaxed text-gray-400">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ ĐÁNH GIÁ ══════════════════════════════════════════════ */}
      <section id="danh-gia" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Cộng Đồng Nói Gì Về <span className="text-gradient-mimi">Mimi</span>?
            </h2>
            <p className="text-gray-400">
              Những trải nghiệm tiêu biểu từ các quản trị viên server đang dùng Mimi.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="glass-panel card-lift relative h-full space-y-5 rounded-3xl p-8 hover:border-mimi-green/35">
                  <Quote className="h-8 w-8 text-mimi-green/40" />
                  <p className="text-sm leading-relaxed text-gray-300">{t.text}</p>
                  <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand text-sm font-extrabold text-[#05060f]">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-mimi-amber text-mimi-amber" />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ĐỘI NGŨ ═══════════════════════════════════════════════ */}
      <section id="doi-ngu" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Đội Ngũ Đứng Sau <span className="text-gradient-mimi">Mimi</span>
            </h2>
            <p className="text-gray-400">
              Dự án được phát triển và vận hành bởi cộng đồng, vì cộng đồng.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="glass-panel card-lift flex h-full items-center gap-5 rounded-3xl p-7 hover:border-mimi-green/40">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-mimi-green/25 bg-mimi-green/10 shadow-glow">
                  <Icon3D name="rocket" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">nhan9800</h3>
                  <p className="text-sm text-mimi-green">Founder & Developer</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">
                    Xây dựng toàn bộ bot core, Internal API và hệ sinh thái web của Mimi.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="glass-panel card-lift flex h-full items-center gap-5 rounded-3xl p-7 hover:border-mimi-purple/40">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-mimi-purple/30 bg-mimi-purple/15">
                  <Icon3D name="robot" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Cộng Đồng Mimi</h3>
                  <p className="text-sm text-mimi-violet">Tester & Support</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">
                    Báo lỗi, góp ý tính năng và hỗ trợ thành viên mới mỗi ngày trên server
                    Discord chính thức.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Câu Hỏi <span className="text-gradient-mimi">Thường Gặp</span>
            </h2>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div
                    className={`glass-panel overflow-hidden rounded-3xl transition-colors ${
                      open ? 'border-mimi-green/30' : 'hover:border-white/20'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-6 text-left"
                      aria-expanded={open}
                    >
                      <span className="flex items-start gap-3 text-base font-bold text-white">
                        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-mimi-green" />
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <div className="animate-fade-in px-6 pb-6 pl-14 text-sm leading-relaxed text-gray-400">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA CUỐI ══════════════════════════════════════════════ */}
      <section className="relative pb-8 pt-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="glass-panel-glow gradient-ring relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-14">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mimi-green/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-mimi-purple/10 blur-3xl" />
              <div className="relative space-y-7">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Sẵn Sàng Nâng Tầm <span className="text-gradient-mimi">Server Của Bạn</span>?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-300">
                  Chưa đầy 30 giây để mời Mimi — miễn phí, không cần thẻ, không quảng cáo.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <a
                    href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !px-9 !py-4 !text-base"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Thêm Vào Discord Ngay</span>
                  </a>
                  <a
                    href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !px-9 !py-4 !text-base"
                  >
                    <span>Vào Server Hỗ Trợ</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/** Khối số liệu lớn ở dải stats. */
function StatBlock({
  icon,
  value,
  label,
}: {
  icon: Icon3DName;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <Icon3D name={icon} size={40} />
      <span className="font-mono text-3xl font-extrabold text-white sm:text-4xl">{value}</span>
      <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
    </div>
  );
}
