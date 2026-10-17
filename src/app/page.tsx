'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  ChevronDown,
  HelpCircle,
  Wifi,
  WifiOff,
  Heart,
  Music,
  Rocket,
  Bot,
  Shield,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { env } from '@/lib/env';
import { useBotStatus } from '@/lib/use-bot-status';
import { formatCompact, formatUptime } from '@/lib/format';
import { ExperienceStage } from '@/components/three/experience-stage';
import { Reveal } from '@/components/ui/reveal';
import { TrendingChart } from '@/components/trending-chart';
import { TeamSection } from '@/components/team/team-section';
import { CommunityReviewsSection } from '@/components/feedback/community-reviews-section';

/* ── Dữ liệu nội dung ─────────────────────────────────────────── */

const services: {
  icon: LucideIcon;
  ring: string;
  hover: string;
  title: string;
  desc: string;
  bullets: string[];
}[] = [
  {
    icon: Music,
    ring: 'border-mimi-green/25 bg-mimi-green/10 text-mimi-green',
    hover: 'hover:border-mimi-green/50',
    title: 'Một phòng nhạc cho cả nhóm',
    desc: 'Tìm bài, quản lý hàng chờ, lặp bài và bật autoplay. Bảng điều khiển nằm ngay trong Discord, dễ dùng cả trên điện thoại.',
    bullets: ['Không cần API key', 'Ở lại kênh 24/7', 'Lyrics + TTS tiếng Việt'],
  },
  {
    icon: Shield,
    ring: 'border-mimi-green/25 bg-mimi-green/10 text-mimi-green',
    hover: 'hover:border-mimi-green/50',
    title: 'Thành viên và vai trò',
    desc: 'Quản trị viên cấu hình kênh và vai trò xác thực; thành viên bấm nút để nhận vai trò. Có tùy chọn gỡ xác thực khi bot xử lý mute.',
    bullets: ['Xác thực bằng nút bấm', 'Cấu hình vai trò', 'Đặt lại theo yêu cầu quản trị'],
  },
  {
    icon: Wallet,
    ring: 'border-mimi-green/25 bg-mimi-green/10 text-mimi-green',
    hover: 'hover:border-mimi-green/50',
    title: 'Sinh hoạt cộng đồng',
    desc: 'Chấm công, báo cáo tuần, cấp độ và minigame xu giúp quản trị viên theo dõi hoạt động của cộng đồng.',
    bullets: ['Báo cáo tự động', 'Cảnh báo gian lận', 'Quản lý minh bạch'],
  },
  {
    icon: LayoutDashboard,
    ring: 'border-mimi-green/25 bg-mimi-green/10 text-mimi-green',
    hover: 'hover:border-mimi-green/50',
    title: 'Điều khiển từ trình duyệt',
    desc: 'Mở dashboard bằng khóa truy cập được cấp trong Discord để xem nhạc, hàng chờ và cấu hình máy chủ.',
    bullets: ['Khóa truy cập theo server', 'Dữ liệu từ bot', 'Không cần cài đặt'],
  },
];

const faqs = [
  {
    q: 'MIMI có miễn phí không?',
    a: 'Có. Mimi nhạc và cộng đồng miễn phí, bao gồm nghe nhạc, autoplay, cấp độ, minigame, xác thực và dashboard. Mimi Shield là bot anti-raid riêng, có các gói bản quyền riêng.',
  },
  {
    q: 'Làm sao để bắt đầu phát nhạc?',
    a: 'Mời MIMI vào server, vào một kênh thoại rồi gõ /play kèm tên bài hoặc link YouTube. Điều khiển tiếp bằng nút bấm hoặc Dashboard web.',
  },
  {
    q: 'MIMI có cần API key Spotify/Genius không?',
    a: 'Không. Lời bài hát lấy từ lrclib.net, link Spotify được nhận diện tự động rồi tìm bản phát trên YouTube, không cần cấu hình gì thêm.',
  },
  {
    q: 'Dashboard web hoạt động thế nào?',
    a: 'Người có quyền Quản Lý Máy Chủ dùng /dashboard trong Discord để nhận liên kết và khóa truy cập. Bạn cần đúng ID máy chủ cùng khóa dashboard còn hiệu lực để xem và điều khiển; chỉ nhập ID máy chủ chưa đủ.',
  },
  {
    q: 'Làm sao kiểm tra trạng thái của bot?',
    a: 'Trang Trạng Thái hiển thị ping và thời gian hoạt động khi lấy được dữ liệu từ bot. Chất lượng kết nối và phát nhạc còn phụ thuộc Discord, mạng và nguồn âm thanh.',
  },
];

/* ── Trang chủ ────────────────────────────────────────────────── */

export default function HomePage() {
  const { status, error, loading } = useBotStatus(20000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const online = !error && status?.online === true;
  const statusKnown = !error && typeof status?.online === 'boolean';
  return (
    <div className="min-h-screen">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-mimi-green" role="status">
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
                : !statusKnown
                  ? 'Chưa xác định được trạng thái bot'
                : online
                  ? 'Mimi đang trực tuyến'
                  : 'Bot hiện chưa trực tuyến'}
            </span>
          </div>

          <h1>
            Cùng nghe nhạc.<br />
            <span className="text-mimi-green">Cùng kết nối.</span>
          </h1>

          <p>
            Bot nhạc và cộng đồng tiếng Việt, miễn phí cho máy chủ Discord của bạn.
          </p>

          <div className="home-hero-actions">
            <a
              href={env.NEXT_PUBLIC_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Sparkles className="h-5 w-5" />
              <span>Mời Mimi miễn phí</span>
            </a>
            <Link href="/dashboard" className="btn-secondary">
              <LayoutDashboard className="h-5 w-5" />
              <span>Mở dashboard</span>
            </Link>
          </div>

          </div>
          <ExperienceStage />
        </div>
      </section>

      {/* ══ SỐ LIỆU THẬT ══════════════════════════════════════════ */}
      <section className="home-stat-strip">
        <div className="grid grid-cols-2 gap-7 lg:grid-cols-4">
          <StatBlock
            icon={Bot}
            value={!error && status ? formatCompact(status.guildCount) : 'Chưa có'}
            label="Máy chủ đang phục vụ"
          />
          <StatBlock
            icon={Heart}
            value={!error && status ? formatCompact(status.reachableUsers) : 'Chưa có'}
            label="Thành viên tiếp cận"
          />
          <StatBlock
            icon={Music}
            value={!error && status ? String(status.activeVoiceSessions) : 'Chưa có'}
            label="Phiên nhạc đang phát"
          />
          <StatBlock
            icon={Rocket}
            value={!error && status ? formatUptime(status.uptimeSeconds) : 'Chưa có'}
            label="Thời gian hoạt động"
          />
        </div>
      </section>

      {/* ══ BXH NHẠC VIỆT NAM (dữ liệu live iTunes VN) ═══════════ */}
      <TrendingChart />

      {/* ══ DỊCH VỤ / TÍNH NĂNG ═══════════════════════════════════ */}
      <section id="dich-vu" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="section-heading">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Mimi trong <span className="text-mimi-green">máy chủ của bạn</span>
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              Từ một buổi nghe nhạc đến hoạt động thường ngày, mọi tính năng cộng đồng đều miễn phí.
            </p>
          </Reveal>

          <div className="feature-showcase">
            {services.map((s, i) => {
              return (
                <Reveal key={s.title} delay={i * 90}>
                    <div className={`feature-panel group space-y-5 ${['feature-music', '', 'feature-community', 'feature-dashboard'][i]}`}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${s.ring}`}
                        >
                          <s.icon className="h-6 w-6" />
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
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Một Mimi.<br /><span className="text-mimi-green">Nhiều cách kết nối.</span>
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-gray-400 sm:text-base">
              <p>
                MIMI bắt đầu từ một nhu cầu đơn giản: một bot nhạc tiếng Việt ổn định, không
                buộc thành viên mua key để nghe nhạc. Từ đó, bot mở rộng thêm công cụ
                sinh hoạt và quản trị cho server Discord.
              </p>
              <p>
                Website kết nối với bot để hiển thị trạng thái và dữ liệu cộng đồng.
                Khi chưa có dữ liệu, trang sẽ thông báo rõ để bạn kiểm tra lại kết nối.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/status" className="btn-secondary !px-6 !py-3 !text-sm">
                <Rocket className="h-[18px] w-[18px]" />
                <span>Xem Trạng Thái Live</span>
              </Link>
              <Link href="/commands" className="btn-secondary !px-6 !py-3 !text-sm">
                <Bot className="h-[18px] w-[18px]" />
                <span>Danh Sách Lệnh</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass-panel-glow gradient-ring space-y-5 rounded-[2rem] p-8">
              <h3 className="flex items-center gap-2.5 border-b border-white/10 pb-4 text-lg font-bold text-white">
                <Bot className="h-6 w-6" />
                <span>Cam Kết Vận Hành</span>
              </h3>
              <ul className="space-y-4">
                {[
                  ['Miễn phí trọn đời', 'Không paywall, không quảng cáo chèn giữa nhạc.'],
                  ['Hỗ trợ tiếng Việt', 'Hướng dẫn và kênh hỗ trợ dành cho cộng đồng Việt.'],
                  ['Dữ liệu theo tính năng', 'Lưu cấu hình và dữ liệu tính năng. DM gửi cho bot có thể được chuyển đến chủ bot khi bật hỗ trợ.'],
                  ['Cập nhật minh bạch', 'Xem thay đổi đã phát hành trong nhật ký cập nhật.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mimi-green/15 text-mimi-green">
                      <Sparkles className="h-4 w-4" />
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

      {/* ══ ĐỘI NGŨ ═══════════════════════════════════════════════ */}
      <TeamSection />

      {/* ══ ĐÁNH GIÁ CỘNG ĐỒNG ═════════════════════════════════════ */}
      <CommunityReviewsSection />

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
              <div className="relative space-y-7">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Hẹn nhau trong <span className="text-mimi-green">phòng nhạc.</span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-300">
                  Mời Mimi, chọn một phòng thoại và bắt đầu bằng lệnh /play.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <a
                    href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !px-9 !py-4 !text-base"
                  >
                    <Sparkles className="h-6 w-6" />
                    <span>Mời Mimi miễn phí</span>
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
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <Icon className="h-10 w-10 text-mimi-green" />
      <span className="stat-value font-mono font-extrabold text-white">{value}</span>
      <span className="stat-label text-gray-400">{label}</span>
    </div>
  );
}
