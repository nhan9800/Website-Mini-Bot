'use client';

import React, { useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Sparkles,
  Shield,
} from 'lucide-react';

export type StatusModalType = 'success' | 'warning' | 'error' | 'info';

export interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: StatusModalType;
  title: string;
  description?: string | React.ReactNode;
  badge?: string;
  confirmText?: string;
  onConfirm?: () => void;
  brandName?: string;
}

export function StatusModal({
  isOpen,
  onClose,
  type = 'success',
  title,
  description,
  badge,
  confirmText = 'Đã hiểu',
  onConfirm,
  brandName = 'MIMI SHIELD STORE',
}: StatusModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') {
        if (onConfirm) onConfirm();
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      badgeText: badge || 'THÀNH CÔNG',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      ringColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      glowColor: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
      btnClass:
        'bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      iconColor: 'text-emerald-400',
    },
    warning: {
      icon: AlertTriangle,
      badgeText: badge || 'CHÚ Ý / YÊU CẦU',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      ringColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      glowColor: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
      btnClass:
        'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      iconColor: 'text-amber-400',
    },
    error: {
      icon: XCircle,
      badgeText: badge || 'THẤT BẠI / LỖI',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      ringColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      glowColor: 'shadow-[0_0_35px_rgba(244,63,94,0.25)]',
      btnClass:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      iconColor: 'text-rose-400',
    },
    info: {
      icon: Info,
      badgeText: badge || 'THÔNG BÁO',
      badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      ringColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.25)]',
      btnClass:
        'bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:from-cyan-400 hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      iconColor: 'text-cyan-400',
    },
  }[type];

  const IconComponent = config.icon;

  const handleAction = () => {
    if (onConfirm) onConfirm();
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0e1220]/95 p-6 sm:p-8 text-center text-white shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in zoom-in-95 fade-in duration-200 ${config.glowColor}`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(46, 204, 113, 0.1)',
        }}
      >
        {/* Subtle Ambient Radial Light */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-mimi-green/20 blur-3xl" />

        {/* Header: Brand & Close Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Shield className="h-4 w-4 text-mimi-green" />
            <span>{brandName}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Center Animated Icon with Pulsing Rings */}
        <div className="my-3 flex justify-center">
          <div className="relative">
            {/* Outer Pulsing Aura */}
            <div
              className={`absolute -inset-2 rounded-full border border-dashed opacity-40 animate-spin-slow ${config.ringColor}`}
            />
            {/* Inner Ring */}
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-transform duration-300 hover:scale-105 ${config.ringColor}`}
            >
              <IconComponent className={`h-10 w-10 ${config.iconColor} animate-in zoom-in duration-300`} />
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 mb-3 flex justify-center">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${config.badgeClass}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{config.badgeText}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <div className="text-sm leading-relaxed text-gray-300 px-2 mb-6">
            {description}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAction}
          className={`w-full rounded-2xl py-3.5 px-6 font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-200 active:scale-95 ${config.btnClass}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
