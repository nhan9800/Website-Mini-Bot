'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Terminal,
  Music,
  Shield,
  Clock,
  Coins,
  Settings,
  Sparkles,
  Wifi,
  WifiOff,
  MicVocal,
} from 'lucide-react';
import type { ApiCommand } from '@/lib/types';

type Category = 'music' | 'verification' | 'attendance' | 'economy' | 'voice' | 'system';

const CATEGORIES: { key: Category | 'all'; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Tất Cả', icon: Terminal },
  { key: 'music', label: 'Âm Nhạc', icon: Music },
  { key: 'verification', label: 'Xác Thực', icon: Shield },
  { key: 'attendance', label: 'Chấm Công', icon: Clock },
  { key: 'economy', label: 'Kinh Tế', icon: Coins },
  { key: 'voice', label: 'Voice & TTS', icon: MicVocal },
  { key: 'system', label: 'Hệ Thống', icon: Settings },
];

/** Suy ra danh mục từ tên lệnh (API của bot không trả về category). */
function inferCategory(name: string): Category {
  const n = name.toLowerCase();
  if (/(play|pause|resume|skip|stop|queue|volume|loop|shuffle|seek|nowplaying|np|lyric|autoplay|leave|join|247|stay)/.test(n))
    return 'music';
  if (/(verify|unverify|xacthuc)/.test(n)) return 'verification';
  if (/(attendance|checkin|checkout|chamcong|cong)/.test(n)) return 'attendance';
  if (/(economy|coin|xu|daily|balance|bal|pay|top|rank)/.test(n)) return 'economy';
  if (/(tts|voice|room|speak|noi)/.test(n)) return 'voice';
  return 'system';
}

const categoryStyle: Record<Category, string> = {
  music: 'bg-mimi-green/15 text-mimi-green border-mimi-green/30',
  verification: 'bg-mimi-purple/15 text-mimi-violet border-mimi-purple/30',
  attendance: 'bg-mimi-cyan/15 text-mimi-cyan border-mimi-cyan/30',
  economy: 'bg-mimi-amber/15 text-mimi-amber border-mimi-amber/30',
  voice: 'bg-mimi-pink/15 text-mimi-pink border-mimi-pink/30',
  system: 'bg-white/10 text-gray-300 border-white/15',
};

const categoryLabel: Record<Category, string> = {
  music: 'Âm Nhạc',
  verification: 'Xác Thực',
  attendance: 'Chấm Công',
  economy: 'Kinh Tế',
  voice: 'Voice & TTS',
  system: 'Hệ Thống',
};

/** Danh mục dự phòng khi bot offline — các lệnh cốt lõi chắc chắn tồn tại. */
const FALLBACK_COMMANDS: ApiCommand[] = [
  { name: 'play', description: 'Phát nhạc từ YouTube vào kênh thoại hiện tại (tên bài hoặc URL).', options: [{ name: 'query', description: 'Tên bài hát hoặc link', type: 3, required: true }], defaultMemberPermissions: null },
  { name: 'pause', description: 'Tạm dừng bài hát đang phát.', options: [], defaultMemberPermissions: null },
  { name: 'resume', description: 'Tiếp tục phát bài hát đang tạm dừng.', options: [], defaultMemberPermissions: null },
  { name: 'skip', description: 'Bỏ qua bài hiện tại, chuyển sang bài kế tiếp trong hàng chờ.', options: [], defaultMemberPermissions: null },
  { name: 'queue', description: 'Xem danh sách hàng chờ phát nhạc của máy chủ.', options: [], defaultMemberPermissions: null },
  { name: 'volume', description: 'Chỉnh âm lượng phát nhạc (0–150%).', options: [{ name: 'level', description: 'Mức âm lượng', type: 4, required: true }], defaultMemberPermissions: null },
  { name: 'loop', description: 'Bật/tắt lặp lại bài hiện tại hoặc cả hàng chờ.', options: [], defaultMemberPermissions: null },
  { name: 'lyrics', description: 'Tra lời bài hát đang phát (nguồn lrclib).', options: [], defaultMemberPermissions: null },
  { name: 'leave', description: 'Dừng nhạc, xóa hàng chờ và rời kênh thoại.', options: [], defaultMemberPermissions: null },
  { name: 'verify', description: 'Xác thực thành viên trong hệ thống xác thực 24 giờ.', options: [], defaultMemberPermissions: null },
  { name: 'attendance', description: 'Check-in / check-out chấm công nhân sự.', options: [], defaultMemberPermissions: null },
  { name: 'config', description: 'Xem và thay đổi cấu hình bot của máy chủ (prefix, chế độ xác thực…).', options: [], defaultMemberPermissions: null },
];

export default function CommandsPage() {
  const [commands, setCommands] = useState<ApiCommand[] | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/commands', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok && data?.ok && Array.isArray(data.commands) && data.commands.length > 0) {
            setCommands(data.commands);
            setIsLive(true);
          } else {
            setCommands(FALLBACK_COMMANDS);
            setIsLive(false);
          }
        }
      } catch {
        if (!cancelled) {
          setCommands(FALLBACK_COMMANDS);
          setIsLive(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = commands ?? [];
    return list.filter((cmd) => {
      const cat = inferCategory(cmd.name);
      if (category !== 'all' && cat !== category) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return cmd.name.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q);
    });
  }, [commands, search, category]);

  return (
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* ── Đầu trang ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-mimi-green/30 bg-mimi-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-mimi-green">
            <Terminal className="h-3.5 w-3.5" />
            <span>Tra cứu lệnh</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Toàn Bộ Lệnh Của <span className="text-gradient-mimi">Mimi</span>
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            {loading
              ? 'Đang tải danh sách lệnh…'
              : isLive
                ? `${commands?.length ?? 0} lệnh slash đang được đăng ký trực tiếp trên Discord.`
                : 'Bot đang ngoại tuyến — hiển thị danh sách lệnh cốt lõi.'}
          </p>
          {!loading && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isLive ? 'bg-mimi-green/15 text-mimi-green' : 'bg-mimi-amber/15 text-mimi-amber'
              }`}
            >
              {isLive ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isLive ? 'Dữ liệu trực tiếp từ bot' : 'Dữ liệu dự phòng'}</span>
            </div>
          )}
        </div>

        {/* ── Tìm kiếm + lọc ────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm lệnh… (vd: play, verify, volume)"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none backdrop-blur-md transition-colors focus:border-mimi-green/50 focus:bg-white/[0.07]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-brand text-[#05060f] shadow-glow'
                      : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Danh sách lệnh ────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel h-32 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel space-y-3 rounded-3xl p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-500" />
            <p className="text-lg font-semibold text-white">Không tìm thấy lệnh nào</p>
            <p className="text-sm text-gray-400">
              Thử từ khóa khác hoặc chọn danh mục &ldquo;Tất Cả&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((cmd) => {
              const cat = inferCategory(cmd.name);
              return (
                <div
                  key={cmd.name}
                  className="glass-panel card-lift space-y-3 rounded-3xl p-6 hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <code className="rounded-xl bg-black/40 px-3 py-1.5 font-mono text-sm font-bold text-mimi-green">
                      /{cmd.name}
                    </code>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${categoryStyle[cat]}`}
                    >
                      {categoryLabel[cat]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {cmd.description || 'Chưa có mô tả.'}
                  </p>
                  {cmd.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                      {cmd.options.map((opt) => (
                        <span
                          key={opt.name}
                          title={opt.description}
                          className={`rounded-lg px-2 py-0.5 font-mono text-[11px] ${
                            opt.required
                              ? 'bg-mimi-green/10 text-mimi-green'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {opt.required ? `<${opt.name}>` : `[${opt.name}]`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Ghi chú ───────────────────────────────────────────── */}
        <div className="glass-panel flex flex-col items-center justify-between gap-4 rounded-3xl p-7 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Sparkles className="h-5 w-5 shrink-0 text-mimi-green" />
            <span>
              <code className="text-mimi-green">&lt;bắt buộc&gt;</code> ·{' '}
              <code className="text-gray-300">[tùy chọn]</code> — di chuột lên tham số để xem mô
              tả chi tiết.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
