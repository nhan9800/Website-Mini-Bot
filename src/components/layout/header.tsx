'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Terminal,
  Activity,
  LifeBuoy,
  Menu,
  X,
  Sparkles,
  Home,
  Headphones,
  Star,
  Shield,
} from 'lucide-react';
import { env } from '@/lib/env';

const navItems = [
  { href: '/', label: 'Trang Chủ', icon: Home },
  { href: '/pricing', label: 'Bảng Giá & Key', icon: Shield },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/commands', label: 'Lệnh', icon: Terminal },
  { href: '/partners', label: 'Đối Tác', icon: Star },
  { href: '/status', label: 'Trạng Thái', icon: Activity },
  { href: '/support', label: 'Hỗ Trợ', icon: LifeBuoy },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#05060f]/85 py-3 shadow-lg shadow-black/40 backdrop-blur-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative h-11 w-11 shrink-0 rounded-2xl bg-gradient-brand p-[2px] shadow-glow transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#05060f]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.webp" alt="Mimi Bot Logo" className="h-full w-full rounded-[14px] object-cover" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                MIMI BOT
                <span className="rounded-full border border-mimi-green/30 bg-mimi-green/15 px-2 py-0.5 text-[10px] font-bold text-mimi-green shrink-0">
                  v2.2
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 whitespace-nowrap">
                Music · Community
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#0b0d1c]/80 p-1.5 shadow-inner backdrop-blur-md lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-brand font-semibold text-[#05060f] shadow-md shadow-mimi-green/25'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <div className="hidden items-center gap-2 xl:gap-3 lg:flex shrink-0">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-mimi-feedback'))}
              className="group relative inline-flex shrink-0 items-center gap-2 rounded-full border border-yellow-400/50 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/15 px-3 xl:px-4 py-2 text-sm font-bold text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.25)] transition-all duration-300 hover:border-yellow-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.45)]"
              title="Đánh giá & Góp ý cho MIMI"
            >
              <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400 animate-pulse" />
              <span className="whitespace-nowrap">Đánh Giá</span>
            </button>
            <a
              href={env.NEXT_PUBLIC_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0 !px-4 xl:!px-5 !py-2.5"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Mời MIMI</span>
            </a>
          </div>

          {/* Nút menu mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-colors hover:text-white lg:hidden"
            aria-label="Mở menu điều hướng"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="glass-panel-glow mt-4 flex animate-fade-up flex-col gap-1.5 rounded-3xl p-4 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gradient-brand font-semibold text-[#05060f]'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-2.5 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-mimi-feedback'));
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-yellow-400/40 bg-yellow-500/15 px-4 py-3 text-sm font-bold text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.25)] transition-colors hover:bg-yellow-500/25"
              >
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                <span>⭐ Đánh Giá & Góp Ý MIMI</span>
              </button>
              <a
                href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <Sparkles className="h-4 w-4" />
                <span>Mời MIMI Vào Server</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
