'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AudioLines,
  LayoutDashboard,
  Terminal,
  Activity,
  LifeBuoy,
  Menu,
  X,
  Sparkles,
  Home,
} from 'lucide-react';
import { env } from '@/lib/env';

const navItems = [
  { href: '/', label: 'Trang Chủ', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/commands', label: 'Lệnh', icon: Terminal },
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
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-2xl bg-gradient-brand p-[2px] shadow-glow transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#05060f]">
                <AudioLines className="h-5 w-5 text-mimi-green transition-colors group-hover:text-mimi-cyan" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
                Mimi
                <span className="rounded-full border border-mimi-green/30 bg-mimi-green/15 px-2 py-0.5 text-[10px] font-bold text-mimi-green">
                  v2.1
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
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
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-brand font-semibold text-[#05060f] shadow-md shadow-mimi-green/25'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={env.NEXT_PUBLIC_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-5 !py-2.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Mời Mimi</span>
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
            <div className="mt-2 border-t border-white/10 pt-3">
              <a
                href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <Sparkles className="h-4 w-4" />
                <span>Mời Mimi Vào Server</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
