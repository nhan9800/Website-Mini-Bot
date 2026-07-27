'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Copy, Check, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { Icon3D } from '@/components/ui/icon3d';
import { usePlayerStore } from '@/lib/store/use-player-store';
import { Play } from 'lucide-react';

interface TrendingSong {
  rank: number;
  title: string;
  artist: string;
  artworkUrl: string | null;
  link: string | null;
  previewUrl: string | null;
}

/**
 * BXH nhạc Việt Nam thời gian thực (iTunes VN — dữ liệu thật, cache 1h).
 * Mỗi bài có nút copy sẵn lệnh /play để đem qua Discord phát bằng Mimi.
 */
export function TrendingChart() {
  const [songs, setSongs] = useState<TrendingSong[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [copiedRank, setCopiedRank] = useState<number | null>(null);
  const { playTrack, track: currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/trending', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok && data?.ok && Array.isArray(data.songs) && data.songs.length) {
            setSongs(data.songs);
          } else {
            setFailed(true);
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
              Mimi Phát Ngay
            </h2>
            <p className="mx-auto max-w-md text-base leading-relaxed text-gray-400 lg:mx-0">
              Top 10 ca khúc được nghe nhiều nhất Việt Nam lúc này. Bấm nút copy bên cạnh
              bài hát, dán vào Discord là Mimi phát liền — không cần tìm link.
            </p>

            {/* Đĩa vinyl 3D quay */}
            <div className="vinyl-stage mx-auto w-fit pt-4 lg:mx-0">
              <div className="vinyl-disc h-52 w-52 sm:h-64 sm:w-64">
                <div className="vinyl-label">
                  <Icon3D name="music" size={44} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Cột phải: bảng xếp hạng */}
          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <TiltCard maxTilt={4}>
                <div className="glass-panel-glow gradient-ring space-y-2 rounded-[2rem] p-5 sm:p-7">
                  <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                      <TrendingUp className="h-5 w-5 text-mimi-green" />
                      <span>Top 10 Việt Nam</span>
                    </h3>
                    <span className="rounded-full bg-mimi-pink/15 px-3 py-1 text-xs font-semibold text-mimi-pink">
                      iTunes Charts VN
                    </span>
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
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
                              <Icon3D name="music" size={24} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-white">{s.title}</p>
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
                                  playTrack({
                                    title: s.title,
                                    artist: s.artist,
                                    cover: s.artworkUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200',
                                    url: s.previewUrl!
                                  });
                                }}
                                className={`rounded-xl border p-2.5 transition-colors ${
                                  currentTrack?.title === s.title && isPlaying
                                    ? 'border-mimi-green bg-mimi-green/20 text-mimi-green'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-mimi-green/40 hover:text-mimi-green'
                                }`}
                                title={`Nghe thử ${s.title}`}
                                aria-label={`Nghe thử ${s.title}`}
                              >
                                <Play className="h-4 w-4" />
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

                  <p className="border-t border-white/10 px-2 pt-4 text-xs text-gray-500">
                    Mẹo: bấm <Copy className="inline h-3 w-3" /> để copy sẵn lệnh{' '}
                    <code className="text-mimi-green">/play</code>, dán vào kênh chat Discord là
                    Mimi phát ngay bài đó.
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
