'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Sparkles,
  Shield,
  Copy,
  Check,
} from 'lucide-react';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface NotificationOptions {
  type?: NotificationType;
  title: string;
  description?: string | React.ReactNode;
  badge?: string;
  confirmText?: string;
  onConfirm?: () => void;
  brandName?: string;
}

interface NotificationContextType {
  show: (options: NotificationOptions) => void;
  success: (options: Omit<NotificationOptions, 'type'> | string) => void;
  warning: (options: Omit<NotificationOptions, 'type'> | string) => void;
  error: (options: Omit<NotificationOptions, 'type'> | string) => void;
  info: (options: Omit<NotificationOptions, 'type'> | string) => void;
  close: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<(NotificationOptions & { isOpen: boolean }) | null>(null);

  const close = useCallback(() => {
    setModal((prev) => (prev ? { ...prev, isOpen: false } : null));
  }, []);

  const show = useCallback((options: NotificationOptions) => {
    setModal({
      ...options,
      type: options.type || 'info',
      isOpen: true,
      confirmText: options.confirmText || 'Đã hiểu',
      brandName: options.brandName || 'MIMI STORE',
    });
  }, []);

  const success = useCallback(
    (options: Omit<NotificationOptions, 'type'> | string) => {
      if (typeof options === 'string') {
        show({ type: 'success', title: options, badge: 'THÀNH CÔNG' });
      } else {
        show({ ...options, type: 'success', badge: options.badge || 'THÀNH CÔNG' });
      }
    },
    [show]
  );

  const warning = useCallback(
    (options: Omit<NotificationOptions, 'type'> | string) => {
      if (typeof options === 'string') {
        show({ type: 'warning', title: options, badge: 'CHÚ Ý / YÊU CẦU' });
      } else {
        show({ ...options, type: 'warning', badge: options.badge || 'CHÚ Ý / YÊU CẦU' });
      }
    },
    [show]
  );

  const error = useCallback(
    (options: Omit<NotificationOptions, 'type'> | string) => {
      if (typeof options === 'string') {
        show({ type: 'error', title: options, badge: 'THẤT BẠI' });
      } else {
        show({ ...options, type: 'error', badge: options.badge || 'THẤT BẠI' });
      }
    },
    [show]
  );

  const info = useCallback(
    (options: Omit<NotificationOptions, 'type'> | string) => {
      if (typeof options === 'string') {
        show({ type: 'info', title: options, badge: 'THÔNG BÁO' });
      } else {
        show({ ...options, type: 'info', badge: options.badge || 'THÔNG BÁO' });
      }
    },
    [show]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modal?.isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') {
        if (modal.onConfirm) modal.onConfirm();
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, close]);

  const typeConfig = {
    success: {
      outerRing: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      innerRing: 'border-emerald-500 text-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      btnClass: 'bg-[#10b981] hover:bg-[#059669] text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)]',
      icon: CheckCircle2,
      defaultBadge: 'THÀNH CÔNG',
    },
    warning: {
      outerRing: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      innerRing: 'border-amber-500 text-amber-400',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      btnClass: 'bg-[#f59e0b] hover:bg-[#d97706] text-black shadow-[0_4px_20px_rgba(245,158,11,0.35)]',
      icon: AlertTriangle,
      defaultBadge: 'CHÚ Ý',
    },
    error: {
      outerRing: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      innerRing: 'border-rose-500 text-rose-400',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      btnClass: 'bg-[#f43f5e] hover:bg-[#e11d48] text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)]',
      icon: XCircle,
      defaultBadge: 'THẤT BẠI',
    },
    info: {
      outerRing: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      innerRing: 'border-cyan-500 text-cyan-400',
      badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      btnClass: 'bg-[#06b6d4] hover:bg-[#0891b2] text-black shadow-[0_4px_20px_rgba(6,182,212,0.35)]',
      icon: Info,
      defaultBadge: 'THÔNG BÁO',
    },
  }[modal?.type || 'info'];

  const IconComp = typeConfig.icon;

  return (
    <NotificationContext.Provider value={{ show, success, warning, error, info, close }}>
      {children}

      {/* Modal Popup khớp 100% hình mẫu đính kèm (Ảnh 2) nhưng hiện đại & mượt mà */}
      {modal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
            onClick={close}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#0f1422] p-7 text-center shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in zoom-in-95 fade-in"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(16, 185, 129, 0.12)',
            }}
          >
            {/* Header: Brand & Close */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-300">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>{modal.brandName}</span>
              </div>
              <button
                onClick={close}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Central Double-Ring Animated Icon (Đặc trưng hình 2) */}
            <div className="my-3 flex justify-center">
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full border-2 transition-transform duration-300 hover:scale-105 ${typeConfig.outerRing}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${typeConfig.innerRing}`}
                >
                  <IconComp className="h-8 w-8" />
                </div>
              </div>
            </div>

            {/* Pill Capsule Badge */}
            <div className="mt-3 mb-2 flex justify-center">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${typeConfig.badgeClass}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{modal.badge || typeConfig.defaultBadge}</span>
              </div>
            </div>

            {/* Main Title */}
            <h3 className="text-2xl font-black tracking-tight text-white mt-2 mb-1">
              {modal.title}
            </h3>

            {/* Description / Content */}
            {modal.description && (
              <div className="text-sm leading-relaxed text-gray-300 px-1 mb-6 mt-2">
                {modal.description}
              </div>
            )}

            {/* Full-width Solid Action Button */}
            <button
              onClick={() => {
                if (modal.onConfirm) modal.onConfirm();
                close();
              }}
              className={`w-full rounded-2xl py-3.5 px-6 font-extrabold text-sm sm:text-base tracking-wide transition-all duration-150 active:scale-[0.98] ${typeConfig.btnClass}`}
            >
              {modal.confirmText || 'Đã hiểu'}
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
