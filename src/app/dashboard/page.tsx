'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Server,
  Music,
  ArrowRight,
  Sparkles,
  ExternalLink,
  KeyRound,
  MousePointerClick,
  Trash2,
  Users,
} from 'lucide-react';
import { env } from '@/lib/env';

interface RecentGuild {
  id: string;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  visitedAt: number;
}

const STORAGE_KEY = 'mimi.recentGuilds';
const GUILD_ID_RE = /^\d{15,22}$/;

function loadRecentGuilds(): RecentGuild[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default function DashboardSelectorPage() {
  const router = useRouter();
  const [guildId, setGuildId] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentGuild[]>([]);

  useEffect(() => {
    setRecent(loadRecentGuilds().sort((a, b) => b.visitedAt - a.visitedAt));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = guildId.trim();
    if (!GUILD_ID_RE.test(id)) {
      setInputError('Guild ID phải là dãy 15–22 chữ số. Bật Developer Mode trong Discord rồi chuột phải vào server → Copy Server ID.');
      return;
    }
    setInputError(null);
    router.push(`/dashboard/${id}`);
  };

  const removeRecent = (id: string) => {
    const next = recent.filter((g) => g.id !== id);
    setRecent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Bảng điều khiển thời gian thực</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Điều Khiển Mimi <span className="text-gradient-mimi">Từ Trình Duyệt</span>
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            Nhập ID máy chủ Discord có Mimi để mở trình phát nhạc trực tiếp, quản lý hàng chờ
            và chỉnh cấu hình bot.
          </p>
        </div>

        {/* ── Ô nhập Guild ID ───────────────────────────────────── */}
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="glass-panel-glow gradient-ring space-y-4 rounded-3xl p-7 sm:p-9">
            <label htmlFor="guild-id" className="flex items-center gap-2 text-sm font-bold text-white">
              <KeyRound className="h-4 w-4 text-mimi-green" />
              <span>ID Máy Chủ Discord (Guild ID)</span>
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="guild-id"
                type="text"
                inputMode="numeric"
                value={guildId}
                onChange={(e) => {
                  setGuildId(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="Ví dụ: 1327164993883832381"
                className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 font-mono text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-mimi-green/50"
              />
              <button type="submit" className="btn-primary shrink-0 !py-4">
                <span>Mở Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {inputError && <p className="text-xs leading-relaxed text-mimi-pink">{inputError}</p>}
            <div className="flex items-start gap-2.5 border-t border-white/10 pt-4 text-xs leading-relaxed text-gray-400">
              <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-mimi-cyan" />
              <span>
                Cách lấy ID: Discord → <strong className="text-gray-300">Cài đặt → Nâng cao → bật Developer Mode</strong>,
                sau đó chuột phải vào tên server → <strong className="text-gray-300">Copy Server ID</strong>.
              </span>
            </div>
          </form>
        </div>

        {/* ── Server gần đây ────────────────────────────────────── */}
        {recent.length > 0 && (
          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Server className="h-5 w-5 text-mimi-violet" />
              <span>Máy Chủ Đã Truy Cập Gần Đây</span>
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recent.slice(0, 6).map((g) => (
                <div
                  key={g.id}
                  className="glass-panel card-lift flex flex-col justify-between space-y-5 rounded-3xl p-6 hover:border-mimi-green/40"
                >
                  <div className="flex items-center gap-4">
                    {g.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={g.iconUrl}
                        alt=""
                        className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-mimi-green/20 to-mimi-purple/20 text-xl font-extrabold text-white">
                        {g.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-white">{g.name}</h3>
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Users className="h-3.5 w-3.5" />
                        <span>{g.memberCount.toLocaleString('vi-VN')} thành viên</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/${g.id}`}
                      className="btn-primary flex-1 !rounded-xl !px-4 !py-2.5 !text-xs"
                    >
                      <Music className="h-4 w-4" />
                      <span>Mở Điều Khiển</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeRecent(g.id)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-colors hover:bg-mimi-pink/10 hover:text-mimi-pink"
                      aria-label={`Xóa ${g.name} khỏi danh sách gần đây`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Banner mời bot ────────────────────────────────────── */}
        <div className="glass-panel flex flex-col items-center justify-between gap-6 rounded-3xl p-8 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">Mimi chưa có trong server của bạn?</h3>
            <p className="max-w-2xl text-sm text-gray-400">
              Dashboard chỉ hoạt động với máy chủ đã mời Mimi. Bấm nút bên cạnh để thêm bot —
              hoàn toàn miễn phí.
            </p>
          </div>
          <a
            href={env.NEXT_PUBLIC_BOT_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0"
          >
            <span>Mời Mimi Vào Server</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
