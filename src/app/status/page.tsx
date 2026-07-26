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
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
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
          <div className="glass-panel card-lift space-y-3 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Độ Trễ Discord Gateway
              </span>
              <Wifi className="h-5 w-5 text-mimi-green" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold text-white">
                {status && status.wsPing >= 0 ? status.wsPing : '—'}
              </span>
              <span className="text-sm font-semibold text-mimi-green">ms</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs ${quality.color}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              <span>{quality.label}</span>
            </div>
          </div>

          {/* Uptime */}
          <div className="glass-panel card-lift space-y-3 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Thời Gian Hoạt Động
              </span>
              <Zap className="h-5 w-5 text-mimi-cyan" />
            </div>
            <div className="font-mono text-2xl font-extrabold leading-snug text-white">
              {status ? formatUptime(status.uptimeSeconds) : '—'}
            </div>
            <p className="text-xs text-gray-400">Tính từ lần khởi động gần nhất của bot</p>
          </div>

          {/* Máy chủ + thành viên */}
          <div className="glass-panel card-lift space-y-3 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Máy Chủ Đang Phục Vụ
              </span>
              <Server className="h-5 w-5 text-mimi-violet" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold text-white">
                {status ? formatCompact(status.guildCount) : '—'}
              </span>
              <span className="text-sm font-semibold text-mimi-violet">servers</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <Users className="h-3.5 w-3.5" />
              <span>
                {status ? formatCompact(status.reachableUsers) : '—'} thành viên tiếp cận
              </span>
            </p>
          </div>

          {/* Phiên voice */}
          <div className="glass-panel card-lift space-y-3 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Phiên Nghe Nhạc
              </span>
              <Radio className="h-5 w-5 text-mimi-amber" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold text-white">
                {status ? status.activeVoiceSessions : '—'}
              </span>
              <span className="text-sm font-semibold text-mimi-amber">kênh voice</span>
            </div>
            <p className="text-xs text-gray-400">Số kết nối voice đang phát nhạc lúc này</p>
          </div>
        </div>

        {/* ── Bảng hạ tầng ─────────────────────────────────────── */}
        <div className="glass-panel space-y-6 rounded-3xl p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Globe className="h-5 w-5 text-mimi-green" />
              <span>Hạ Tầng Hệ Thống</span>
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                online
                  ? 'bg-mimi-green/20 text-mimi-green'
                  : 'bg-mimi-amber/20 text-mimi-amber'
              }`}
            >
              {online ? 'All Systems Operational' : 'Partial Outage'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Thành Phần</th>
                  <th className="px-4 py-3">Vị Trí</th>
                  <th className="px-4 py-3">Trạng Thái</th>
                  <th className="px-4 py-3">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <tr>
                  <td className="flex items-center gap-2 px-4 py-4 font-semibold text-white">
                    <Server className="h-4 w-4 text-mimi-green" />
                    <span>Bot Core (Discord Gateway)</span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">VibeHost — Việt Nam</td>
                  <td className="px-4 py-4">
                    <StatusBadge online={online} loading={loading} />
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-400">
                    {status && status.wsPing >= 0 ? `ws ping ${status.wsPing}ms` : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="flex items-center gap-2 px-4 py-4 font-semibold text-white">
                    <ShieldCheck className="h-4 w-4 text-mimi-violet" />
                    <span>Web Dashboard & API Proxy</span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">Nhân Hòa cPanel — Việt Nam</td>
                  <td className="px-4 py-4">
                    {/* Trang này đang được phục vụ từ chính web server đó */}
                    <StatusBadge online loading={false} />
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-400">
                    Next.js 14 · Phusion Passenger
                  </td>
                </tr>
                <tr>
                  <td className="flex items-center gap-2 px-4 py-4 font-semibold text-white">
                    <Zap className="h-4 w-4 text-mimi-cyan" />
                    <span>Internal API (Web ↔ Bot)</span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">Kênh nội bộ có xác thực token</td>
                  <td className="px-4 py-4">
                    <StatusBadge online={!error && !!status} loading={loading} />
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-400">
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
