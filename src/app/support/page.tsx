'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  MessageSquare,
  ExternalLink,
  LifeBuoy,
  ChevronDown,
  Terminal,
  LayoutDashboard,
  Activity,
} from 'lucide-react';
import { env } from '@/lib/env';
import { MotionReveal } from '@/components/ui/motion-primitives';

const faqs = [
  {
    q: 'Làm thế nào để phát nhạc với Mimi?',
    a: 'Tham gia một kênh thoại (Voice Channel) rồi gõ lệnh /play kèm tên bài hát hoặc link YouTube. Khi tải được nguồn nhạc, Mimi sẽ vào kênh và phát. Điều khiển tiếp bằng nút bấm trong tin nhắn hoặc qua dashboard web.',
  },
  {
    q: 'Mimi có cần API key Spotify hay Genius không?',
    a: 'Không. Mimi hoạt động hoàn toàn không cần key bên thứ ba: lời bài hát lấy từ lrclib.net, link Spotify được nhận diện qua oEmbed rồi tìm bài tương ứng trên YouTube.',
  },
  {
    q: 'Hệ thống xác thực thành viên hoạt động như thế nào?',
    a: 'Quản trị viên dùng /setupverify để chọn kênh, vai trò và các tùy chọn xác thực. Thành viên bấm nút để nhận vai trò. Việc đặt lại xác thực phụ thuộc cấu hình máy chủ, không mặc định áp dụng chu kỳ 24 giờ cho mọi server. Vai trò của bot cần cao hơn vai trò xác thực để gán hoặc gỡ.',
  },
  {
    q: 'Tôi muốn đổi prefix của bot thì làm sao?',
    a: 'Người có quyền Quản Lý Máy Chủ dùng /dashboard trong Discord để nhận liên kết và khóa truy cập. Mở đúng server cùng khóa còn hiệu lực, sang tab "Cấu Hình", đổi Prefix (1–5 ký tự) rồi bấm Lưu. Chỉ nhập Guild ID chưa đủ để mở các chức năng quản trị.',
  },
  {
    q: 'Vì sao bot báo lỗi khi tải nhạc (403)?',
    a: 'YouTube có thể chặn yêu cầu tải tạm thời. Nếu lỗi kéo dài, hãy gửi lệnh đã dùng, link bài hát và thời điểm xảy ra lỗi trong server hỗ trợ để đội ngũ kiểm tra.',
  },
  {
    q: 'Tôi có phải mua key để dùng Mimi nhạc không?',
    a: 'Không. Mimi nhạc và cộng đồng miễn phí, không cần key trả phí cho nhạc, autoplay, cấp độ hay minigame. Trang Bảng Giá & Key dành cho bot Mimi Shield anti-raid riêng.',
  },
  {
    q: 'Cảnh báo Economy 5.000.000 xu là gì?',
    a: 'Để chống gian lận, Mimi theo dõi thu nhập hằng ngày của từng thành viên. Nếu tài khoản nào kiếm hơn 5.000.000 xu/ngày, bot tự động gửi cảnh báo tới Bot Owner qua DM (có chống spam).',
  },
];

const quickLinks = [
  {
    href: '/commands',
    icon: Terminal,
    title: 'Danh Sách Lệnh',
    desc: 'Tra cứu toàn bộ lệnh slash của Mimi',
  },
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    desc: 'Điều khiển nhạc từ trình duyệt',
  },
  {
    href: '/status',
    icon: Activity,
    title: 'Trạng Thái',
    desc: 'Kiểm tra bot có đang online không',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl space-y-14 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <MotionReveal variant="mask" className="page-intro space-y-4">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-mimi-green">
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>Trung tâm hỗ trợ</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Bắt đầu cùng <span className="text-mimi-green">Mimi</span>
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            Tìm hướng dẫn, báo lỗi và gặp cộng đồng Mimi tại máy chủ hỗ trợ chính thức.
          </p>
        </MotionReveal>

        {/* ── CTA Discord ───────────────────────────────────────── */}
        <MotionReveal variant="drift" delay={0.08} className="grid grid-cols-1 gap-8 rounded-2xl border border-mimi-green/25 bg-mimi-green/[0.035] p-6 sm:p-9 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mimi-green/10 text-mimi-green">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Mimi • Cộng đồng & Hỗ trợ
              </h2>
              <p className="text-sm leading-relaxed text-gray-300">
                Máy chủ chính đã được sắp xếp lại với khu bắt đầu, phòng nhạc, ticket và bộ emoji Mimi.
              </p>
            </div>
            <a
              href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-6 !py-3 !text-sm"
            >
              <span>Tham gia cộng đồng</span>
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
          <ol className="space-y-5 text-sm">
            {[
              ['Đọc nội quy và xác thực', 'Vào khu Bắt đầu, đọc nội quy rồi bấm xác thực để mở khu cộng đồng.'],
              ['Tìm đúng phòng', 'Dùng kênh yêu cầu nhạc để nghe cùng mọi người; mở ticket khi cần hỗ trợ.'],
              ['Xem hướng dẫn trong Discord', 'Hướng dẫn máy chủ và bộ emoji có sẵn để bạn tra cứu khi cần.'],
            ].map(([title, description], index) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-mimi-green/25 font-mono text-xs text-mimi-green">{index + 1}</span>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="leading-relaxed text-gray-400">{description}</p>
                </div>
              </li>
            ))}
            <li className="pl-10">
              <a href="https://discord.com/channels/1517068246493429852/1555605739949531137" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-mimi-green underline-offset-4 hover:underline">
                Mở hướng dẫn máy chủ <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          </ol>
        </MotionReveal>

        {/* ── Liên kết nhanh ────────────────────────────────────── */}
        <MotionReveal variant="scale" delay={0.12} className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {quickLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-mimi-green/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mimi-green/10 text-mimi-green">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{l.title}</h3>
                  <p className="text-xs text-gray-400">{l.desc}</p>
                </div>
              </Link>
            );
          })}
        </MotionReveal>

        {/* ── FAQ accordion ─────────────────────────────────────── */}
        <MotionReveal variant="clip" delay={0.16} className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors ${
                    open ? 'border-mimi-green/30' : 'hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
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
                    <MotionReveal variant="clip" className="px-6 pb-6 pl-14 text-sm leading-relaxed text-gray-400" amount={0.05}>
                      {faq.a}
                    </MotionReveal>
                  )}
                </div>
              );
            })}
          </div>
        </MotionReveal>
      </div>
    </div>
  );
}
