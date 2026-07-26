'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, LayoutDashboard, Terminal, Activity, HelpCircle, Menu, X, Sparkles } from 'lucide-react';
import { env } from '@/lib/env';

const navItems = [
  { href: '/', label: 'Trang Chủ', icon: Music },
  { href: '/dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
  { href: '/commands', label: 'Lệnh Bot', icon: Terminal },
  { href: '/status', label: 'Trạng Thái', icon: Activity },
  { href: '/support', label: 'Hỗ Trợ', icon: HelpCircle },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070711]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mimi-green to-mimi-cyan p-0.5 shadow-glow transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#070711] rounded-[10px] flex items-center justify-center">
                <Music className="w-5 h-5 text-mimi-green group-hover:text-mimi-cyan transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Mimi <span className="text-xs px-2 py-0.5 rounded-full bg-mimi-green/20 text-mimi-green border border-mimi-green/30 font-medium">v1.1</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">Discord Music Ecosystem</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121224]/80 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-mimi-green text-[#070711] font-semibold shadow-md shadow-mimi-green/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={env.NEXT_PUBLIC_BOT_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-bold text-sm shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Thêm Vào Discord</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-2xl glass-panel-glow border border-white/10 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-mimi-green text-[#070711] font-semibold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 mt-1">
              <a
                href={env.NEXT_PUBLIC_BOT_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-bold text-sm shadow-glow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Thêm Vào Discord</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
