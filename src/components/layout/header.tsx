'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ArrowUpRight, LayoutDashboard, LifeBuoy, Menu, Shield, Terminal, Users, X } from 'lucide-react';
import { env } from '@/lib/env';
import { websiteVersion } from '@/lib/release-info';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/commands', label: 'Lệnh', icon: Terminal },
  { href: '/partners', label: 'Cộng đồng', icon: Users },
  { href: '/status', label: 'Trạng thái', icon: Activity },
  { href: '/support', label: 'Hỗ trợ', icon: LifeBuoy },
  { href: '/pricing', label: 'Mimi Shield', icon: Shield },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    mobileNav.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileMenuOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-surface backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-5">
          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="site-brand flex items-center gap-3" title="Trang chủ Mimi">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="" width={42} height={42} className="rounded-xl border border-white/10" />
              <span className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white">Mimi<span className="text-mimi-green">.</span></span>
                <span className="text-[10px] font-medium tracking-[0.12em] text-gray-400">NHẠC & CỘNG ĐỒNG</span>
              </span>
            </Link>
            <Link href="/changelog" title="Xem bản cập nhật website" className="hidden rounded-md border border-mimi-green/20 bg-mimi-green/[0.06] px-2 py-1 font-mono text-[10px] text-mimi-green sm:block">
              v{websiteVersion}
            </Link>
          </div>

          <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-white/[0.06] text-mimi-green' : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-mimi-green/40 hover:text-white xl:inline-flex">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <a href={env.NEXT_PUBLIC_BOT_INVITE_URL} target="_blank" rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-mimi-green px-4 py-2.5 text-sm font-bold text-[var(--accent-text)] transition-colors hover:bg-mimi-green-bright sm:inline-flex">
              Mời Mimi <ArrowUpRight size={16} />
            </a>
            <button ref={menuButton} type="button" onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg border border-white/15 p-2.5 text-gray-200 xl:hidden"
              aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
              aria-controls="mimi-mobile-navigation" aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav ref={mobileNav} id="mimi-mobile-navigation" aria-label="Điều hướng di động"
            className="max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-white/10 pb-5 pt-3 xl:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${isActive(item.href) ? 'bg-mimi-green/[0.08] text-mimi-green' : 'text-gray-300 hover:bg-white/5'}`}>
                  {Icon ? <Icon size={17} /> : <span className="w-[17px]" aria-hidden />} {item.label}
                </Link>
              );
            })}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white/5 px-3 py-3 text-sm text-gray-200">Dashboard</Link>
              <Link href="/changelog" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white/5 px-3 py-3 text-sm text-gray-200">Cập nhật · v{websiteVersion}</Link>
              <Link href="/reviews" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-gray-400">Đánh giá</Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-gray-400">Mimi Shield</Link>
            </div>
            <a href={env.NEXT_PUBLIC_BOT_INVITE_URL} target="_blank" rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)} className="mt-3 flex items-center justify-between rounded-lg bg-mimi-green px-4 py-3 text-sm font-bold text-[var(--accent-text)] sm:hidden">
              Mời Mimi miễn phí <ArrowUpRight size={18} />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
