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

const faqs = [
  {
    q: 'Làm thế nào để phát nhạc với Mimi?',
    a: 'Tham gia một kênh thoại (Voice Channel) rồi gõ lệnh /play kèm tên bài hát hoặc link YouTube. Mimi sẽ vào kênh và phát ngay — điều khiển tiếp bằng nút bấm trong tin nhắn hoặc qua Dashboard web.',
  },
  {
    q: 'Mimi có cần API key Spotify hay Genius không?',
    a: 'Không. Mimi hoạt động hoàn toàn không cần key bên thứ ba: lời bài hát lấy từ lrclib.net, link Spotify được nhận diện qua oEmbed rồi tìm bài tương ứng trên YouTube.',
  },
  {
    q: 'Hệ thống xác thực 24 giờ hoạt động như thế nào?',
    a: 'Khi bật chế độ xác thực 24h, vào đúng 00:00 giờ Việt Nam (UTC+7) mỗi ngày, Mimi tự động reset trạng thái xác thực của thành viên. Thành viên chỉ cần bấm nút xác thực một lần để tiếp tục sử dụng kênh.',
  },
  {
    q: 'Tôi muốn đổi prefix của bot thì làm sao?',
    a: 'Mở Dashboard web, nhập ID server của bạn, sang tab "Cấu Hình" và đổi Prefix (1–5 ký tự) rồi bấm Lưu. Thay đổi có hiệu lực ngay lập tức.',
  },
  {
    q: 'Vì sao bot báo lỗi khi tải nhạc (403)?',
    a: 'Đôi khi YouTube chặn tạm thời — Mimi sẽ tự thử lại bằng client khác. Nếu vẫn lỗi kéo dài, hãy báo trong server hỗ trợ để đội ngũ cập nhật trình tải nhạc trên máy chủ.',
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
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-5xl space-y-14 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green">
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>Trung tâm hỗ trợ</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Chúng Tôi Luôn <span className="text-gradient-mimi">Sẵn Sàng Giúp Đỡ</span>
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            Xem câu hỏi thường gặp bên dưới, hoặc vào thẳng server Discord hỗ trợ để được
            giải đáp trực tiếp.
          </p>
        </div>

        {/* ── CTA Discord ───────────────────────────────────────── */}
        <div className="glass-panel-glow gradient-ring relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -left-14 -top-14 h-56 w-56 rounded-full bg-mimi-green/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -right-14 h-56 w-56 rounded-full bg-mimi-purple/10 blur-3xl" />
          <div className="relative space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-brand text-[#05060f] shadow-glow">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Máy Chủ Hỗ Trợ Chính Thức
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-gray-300 sm:text-base">
                Báo lỗi, yêu cầu tính năng mới hoặc giao lưu cùng cộng đồng người dùng Mimi.
              </p>
            </div>
            <a
              href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-8 !py-4 !text-base"
            >
              <span>Tham Gia Server Hỗ Trợ</span>
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* ── Liên kết nhanh ────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {quickLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="glass-panel card-lift group flex items-center gap-4 rounded-3xl p-6 hover:border-mimi-green/40"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-mimi-green/25 bg-mimi-green/10 text-mimi-green transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{l.title}</h3>
                  <p className="text-xs text-gray-400">{l.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── FAQ accordion ─────────────────────────────────────── */}
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold text-white">Câu Hỏi Thường Gặp</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={i}
                  className={`glass-panel overflow-hidden rounded-3xl transition-colors ${
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
                    <div className="animate-fade-in px-6 pb-6 pl-14 text-sm leading-relaxed text-gray-400">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
