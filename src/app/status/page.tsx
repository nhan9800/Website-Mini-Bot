'use client';

import React, { useEffect, useState } from 'react';
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
  Rocket,
  Clock,
  Music,
  Bot,
  Sparkles,
  Crown,
  Hash,
} from 'lucide-react';
import { useBotStatus } from '@/lib/use-bot-status';
import { formatCompact, formatUptime } from '@/lib/format';
import { MotionReveal } from '@/components/ui/motion-primitives';
import type { CommunitySummary } from '@/app/api/communities/route';

function pingQuality(ping: number): { label: string; color: string } {
  if (ping < 0) return { label: 'Chưa có dữ liệu', color: 'text-gray-400' };
  if (ping <= 60) return { label: 'Phản hồi cực nhanh', color: 'text-mimi-green' };
  if (ping <= 150) return { label: 'Ổn định', color: 'text-mimi-cyan' };
  if (ping <= 300) return { label: 'Hơi chậm', color: 'text-mimi-amber' };
  return { label: 'Chậm, đang theo dõi', color: 'text-mimi-pink' };
}

export default function StatusPage() {
  const { status, error, loading, lastUpdated, refresh } = useBotStatus(15000);
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/communities', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!controller.signal.aborted && response.ok && data?.ok && Array.isArray(data.communities)) {
          setCommunities(data.communities);
        }
      })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setCommunitiesLoading(false); });
    return () => controller.abort();
  }, []);

  const online = status?.online === true;
  const quality = pingQuality(status?.wsPing ?? -1);

  return (
    <div className="relative min-h-screen py-14 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <MotionReveal variant="mask" className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
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
        </MotionReveal>

        {/* ── Cảnh báo lỗi ──────────────────────────────────────── */}
        {error && !loading && (
          <MotionReveal variant="drift" className="glass-panel flex items-start gap-4 rounded-3xl border-mimi-pink/30 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mimi-pink/15 text-mimi-pink">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white">Không lấy được dữ liệu từ bot</h3>
              <p className="text-sm leading-relaxed text-gray-400">{error}</p>
              <p className="text-xs text-gray-500">
                Website vẫn hoạt động bình thường; kết nối Web ↔ Bot đang gián đoạn.
              </p>
            </div>
          </MotionReveal>
        )}

        {/* ── Thẻ số liệu ───────────────────────────────────────── */}
        <MotionReveal variant="scale" delay={0.06} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Ping */}
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(46,204,113,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Độ Trễ Gateway
              </span>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-mimi-green/30 bg-mimi-green/10 shadow-[0_0_20px_rgba(46,204,113,0.25)] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-mimi-green/50">
                <Rocket className="h-8 w-8 text-mimi-green drop-shadow-[0_2px_8px_rgba(46,204,113,0.5)]" />
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
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Thời Gian Hoạt Động
              </span>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-mimi-cyan/30 bg-mimi-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-mimi-cyan/50">
                <Clock className="h-8 w-8 text-mimi-cyan drop-shadow-[0_2px_8px_rgba(34,211,238,0.5)]" />
              </div>
            </div>
            <div className="font-mono text-3xl font-black leading-snug text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 relative z-10">
              {status ? formatUptime(status.uptimeSeconds) : '—'}
            </div>
            <p className="text-xs font-medium text-gray-500 relative z-10">Tính từ lần khởi động gần nhất của bot</p>
          </div>

          {/* Máy chủ + thành viên */}
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Máy Chủ Đang Phục Vụ
              </span>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-mimi-purple/30 bg-mimi-purple/15 shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-mimi-purple/50">
                <Server className="h-8 w-8 text-mimi-purple drop-shadow-[0_2px_8px_rgba(139,92,246,0.5)]" />
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
          <div className="glass-panel-glow gradient-ring relative overflow-hidden group space-y-3 rounded-3xl p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(244,114,182,0.15)]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Phiên Nghe Nhạc
              </span>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-mimi-pink/30 bg-mimi-pink/10 shadow-[0_0_20px_rgba(244,114,182,0.25)] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-mimi-pink/50">
                <Music className="h-8 w-8 text-mimi-pink drop-shadow-[0_2px_8px_rgba(244,114,182,0.5)]" />
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
        </MotionReveal>

        {/* ── Các server đang phục vụ ───────────────────────────── */}
        <MotionReveal variant="clip" delay={0.1}>
        <section aria-labelledby="served-communities" className="glass-panel-glow gradient-ring relative overflow-hidden space-y-6 rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-mimi-purple/[0.06] via-transparent to-mimi-cyan/[0.04]" />
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mimi-cyan"><Radio className="h-3.5 w-3.5" /> Đồng bộ trực tiếp từ Discord</p>
              <h2 id="served-communities" className="mt-2 flex items-center gap-2 text-2xl font-black text-white"><Server className="h-6 w-6 text-mimi-purple" /> Máy chủ Mimi đang phục vụ</h2>
              <p className="mt-2 text-sm text-gray-400">{status ? `${formatCompact(status.guildCount)} server đang kết nối` : 'Đang lấy số server…'} · hiển thị chủ server và thống kê cơ bản.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mimi-green/25 bg-mimi-green/10 px-3 py-1.5 text-xs font-semibold text-mimi-green"><Hash className="h-3.5 w-3.5" /> {status ? formatCompact(status.guildCount) : (communities.length || '—')} server</span>
          </div>
          <div className="relative z-10">
            {communitiesLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="hidden h-24 animate-pulse rounded-2xl bg-white/[0.04] sm:block" /><div className="hidden h-24 animate-pulse rounded-2xl bg-white/[0.04] lg:block" /></div>
            ) : communities.length === 0 ? (
              <p role="status" className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-gray-400">Danh sách server chưa được công khai từ cấu hình bot. Số tổng vẫn lấy từ Gateway.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {communities.map((community) => (
                  <article key={community.id} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-3.5 transition-colors hover:border-mimi-purple/40">
                    {community.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={community.iconUrl} alt="" className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover" />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mimi-purple/30 bg-mimi-purple/10 text-mimi-purple"><Server className="h-5 w-5" /></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-white" title={community.name}>{community.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400"><Users className="h-3.5 w-3.5 text-mimi-cyan" /> {community.memberCount.toLocaleString('vi-VN')} thành viên</p>
                      <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs text-gray-500" title={community.owner?.id || undefined}><Crown className="h-3.5 w-3.5 shrink-0 text-mimi-amber" /> <span className="truncate">{community.owner?.displayName || community.owner?.username || 'Chưa xác định'}{community.owner?.username && community.owner.username !== community.owner.displayName ? <span className="ml-1 text-gray-600">@{community.owner.username}</span> : null}</span></p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        </MotionReveal>

        {/* ── Bảng hạ tầng ─────────────────────────────────────── */}
        <MotionReveal variant="flip" delay={0.12}>
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mimi-green/30 bg-mimi-green/10 text-mimi-green shadow-[0_0_12px_rgba(46,204,113,0.2)] group-hover:scale-105 group-hover:border-mimi-green/60 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <Bot className="h-5 w-5" />
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mimi-cyan/30 bg-mimi-cyan/10 text-mimi-cyan shadow-[0_0_12px_rgba(34,211,238,0.2)] group-hover:scale-105 group-hover:border-mimi-cyan/60 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <ShieldCheck className="h-5 w-5" />
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mimi-purple/30 bg-mimi-purple/15 text-mimi-violet shadow-[0_0_12px_rgba(139,92,246,0.2)] group-hover:scale-105 group-hover:border-mimi-purple/60 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <Zap className="h-5 w-5" />
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
        </MotionReveal>
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
