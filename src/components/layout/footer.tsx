import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { env } from '@/lib/env';
import { websiteVersion } from '@/lib/release-info';

const exploreLinks = [
  { href: '/commands', label: 'Danh sách lệnh' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/status', label: 'Trạng thái hệ thống' },
  { href: '/partners', label: 'Cộng đồng' },
  { href: '/pricing', label: 'Thuê Mimi Shield' },
];

const resourceLinks = [
  { href: '/support', label: 'Hướng dẫn & hỗ trợ' },
  { href: '/changelog', label: 'Nhật ký cập nhật' },
  { href: '/reviews', label: 'Đánh giá cộng đồng' },
  { href: '/privacy', label: 'Chính sách bảo mật' },
  { href: '/terms', label: 'Điều khoản dịch vụ' },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="" width={36} height={36} className="rounded-lg border border-white/10" />
              <span className="text-2xl font-extrabold tracking-tight text-white">Mimi<span className="text-mimi-green">.</span></span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">Âm nhạc, kết nối và những công cụ chăm sóc cộng đồng. Mimi Bot dành cho máy chủ Discord của bạn, miễn phí.</p>
            <Link href="/changelog" className="mt-5 inline-block font-mono text-xs text-gray-400 hover:text-mimi-green">Website v{websiteVersion}</Link>
          </div>
          <FooterLinks title="Khám phá" links={exploreLinks} />
          <FooterLinks title="Tài nguyên" links={resourceLinks} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Gặp nhau trên Discord</h3>
            <p className="mt-5 text-sm leading-7 text-gray-400">Hỏi cách sử dụng, báo lỗi hoặc chia sẻ một bài nhạc cùng cộng đồng.</p>
            <a href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mimi-green hover:text-mimi-green-bright">
              Tham gia máy chủ hỗ trợ <ArrowUpRight size={16} />
            </a>
            <Link href="/pricing" className="mt-5 block text-xs leading-6 text-gray-400 hover:text-gray-200">Mimi Shield · Bot bảo vệ riêng, có các gói bản quyền</Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Mimi. Được phát triển cùng cộng đồng Việt.</p>
          <p>Nhạc & cộng đồng · Tiếng Việt · Miễn phí</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">{title}</h3>
      <ul className="mt-5 space-y-3.5 text-sm">
        {links.map((link) => <li key={link.href}><Link href={link.href} className="text-gray-400 transition-colors hover:text-white">{link.label}</Link></li>)}
      </ul>
    </div>
  );
}
