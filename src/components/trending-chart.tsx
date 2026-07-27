'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Flame, Copy, Check, TrendingUp, Music, Play, Pause, RefreshCw } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { usePlayerStore } from '@/lib/store/use-player-store';

interface TrendingSong {
  rank: number;
  title: string;
  artist: string;
  artworkUrl: string | null;
  link: string | null;
  previewUrl: string | null;
}

/**
 * BXH nhạc Việt Nam thời gian thực (LIVE Realtime - cập nhật liên tục).
 * Mỗi bài có nút copy sẵn lệnh /play để đem qua Discord phát bằng MIMI.
 */
export function TrendingChart() {
  const [songs, setSongs] = useState<TrendingSong[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [copiedRank, setCopiedRank] = useState<number | null>(null);
  const { playTrack, track: currentTrack, isPlaying, setIsPlaying } = usePlayerStore();

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trending?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data?.ok && Array.isArray(data.songs) && data.songs.length) {
        setSongs(data.songs);
        setFailed(false);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastUpdated(timeStr);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    const timer = setInterval(fetchTrending, 45000);
    return () => clearInterval(timer);
  }, [fetchTrending]);

  const copyPlayCommand = async (song: TrendingSong) => {
    try {
      await navigator.clipboard.writeText(`/play ${song.title} ${song.artist}`);
      setCopiedRank(song.rank);
      setTimeout(() => setCopiedRank(null), 2000);
    } catch {}
  };

  // BXH không tải được thì ẩn hẳn section — không hiển thị dữ liệu giả
  if (failed) return null;

  return (
    <section id="bxh" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          {/* Cột trái: đĩa vinyl 3D + lời dẫn */}
          <Reveal className="space-y-8 text-center lg:col-span-5 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-mimi-pink/30 bg-mimi-pink/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-pink">
              <Flame className="h-3.5 w-3.5" />
              <span>BXH Việt Nam — cập nhật liên tục</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Bài Nào Đang <span className="text-gradient-mimi">Hot</span>,
              <br />
              MIMI Phát Ngay
            </h2>
            <p className="mx-auto max-w-md text-base leading-relaxed text-gray-400 lg:mx-0">
              Top 10 ca khúc được nghe nhiều nhất Việt Nam lúc này. Bấm nút copy bên cạnh
              bài hát, dán vào Discord là MIMI phát liền — không cần tìm link.
            </p>

            {/* Đĩa vinyl 3D quay */}
            <div className="vinyl-stage mx-auto w-fit pt-4 lg:mx-0">
              <div className="vinyl-disc h-52 w-52 sm:h-64 sm:w-64">
                <div className="vinyl-label overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.webp" alt="Mimi Logo" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Cột phải: bảng xếp hạng */}
          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <TiltCard maxTilt={4}>
                <div className="glass-panel-glow gradient-ring space-y-2 rounded-[2rem] p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-2 pb-4">
                    <div className="flex items-center gap-2.5">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        <TrendingUp className="h-5 w-5 text-mimi-green" />
                        <span>Top 10 Nhạc Việt Thịnh Hành</span>
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-mimi-pink/40 bg-mimi-pink/15 px-2.5 py-0.5 text-[11px] font-extrabold text-mimi-pink shadow-[0_0_12px_rgba(244,114,182,0.3)]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mimi-pink opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-mimi-pink"></span>
                          </span>
                          <span>LIVE</span>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-gray-300" title="Dữ liệu trực tiếp từ Apple Music / iTunes Chart Việt Nam">
                          <span> Apple Music VN</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lastUpdated && (
                        <span className="hidden text-xs font-medium text-gray-400 sm:inline">
                          Cập nhật: {lastUpdated}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={fetchTrending}
                        disabled={loading}
                        title="Làm mới bảng xếp hạng LIVE"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300 hover:border-mimi-green/40 hover:bg-mimi-green/10 hover:text-mimi-green transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-mimi-green' : ''}`} />
                        <span>Làm mới</span>
                      </button>
                    </div>
                  </div>

                  {!songs ? (
                    <div className="space-y-2 pt-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/5" />
                      ))}
                    </div>
                  ) : (
                    <ul className="max-h-[460px] space-y-1.5 overflow-y-auto pr-1 pt-2">
                      {songs.map((s) => (
                        <li
                          key={s.rank}
                          className="group flex items-center gap-3.5 rounded-2xl border border-transparent p-2.5 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                        >
                          <span
                            className={`w-8 shrink-0 text-center font-mono text-lg font-black ${
                              s.rank <= 3 ? 'text-gradient-mimi' : 'text-gray-500'
                            }`}
                          >
                            {s.rank}
                          </span>
                          {s.artworkUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={s.artworkUrl}
                              alt=""
                              loading="lazy"
                              className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover shadow-md"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-mimi-green/30 bg-mimi-green/10 text-mimi-green shadow-sm">
                              <Music className="h-6 w-6" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-bold text-white">{s.title}</p>
                              {s.rank === 1 && (
                                <span className="shrink-0 rounded-md bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 px-1.5 py-0.5 text-[9px] font-extrabold text-yellow-300">
                                  #1 APPLE HIT
                                </span>
                              )}
                              {s.rank === 2 && (
                                <span className="shrink-0 rounded-md bg-gradient-to-r from-mimi-pink/20 to-rose-500/20 border border-mimi-pink/40 px-1.5 py-0.5 text-[9px] font-extrabold text-mimi-pink">
                                  #2 HOT
                                </span>
                              )}
                              {s.rank === 3 && (
                                <span className="shrink-0 rounded-md bg-gradient-to-r from-mimi-cyan/20 to-blue-500/20 border border-mimi-cyan/40 px-1.5 py-0.5 text-[9px] font-extrabold text-mimi-cyan">
                                  #3 TREND
                                </span>
                              )}
                            </div>
                            <p className="truncate text-xs text-gray-400">{s.artist}</p>
                          </div>
                          {/* Equalizer hiện khi hover hoặc đang phát */}
                          <div className={`h-6 items-end gap-0.5 ${(isPlaying && currentTrack?.title === s.title) ? 'flex' : 'hidden group-hover:flex'}`} aria-hidden>
                            {[0, 1, 2].map((b) => (
                              <span
                                key={b}
                                className="w-1 origin-bottom animate-soundwave rounded-full bg-gradient-to-t from-mimi-green to-mimi-cyan"
                                style={{ height: '100%', animationDelay: `${b * 0.15}s` }}
                              />
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            {s.previewUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (currentTrack?.title === s.title) {
                                    setIsPlaying(!isPlaying);
                                  } else {
                                    playTrack({
                                      title: s.title,
                                      artist: s.artist,
                                      cover: s.artworkUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200',
                                      url: s.previewUrl!
                                    });
                                  }
                                }}
                                className={`rounded-xl border p-2.5 transition-colors ${
                                  currentTrack?.title === s.title && isPlaying
                                    ? 'border-mimi-green bg-mimi-green/20 text-mimi-green'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-mimi-green/40 hover:text-mimi-green'
                                }`}
                                title={`Nghe thử ${s.title}`}
                                aria-label={`Nghe thử ${s.title}`}
                              >
                                {currentTrack?.title === s.title && isPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => copyPlayCommand(s)}
                              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-colors hover:border-mimi-green/40 hover:text-mimi-green"
                              title={`Copy lệnh: /play ${s.title}`}
                              aria-label={`Copy lệnh phát bài ${s.title}`}
                            >
                              {copiedRank === s.rank ? (
                                <Check className="h-4 w-4 text-mimi-green" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 px-2 pt-4 text-xs text-gray-500">
                    <p>
                      Mẹo: bấm <Copy className="inline h-3 w-3" /> để copy sẵn lệnh{' '}
                      <code className="text-mimi-green">/play</code>, dán vào kênh chat Discord là
                      MIMI phát ngay bài đó.
                    </p>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <p className="flex items-center gap-1.5 font-semibold text-mimi-pink">
                        <span className="h-1.5 w-1.5 rounded-full bg-mimi-pink animate-pulse" />
                        <span>BXH thật • Apple Music Vietnam</span>
                      </p>
                      <span className="text-[10px] text-gray-400">Tự động đồng bộ theo giờ từ iTunes Chart</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
