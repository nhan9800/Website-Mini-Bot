'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  Square,
  Volume2,
  ListMusic,
  Settings,
  ArrowLeft,
  CheckCircle2,
  Radio,
  AlertTriangle,
  RefreshCw,
  Users,
  Shield,
  Save,
  Wand2,
} from 'lucide-react';
import type { PlayerState, GuildSettingsResponse, ApiErrorBody } from '@/lib/types';
import { formatDuration } from '@/lib/format';
import { Soundwave } from '@/components/ui/soundwave';
import { adoptAccessKeyFromUrl, accessKeyHeader, clearAccessKey } from '@/lib/access-key';

type PlayerAction = 'pause' | 'resume' | 'skip' | 'stop' | 'volume';

const STORAGE_KEY = 'mimi.recentGuilds';

/** Ghi server vào danh sách "gần đây" trên localStorage cho trang chọn server. */
function rememberGuild(guild: GuildSettingsResponse['guild']) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: any[] = raw ? JSON.parse(raw) : [];
    const next = [
      {
        id: guild.id,
        name: guild.name,
        iconUrl: guild.iconUrl,
        memberCount: guild.memberCount,
        visitedAt: Date.now(),
      },
      ...list.filter((g) => g?.id !== guild.id),
    ].slice(0, 12);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export default function GuildDashboardPage({
  params,
}: {
  params: { guildId: string };
}) {
  const { guildId } = params;
  const [activeTab, setActiveTab] = useState<'player' | 'settings'>('player');

  // Khoá truy cập server này: lấy từ `?key=` trên link do lệnh /dashboard phát ra,
  // lưu vào sessionStorage rồi gỡ khỏi URL. Chưa có khoá thì không gọi API.
  const [accessKey, setAccessKey] = useState<string | null>(null);
  useEffect(() => {
    setAccessKey(adoptAccessKeyFromUrl(guildId));
  }, [guildId]);
  const hasKey = !!accessKey;

  // ── Trạng thái player (từ API thật) ─────────────────────────────
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState<PlayerAction | null>(null);
  const [localPositionMs, setLocalPositionMs] = useState(0);
  const [volumeDraft, setVolumeDraft] = useState<number | null>(null);
  const volumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Trạng thái settings ─────────────────────────────────────────
  const [guildInfo, setGuildInfo] = useState<GuildSettingsResponse['guild'] | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState('mi');
  const [unverifyOnMute, setUnverifyOnMute] = useState(false);
  const [verifyDailyMode, setVerifyDailyMode] = useState(false);
  const [flags, setFlags] = useState<GuildSettingsResponse['settings'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ── Lấy player state, poll mỗi 5s ───────────────────────────────
  const fetchPlayer = useCallback(async () => {
    if (!accessKey) return;
    try {
      const res = await fetch(`/api/guilds/${guildId}/player`, {
        cache: 'no-store',
        headers: accessKeyHeader(accessKey),
      });
      const data = await res.json();
      if (res.ok && data?.ok && data.player) {
        setPlayer(data.player as PlayerState);
        setLocalPositionMs(data.player.positionMs ?? 0);
        setPlayerError(null);
      } else {
        setPlayerError((data as ApiErrorBody)?.error?.message || `Lỗi ${res.status} từ máy chủ.`);
      }
    } catch {
      setPlayerError('Không thể kết nối tới máy chủ web.');
    } finally {
      setPlayerLoading(false);
    }
  }, [guildId, accessKey]);

  useEffect(() => {
    if (!accessKey) return;
    fetchPlayer();
    const t = setInterval(() => {
      if (!document.hidden) fetchPlayer();
    }, 5000);
    return () => clearInterval(t);
  }, [fetchPlayer, accessKey]);

  // Tua tiến trình cục bộ giữa các lần poll (mượt hơn)
  useEffect(() => {
    if (!player?.track || player.paused || !player.connected) return;
    const t = setInterval(() => {
      setLocalPositionMs((p) => Math.min(p + 1000, player.track?.durationMs ?? p + 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [player]);

  // ── Lấy settings ────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    if (!accessKey) return;
    try {
      const res = await fetch(`/api/guilds/${guildId}/settings`, {
        cache: 'no-store',
        headers: accessKeyHeader(accessKey),
      });
      const data = await res.json();
      if (res.ok && data?.ok) {
        const payload = data as GuildSettingsResponse;
        setGuildInfo(payload.guild);
        setPrefix(payload.settings.prefix);
        setUnverifyOnMute(payload.settings.unverifyOnMute);
        setVerifyDailyMode(payload.settings.verifyDailyMode);
        setFlags(payload.settings);
        setSettingsError(null);
        rememberGuild(payload.guild);
      } else {
        setSettingsError((data as ApiErrorBody)?.error?.message || `Lỗi ${res.status} từ máy chủ.`);
      }
    } catch {
      setSettingsError('Không thể kết nối tới máy chủ web.');
    }
  }, [guildId, accessKey]);

  useEffect(() => {
    if (accessKey) fetchSettings();
  }, [fetchSettings, accessKey]);

  // ── Gửi lệnh điều khiển ─────────────────────────────────────────
  const sendAction = useCallback(
    async (action: PlayerAction, extra?: { volume?: number }) => {
      setActionBusy(action);
      try {
        const res = await fetch(`/api/guilds/${guildId}/player`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...accessKeyHeader(accessKey ?? '') },
          body: JSON.stringify({ action, ...extra }),
        });
        const data = await res.json();
        if (res.ok && data?.ok && data.player) {
          setPlayer(data.player as PlayerState);
          setLocalPositionMs(data.player.positionMs ?? 0);
          setPlayerError(null);
        } else {
          setPlayerError((data as ApiErrorBody)?.error?.message || `Lỗi ${res.status}.`);
        }
      } catch {
        setPlayerError('Không gửi được lệnh tới bot.');
      } finally {
        setActionBusy(null);
      }
    },
    [guildId, accessKey]
  );

  // Volume: kéo mượt, chỉ gửi sau khi ngừng kéo 400ms
  const handleVolumeChange = (v: number) => {
    setVolumeDraft(v);
    if (volumeTimer.current) clearTimeout(volumeTimer.current);
    volumeTimer.current = setTimeout(() => {
      sendAction('volume', { volume: v });
      setVolumeDraft(null);
    }, 400);
  };

  // ── Lưu settings ────────────────────────────────────────────────
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch(`/api/guilds/${guildId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...accessKeyHeader(accessKey ?? '') },
        body: JSON.stringify({ prefix: prefix.trim(), unverifyOnMute, verifyDailyMode }),
      });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setSavedSuccess(true);
        setSettingsError(null);
        setTimeout(() => setSavedSuccess(false), 3500);
      } else {
        setSettingsError((data as ApiErrorBody)?.error?.message || `Lỗi ${res.status}.`);
      }
    } catch {
      setSettingsError('Không gửi được cấu hình tới bot.');
    } finally {
      setSaving(false);
    }
  };

  const track = player?.track ?? null;
  const isPlaying = !!player?.connected && !!track && !player.paused;
  const volume = volumeDraft ?? player?.volume ?? 100;
  const durationMs = track?.durationMs ?? 0;
  const progress = durationMs > 0 ? Math.min((localPositionMs / durationMs) * 100, 100) : 0;

  // accessKey === null nghĩa là chưa đọc xong sessionStorage (tránh nháy màn hình khoá)
  if (accessKey === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="h-7 w-7 animate-spin text-mimi-green" />
      </div>
    );
  }

  if (!hasKey) return <NeedKeyScreen guildId={guildId} />;

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Quay lại danh sách server"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            {guildInfo?.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={guildInfo.iconUrl}
                alt=""
                className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-mimi-green/20 to-mimi-purple/20 text-lg font-extrabold text-white">
                {guildInfo?.name?.charAt(0) ?? '?'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-mimi-green">ID: {guildId}</span>
                {guildInfo && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-gray-300">
                    <Users className="h-3 w-3" />
                    {guildInfo.memberCount.toLocaleString('vi-VN')} thành viên
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    playerError || settingsError
                      ? 'bg-mimi-amber/20 text-mimi-amber'
                      : 'bg-mimi-green/20 text-mimi-green'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      playerError || settingsError ? 'bg-mimi-amber' : 'animate-pulse bg-mimi-green'
                    }`}
                  />
                  {playerError || settingsError ? 'Kết nối gián đoạn' : 'Đã kết nối Internal API'}
                </span>
              </div>
              <h1 className="truncate text-2xl font-extrabold text-white sm:text-3xl">
                {guildInfo?.name ?? 'Bảng Điều Khiển Máy Chủ'}
              </h1>
            </div>
          </div>

          {/* Tab */}
          <div className="flex items-center gap-1.5 self-start rounded-2xl border border-white/10 bg-[#0b0d1c] p-1.5 lg:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'player'
                  ? 'bg-gradient-brand text-[#05060f] shadow-glow'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Music className="h-4 w-4" />
              <span>Trình Phát</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-brand text-[#05060f] shadow-glow'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Cấu Hình</span>
            </button>
          </div>
        </div>

        {/* ── Banner lỗi ────────────────────────────────────────── */}
        {(activeTab === 'player' ? playerError : settingsError) && (
          <div className="glass-panel flex items-start gap-4 rounded-3xl border-mimi-amber/30 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-mimi-amber" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-white">
                {activeTab === 'player' ? playerError : settingsError}
              </p>
              <p className="text-xs text-gray-400">
                Kiểm tra: bot đã online chưa · Mimi đã ở trong server này chưa · Guild ID có đúng không.
              </p>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => (activeTab === 'player' ? fetchPlayer() : fetchSettings())}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-colors hover:text-white"
                aria-label="Thử lại"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAccessKey(guildId);
                  setAccessKey('');
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-gray-300 transition-colors hover:text-white"
              >
                Gỡ khoá
              </button>
            </div>
          </div>
        )}

        {/* ══ TAB 1: TRÌNH PHÁT ══════════════════════════════════ */}
        {activeTab === 'player' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cột trái: player */}
            <div className="space-y-6 lg:col-span-7">
              <div className="glass-panel-glow gradient-ring relative space-y-7 overflow-hidden rounded-[2rem] p-7 shadow-2xl sm:p-9">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Radio
                      className={`h-5 w-5 ${isPlaying ? 'animate-pulse text-mimi-green' : 'text-gray-500'}`}
                    />
                    <span className="text-base font-bold text-white">
                      {player?.connected ? 'Đang kết nối kênh thoại' : 'Chưa vào kênh thoại'}
                    </span>
                  </div>
                  <span className="rounded-full bg-mimi-purple/20 px-3 py-1 font-mono text-xs font-semibold text-mimi-violet">
                    {player?.repeatMode === 'track'
                      ? 'Lặp 1 bài'
                      : player?.repeatMode === 'queue'
                        ? 'Lặp hàng chờ'
                        : 'Phát thường'}
                  </span>
                </div>

                {/* Thông tin bài hát */}
                {playerLoading ? (
                  <div className="flex animate-pulse items-center gap-6">
                    <div className="h-28 w-28 rounded-3xl bg-white/5" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-2/3 rounded bg-white/5" />
                      <div className="h-3 w-1/3 rounded bg-white/5" />
                    </div>
                  </div>
                ) : track ? (
                  <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    {track.artworkUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.artworkUrl}
                        alt=""
                        className="h-28 w-28 shrink-0 rounded-3xl border border-white/10 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-mimi-green/30 via-mimi-purple/30 to-mimi-cyan/30 shadow-lg">
                        <Music className="h-14 w-14 text-mimi-green" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-2">
                      {track.requestedBy && (
                        <div className="inline-flex items-center gap-1.5 rounded bg-white/5 px-2.5 py-0.5 text-xs text-gray-300">
                          <span>Yêu cầu bởi</span>
                          <strong className="text-mimi-green">@{track.requestedBy.username}</strong>
                        </div>
                      )}
                      <h2 className="truncate text-2xl font-extrabold text-white">{track.title}</h2>
                      {track.author && <p className="text-sm text-gray-400">{track.author}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-10 text-center">
                    <Music className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="text-lg font-semibold text-gray-300">
                      Không có bài hát nào đang phát
                    </p>
                    <p className="text-sm text-gray-500">
                      Vào kênh thoại trong Discord và gõ{' '}
                      <code className="rounded bg-black/40 px-2 py-0.5 font-mono text-mimi-green">
                        /play tên bài hát
                      </code>{' '}
                      để bắt đầu.
                    </p>
                  </div>
                )}

                {/* Sóng nhạc */}
                <Soundwave playing={isPlaying} className="!h-16" />

                {/* Tiến trình */}
                <div className="space-y-2">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                      style={{ width: `${track?.isStream ? 100 : progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-xs text-gray-400">
                    <span>{formatDuration(localPositionMs)}</span>
                    <span>{track?.isStream ? 'LIVE' : formatDuration(durationMs)}</span>
                  </div>
                </div>

                {/* Điều khiển */}
                <div className="flex flex-wrap items-center justify-between gap-5 pt-1">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-mimi-green" />
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="mimi-slider w-28"
                      style={{ '--fill': `${(volume / 150) * 100}%` } as React.CSSProperties}
                      aria-label="Âm lượng"
                      disabled={!player?.connected}
                    />
                    <span className="w-11 font-mono text-xs text-gray-300">{volume}%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => sendAction(player?.paused ? 'resume' : 'pause')}
                      disabled={!player?.connected || !track || actionBusy !== null}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-[#05060f] shadow-glow transition-all duration-200 hover:shadow-glow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      aria-label={player?.paused ? 'Tiếp tục phát' : 'Tạm dừng'}
                    >
                      {actionBusy === 'pause' || actionBusy === 'resume' ? (
                        <RefreshCw className="h-6 w-6 animate-spin" />
                      ) : player?.paused ? (
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      ) : (
                        <Pause className="h-6 w-6 fill-current" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => sendAction('skip')}
                      disabled={!player?.connected || !track || actionBusy !== null}
                      className="rounded-xl bg-white/5 p-3.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Bỏ qua bài này"
                    >
                      {actionBusy === 'skip' ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <SkipForward className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => sendAction('stop')}
                      disabled={!player?.connected || actionBusy !== null}
                      className="rounded-xl bg-white/5 p-3.5 text-gray-300 transition-colors hover:bg-mimi-pink/15 hover:text-mimi-pink disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Dừng và rời kênh"
                    >
                      {actionBusy === 'stop' ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Chú thích nhỏ */}
              <p className="flex items-center gap-2 px-2 text-xs text-gray-500">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Trạng thái tự làm mới mỗi 5 giây từ Internal API của bot.</span>
              </p>
            </div>

            {/* Cột phải: hàng chờ */}
            <div className="lg:col-span-5">
              <div className="glass-panel space-y-5 rounded-[2rem] p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <ListMusic className="h-5 w-5 text-mimi-cyan" />
                    <span>Hàng Chờ</span>
                  </h3>
                  <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-gray-300">
                    {player?.queue?.length ?? 0} bài
                  </span>
                </div>

                {playerLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                    ))}
                  </div>
                ) : !player?.queue?.length ? (
                  <div className="space-y-2 py-10 text-center">
                    <ListMusic className="mx-auto h-10 w-10 text-gray-600" />
                    <p className="text-sm text-gray-400">Hàng chờ đang trống.</p>
                    <p className="text-xs text-gray-500">
                      Thêm bài bằng lệnh <code className="text-mimi-green">/play</code> trong Discord.
                    </p>
                  </div>
                ) : (
                  <ul className="max-h-[520px] space-y-2.5 overflow-y-auto pr-1">
                    {player.queue.map((q, i) => (
                      <li
                        key={`${q.uri}-${i}`}
                        className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 transition-colors hover:border-white/15 hover:bg-white/[0.06]"
                      >
                        <span className="w-6 shrink-0 text-center font-mono text-sm font-bold text-gray-500">
                          {i + 1}
                        </span>
                        {q.artworkUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={q.artworkUrl}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
                            <Music className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{q.title}</p>
                          <p className="truncate text-xs text-gray-400">
                            {q.author ?? '—'}
                            {q.requestedBy ? ` · @${q.requestedBy.username}` : ''}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-xs text-gray-400">
                          {q.isStream ? 'LIVE' : formatDuration(q.durationMs)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 2: CẤU HÌNH ════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Form cấu hình */}
            <form onSubmit={handleSaveSettings} className="space-y-6 lg:col-span-7">
              <div className="glass-panel-glow space-y-7 rounded-[2rem] p-7 sm:p-9">
                <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mimi-green/15 text-mimi-green">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cấu Hình Máy Chủ</h2>
                    <p className="text-xs text-gray-400">
                      Thay đổi có hiệu lực ngay lập tức trên bot.
                    </p>
                  </div>
                </div>

                {/* Prefix */}
                <div className="space-y-2.5">
                  <label htmlFor="prefix" className="text-sm font-bold text-white">
                    Prefix Lệnh Văn Bản
                  </label>
                  <p className="text-xs text-gray-400">
                    Tiền tố cho lệnh dạng chat (1–5 ký tự). Lệnh slash (/) không bị ảnh hưởng.
                  </p>
                  <input
                    id="prefix"
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    maxLength={5}
                    className="w-40 rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-center font-mono text-lg font-bold text-mimi-green outline-none transition-colors focus:border-mimi-green/50"
                  />
                </div>

                {/* Toggle: unverifyOnMute */}
                <ToggleRow
                  label="Hủy xác thực khi bị mute"
                  desc="Thành viên bị mute trong kênh thoại sẽ tự động mất role Đã Xác Thực."
                  checked={unverifyOnMute}
                  onChange={setUnverifyOnMute}
                />

                {/* Toggle: verifyDailyMode */}
                <ToggleRow
                  label="Chế độ xác thực 24 giờ"
                  desc="Reset trạng thái xác thực của toàn bộ thành viên vào 00:00 mỗi ngày (UTC+7)."
                  checked={verifyDailyMode}
                  onChange={setVerifyDailyMode}
                />

                {/* Nút lưu */}
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{saving ? 'Đang lưu…' : 'Lưu Cấu Hình'}</span>
                  </button>
                  {savedSuccess && (
                    <span className="flex animate-fade-in items-center gap-1.5 text-sm font-semibold text-mimi-green">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Đã lưu thành công!</span>
                    </span>
                  )}
                </div>
              </div>
            </form>

            {/* Cột phải: trạng thái module */}
            <div className="space-y-6 lg:col-span-5">
              <div className="glass-panel space-y-5 rounded-[2rem] p-7">
                <h3 className="flex items-center gap-2 border-b border-white/10 pb-4 text-lg font-bold text-white">
                  <Shield className="h-5 w-5 text-mimi-violet" />
                  <span>Trạng Thái Các Module</span>
                </h3>
                {flags ? (
                  <ul className="space-y-3">
                    <ModuleRow label="Thiết lập cơ bản hoàn tất" on={flags.isSetupCompleted} />
                    <ModuleRow label="Hệ thống xác thực" on={flags.isVerifySetup} />
                    <ModuleRow label="Text-to-Speech (TTS)" on={flags.isTtsSetup} />
                    <ModuleRow label="Phòng voice tự động" on={flags.isVoiceRoomSetup} />
                  </ul>
                ) : (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-2xl bg-white/5" />
                    ))}
                  </div>
                )}
                <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-gray-500">
                  Các module chưa bật có thể thiết lập bằng lệnh setup tương ứng ngay trong
                  Discord (vd: <code className="text-mimi-green">/setup</code>).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Màn hình khi vào thẳng URL mà chưa có khoá truy cập. */
function NeedKeyScreen({ guildId }: { guildId: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="glass-panel-glow gradient-ring w-full max-w-xl space-y-6 rounded-[2rem] p-9 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-mimi-green/25 bg-mimi-green/10">
          <Shield className="h-8 w-8 text-mimi-green" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-white">Cần khoá truy cập</h1>
          <p className="text-sm leading-relaxed text-gray-400">
            Bảng điều khiển của một server chỉ mở cho người có quyền{' '}
            <strong className="text-white">Quản Lý Máy Chủ</strong>. Vào Discord, gõ lệnh
            dưới đây trong server rồi bấm link Mimi gửi lại:
          </p>
          <code className="inline-block rounded-xl border border-white/10 bg-black/40 px-5 py-3 font-mono text-base font-bold text-mimi-green">
            /dashboard
          </code>
          <p className="text-xs text-gray-500">
            Link đó gắn riêng với server <span className="font-mono text-gray-400">{guildId}</span> và
            hết hạn sau 7 ngày.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-6">
          <Link href="/dashboard" className="btn-secondary !px-6 !py-3 !text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Link>
          <Link href="/support" className="btn-secondary !px-6 !py-3 !text-sm">
            <span>Cần trợ giúp?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Hàng công tắc bật/tắt. */
function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <div className="space-y-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs leading-relaxed text-gray-400">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? 'bg-gradient-brand' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

/** Hàng hiển thị trạng thái module (chỉ đọc). */
function ModuleRow({ label, on }: { label: string; on: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-3.5">
      <span className="text-sm font-medium text-gray-200">{label}</span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
          on ? 'bg-mimi-green/20 text-mimi-green' : 'bg-white/10 text-gray-400'
        }`}
      >
        {on ? 'Đã bật' : 'Chưa bật'}
      </span>
    </li>
  );
}
