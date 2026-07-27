'use client';

import React from 'react';
import {
  Activity,
  Server,
  Zap,
  Wifi,
  RefreshCw,
  ShieldCheck,
  Users,
  Radio,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { useBotStatus } from '@/lib/use-bot-status';
import { formatCompact, formatUptime } from '@/lib/format';
import { Icon3D } from '@/components/ui/icon3d';

function pingQuality(ping: number): { label: string; color: string } {
  if (ping < 0) return { label: 'Chưa có dữ liệu', color: 'text-gray-400' };
  if (ping <= 60) return { label: 'Phản hồi cực nhanh', color: 'text-mimi-green' };
  if (ping <= 150) return { label: 'Ổn định', color: 'text-mimi-cyan' };
  if (ping <= 300) return { label: 'Hơi chậm', color: 'text-mimi-amber' };
  return { label: 'Chậm — đang theo dõi', color: 'text-mimi-pink' };
}

export default function StatusPage() {
  const { status, error, loading, lastUpdated, refresh } = useBotStatus(15000);

  const online = status?.online === true;
  const quality = pingQuality(status?.wsPing ?? -1);

  return (
    <div className="relative min-h-screen py-14 overflow-hidden">
      {/* ── Background Cyber-Grid & Orbs ──────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-mimi-purple/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-mimi-green/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                loading
                  ? 'bg-white/5 text-gray-400'
                  : online
                    ? 'bg-mimi-green/10 text-mimi-green'
                    : 'bg-mimi-pink/10 text-mimi-pink'
              }`}
            >
              <Activity className={`h-3.5 w-3.5 ${online ? 'animate-pulse' : ''}`} />
              <span>
                {loading
                  ? 'Đang kết nối với hệ thống Mimi…'
                  : online
                    ? 'Tất cả hệ thống hoạt động bình thường'
                    : 'Bot đang ngoại tuyến hoặc không thể kết nối'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trạng Thái Hệ Thống <span className="text-gradient-mimi">Thời Gian Thực</span>
            </h1>
            <p className="text-sm text-gray-400 sm:text-base">
              Số liệu lấy trực tiếp từ Internal API của bot — tự làm mới mỗi 15 giây.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="btn-secondary shrink-0 !px-5 !py-3 !text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>
              Làm mới
              {lastUpdated ? ` (${lastUpdated.toLocaleTimeString('vi-VN')})` : ''}
            </span>
          </button>
        </div>

        {/* ── Cảnh báo lỗi ──────────────────────────────────────── */}
        {error && !loading && (
          <div className="glass-panel flex items-start gap-4 rounded-3xl border-mimi-pink/30 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mimi-pink/15 text-mimi-pink">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white">Không lấy được dữ liệu từ bot</h3>
              <p className="text-sm leading-relaxed text-gray-400">{error}</p>
              <p className="text-xs text-gray-500">
                Website vẫn hoạt động bình thường — chỉ kết nối Web ↔ Bot đang gián đoạn.
              </p>
            </div>
          </div>
        )}

        {/* ── Thẻ số liệu ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Ping */}
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(46,204,113,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Độ Trễ Gateway
              </span>
              <div className="transition-transform duration-500 group-hover:animate-float">
                <Icon3D name="rocket" size={48} className="drop-shadow-[0_10px_15px_rgba(46,204,113,0.3)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-sm">
                {status && status.wsPing >= 0 ? status.wsPing : '—'}
              </span>
              <span className="text-sm font-bold text-mimi-green">ms</span>
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold relative z-10 ${quality.color}`}>
              {/* Radar pulse effect */}
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
              </div>
              <span>{quality.label}</span>
            </div>
          </div>

          {/* Uptime */}
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Thời Gian Hoạt Động
              </span>
              <div className="transition-transform duration-500 group-hover:animate-float" style={{ animationDelay: '0.2s' }}>
                <Icon3D name="clock" size={48} className="drop-shadow-[0_10px_15px_rgba(34,211,238,0.3)]" />
              </div>
            </div>
            <div className="font-mono text-3xl font-black leading-snug text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 relative z-10">
              {status ? formatUptime(status.uptimeSeconds) : '—'}
            </div>
            <p className="text-xs font-medium text-gray-500 relative z-10">Tính từ lần khởi động gần nhất của bot</p>
          </div>

          {/* Máy chủ + thành viên */}
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Máy Chủ Đang Phục Vụ
              </span>
              <div className="transition-transform duration-500 group-hover:animate-float" style={{ animationDelay: '0.4s' }}>
                <Icon3D name="robot" size={48} className="drop-shadow-[0_10px_15px_rgba(139,92,246,0.3)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                {status ? formatCompact(status.guildCount) : '—'}
              </span>
              <span className="text-sm font-bold text-mimi-violet">servers</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 relative z-10">
              <Users className="h-4 w-4 text-mimi-violet" />
              <span>
                {status ? formatCompact(status.reachableUsers) : '—'} thành viên
              </span>
            </p>
          </div>

          {/* Phiên voice */}
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(244,114,182,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Phiên Nghe Nhạc
              </span>
              <div className="transition-transform duration-500 group-hover:animate-float" style={{ animationDelay: '0.6s' }}>
                <Icon3D name="music" size={48} className="drop-shadow-[0_10px_15px_rgba(244,114,182,0.3)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                {status ? status.activeVoiceSessions : '—'}
              </span>
              <span className="text-sm font-bold text-mimi-pink">kênh voice</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 relative z-10">
              <Radio className="h-4 w-4 text-mimi-pink animate-pulse" />
              <span>Số kết nối voice hiện tại</span>
            </p>
          </div>
        </div>

        {/* ── Bảng hạ tầng ─────────────────────────────────────── */}
        <div className="glass-panel-glow gradient-ring relative overflow-hidden space-y-6 rounded-[2rem] p-8">
          {/* Lớp nền mờ bên trong bảng */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
          
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-6">
            <h2 className="flex items-center gap-2.5 text-2xl font-black text-white">
              <Globe className="h-6 w-6 text-mimi-cyan" />
              <span>Hạ Tầng Hệ Thống</span>
            </h2>
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold shadow-lg ${
                online
                  ? 'bg-mimi-green/20 text-mimi-green border border-mimi-green/30'
                  : 'bg-mimi-amber/20 text-mimi-amber border border-mimi-amber/30'
              }`}
            >
              {online ? 'All Systems Operational' : 'Partial Outage'}
            </span>
          </div>

          <div className="relative z-10 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  <th className="px-4 py-3">Thành Phần</th>
                  <th className="px-4 py-3">Vị Trí</th>
                  <th className="px-4 py-3">Trạng Thái</th>
                  <th className="px-4 py-3">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <tr className="group hover:bg-white/[0.02] transition-colors">
                  <td className="flex items-center gap-3 px-4 py-5 font-bold text-white">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-mimi-green/50 transition-colors">
                      <Icon3D name="robot" size={24} />
                    </div>
                    <span>Bot Core (Discord Gateway)</span>
                  </td>
                  <td className="px-4 py-5 text-gray-400 font-medium">VibeHost — Việt Nam</td>
                  <td className="px-4 py-5">
                    <StatusBadge online={online} loading={loading} />
                  </td>
                  <td className="px-4 py-5 font-mono text-xs font-semibold text-gray-500">
                    {status && status.wsPing >= 0 ? `ws ping ${status.wsPing}ms` : '—'}
                  </td>
                </tr>
                <tr className="group hover:bg-white/[0.02] transition-colors">
                  <td className="flex items-center gap-3 px-4 py-5 font-bold text-white">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-mimi-cyan/50 transition-colors">
                      <Icon3D name="shield" size={24} />
                    </div>
                    <span>Web Dashboard & API Proxy</span>
                  </td>
                  <td className="px-4 py-5 text-gray-400 font-medium">Nhân Hòa cPanel — Việt Nam</td>
                  <td className="px-4 py-5">
                    <StatusBadge online loading={false} />
                  </td>
                  <td className="px-4 py-5 font-mono text-xs font-semibold text-gray-500">
                    Next.js 14 · Phusion Passenger
                  </td>
                </tr>
                <tr className="group hover:bg-white/[0.02] transition-colors">
                  <td className="flex items-center gap-3 px-4 py-5 font-bold text-white">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-mimi-purple/50 transition-colors">
                      <Icon3D name="sparkles" size={24} />
                    </div>
                    <span>Internal API (Web ↔ Bot)</span>
                  </td>
                  <td className="px-4 py-5 text-gray-400 font-medium">Kênh nội bộ có xác thực token</td>
                  <td className="px-4 py-5">
                    <StatusBadge online={!error && !!status} loading={loading} />
                  </td>
                  <td className="px-4 py-5 font-mono text-xs font-semibold text-gray-500">
                    {status?.updatedAt
                      ? `cập nhật ${new Date(status.updatedAt).toLocaleTimeString('vi-VN')}`
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ online, loading }: { online: boolean; loading: boolean }) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
        Đang kiểm tra
      </span>
    );
  }
  return online ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mimi-green/20 px-2.5 py-0.5 text-xs font-semibold text-mimi-green">
      <span className="h-1.5 w-1.5 rounded-full bg-mimi-green" />
      Online
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mimi-pink/20 px-2.5 py-0.5 text-xs font-semibold text-mimi-pink">
      <span className="h-1.5 w-1.5 rounded-full bg-mimi-pink" />
      Offline
    </span>
  );
}
