'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Repeat,
  ListMusic,
  Settings,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Trash2,
  CheckCircle2,
  Radio,
  Clock,
} from 'lucide-react';
import type { PlayerTrack } from '@/lib/types';

const initialQueue: PlayerTrack[] = [
  {
    title: 'Sài Gòn Hôm Nay Mưa — Hoàng Dũng',
    author: 'Hoàng Dũng Official',
    url: 'https://youtube.com',
    duration: 252,
    requestedBy: 'nhan9800',
  },
  {
    title: 'Chìm Sâu — RPT MCK feat. Trung Trần',
    author: 'RPT MCK',
    url: 'https://youtube.com',
    duration: 184,
    requestedBy: 'mimi_fan',
  },
  {
    title: 'Nàng Thơ — Hoàng Dũng (Live Acoustic)',
    author: 'Hoàng Dũng',
    url: 'https://youtube.com',
    duration: 275,
    requestedBy: 'alex_tr',
  },
  {
    title: 'Có Hẹn Với Thanh Xuân — MONSTAR',
    author: 'MONSTAR',
    url: 'https://youtube.com',
    duration: 210,
    requestedBy: 'nhan9800',
  },
];

export default function GuildDashboardPage({
  params,
}: {
  params: { guildId: string };
}) {
  const { guildId } = params;
  const [activeTab, setActiveTab] = useState<'player' | 'settings'>('player');

  // Music state
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(85);
  const [loopMode, setLoopMode] = useState<'off' | 'track' | 'queue'>('off');
  const [queue, setQueue] = useState<PlayerTrack[]>(initialQueue);

  // Settings state
  const [prefix, setPrefix] = useState('!');
  const [stay247, setStay247] = useState(true);
  const [autoLeave, setAutoLeave] = useState(false);
  const [economyAlert, setEconomyAlert] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentTrack = queue[0] || null;

  const handleRemoveTrack = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkipTrack = () => {
    if (queue.length > 1) {
      setQueue((prev) => prev.slice(1));
    } else {
      setIsPlaying(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const cycleLoopMode = () => {
    if (loopMode === 'off') setLoopMode('track');
    else if (loopMode === 'track') setLoopMode('queue');
    else setLoopMode('off');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-mimi-green">ID: {guildId}</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-mimi-green/20 text-mimi-green text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-mimi-green animate-pulse" />
                  Kết Nối Internal API
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Bảng Điều Khiển Máy Chủ
              </h1>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-2 bg-[#121224] p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'player'
                  ? 'bg-mimi-green text-[#070711] shadow-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Trình Phát Nhạc</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-mimi-green text-[#070711] shadow-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cấu Hình Máy Chủ</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Music Player & Queue Manager */}
        {activeTab === 'player' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Interactive Live Player */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel-glow rounded-3xl p-7 sm:p-9 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-5 h-5 text-mimi-green animate-pulse" />
                    <span className="text-base font-bold text-white">
                      Kênh: #nhac-chill-cung-mimi
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-mimi-purple/20 text-mimi-purple font-mono font-semibold">
                    Lavalink Node #01
                  </span>
                </div>

                {/* Song info */}
                {currentTrack ? (
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-mimi-green/30 via-mimi-purple/30 to-mimi-cyan/30 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                      <Music className="w-16 h-16 text-mimi-green animate-bounce" />
                    </div>
                    <div className="space-y-2 overflow-hidden w-full">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/5 text-gray-300 text-xs">
                        <span>Yêu cầu bởi:</span>
                        <strong className="text-mimi-green">@{currentTrack.requestedBy}</strong>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white truncate">
                        {currentTrack.title}
                      </h2>
                      <p className="text-sm text-gray-400">{currentTrack.author}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <Music className="w-12 h-12 text-gray-500 mx-auto" />
                    <p className="text-lg text-gray-400">Hiện không có bài hát nào trong hàng chờ.</p>
                  </div>
                )}

                {/* Animated Waveform */}
                <div className="h-16 flex items-end justify-between gap-1 px-4 bg-black/40 rounded-2xl p-3 border border-white/5">
                  {[45, 80, 35, 95, 60, 100, 50, 85, 45, 95, 70, 90, 40, 85, 60, 95, 50, 75, 40, 90].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-full bg-gradient-to-t from-mimi-green to-mimi-cyan transition-all duration-300"
                        style={{
                          height: isPlaying && currentTrack ? `${h}%` : '15%',
                        }}
                      />
                    )
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-mimi-green to-mimi-cyan rounded-full"
                      style={{ width: isPlaying ? '58%' : '20%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span>02:26</span>
                    <span>04:12</span>
                  </div>
                </div>

                {/* Player Controller Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {/* Volume Slider (up to 150%) */}
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-mimi-green" />
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-28 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-mimi-green"
                    />
                    <span className="text-xs font-mono text-gray-300 w-10">{volume}%</span>
                  </div>

                  {/* Playback action buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={cycleLoopMode}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        loopMode !== 'off'
                          ? 'bg-mimi-purple/20 border-mimi-purple text-mimi-purple'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                      title="Chế độ lặp lại"
                    >
                      <Repeat className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] flex items-center justify-center shadow-glow hover:scale-105 transition-all active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleSkipTrack}
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Bỏ qua bài hát"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Queue Manager */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel rounded-3xl p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <ListMusic className="w-5 h-5 text-mimi-green" />
                    <span>Hàng Chờ Phát Nhạc</span>
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 font-mono">
                    {queue.length} bài hát
                  </span>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {queue.map((track, idx) => (
                    <div
                      key={`${track.title}-${idx}`}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        idx === 0
                          ? 'bg-mimi-green/10 border-mimi-green/40'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-xs font-mono text-gray-400 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{track.title}</p>
                          <p className="text-xs text-gray-400 truncate">
                            @ {track.requestedBy} • {Math.floor(track.duration / 60)}:
                            {(track.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>

                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(idx)}
                          className="p-2 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                          title="Xóa bài hát này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Server Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSaveSettings} className="glass-panel rounded-3xl p-8 sm:p-10 space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Cấu Hình Hoạt Động & Bảo Mật</h2>
                  <p className="text-sm text-gray-400">
                    Tuỳ chỉnh các tính năng âm nhạc, tự động rời kênh và chế độ kiểm soát kinh tế của Mimi.
                  </p>
                </div>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mimi-green/20 text-mimi-green text-xs font-bold animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã lưu thay đổi!
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Prefix */}
                <div className="space-y-2">
                  <label htmlFor="prefix" className="block text-sm font-semibold text-white">
                    Prefix cho Lệnh Văn Bản
                  </label>
                  <p className="text-xs text-gray-400">
                    Ký tự đầu câu lệnh cho những người dùng không dùng Slash Commands.
                  </p>
                  <input
                    id="prefix"
                    type="text"
                    maxLength={3}
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-24 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-center font-bold focus:border-mimi-green focus:outline-none"
                  />
                </div>

                {/* 24/7 Voice Mode */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <span className="text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-mimi-green" />
                      <span>Chế Độ Phát Nhạc 24/7</span>
                    </span>
                    <p className="text-xs text-gray-400">
                      Mimi sẽ luôn ở trong Voice Channel ngay cả khi hết bài hát trong hàng chờ.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={stay247}
                    onChange={(e) => setStay247(e.target.checked)}
                    className="w-6 h-6 rounded accent-mimi-green cursor-pointer"
                  />
                </div>

                {/* Auto leave */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <span className="text-base font-bold text-white">
                      Tự Động Rời Voice Khi Phòng Trống
                    </span>
                    <p className="text-xs text-gray-400">
                      Tự rời sau 5 phút nếu không còn thành viên nào nghe trong kênh thoại.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoLeave}
                    onChange={(e) => setAutoLeave(e.target.checked)}
                    className="w-6 h-6 rounded accent-mimi-green cursor-pointer"
                  />
                </div>

                {/* Economy Alert Threshold */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <span className="text-base font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Cảnh Báo Bất Thường Economy &gt; 5.000.000 Xu</span>
                    </span>
                    <p className="text-xs text-gray-400">
                      Tự động giám sát giao dịch và thu nhập mỗi ngày, gửi DM cảnh báo tức thì tới Bot Owner.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={economyAlert}
                    onChange={(e) => setEconomyAlert(e.target.checked)}
                    className="w-6 h-6 rounded accent-mimi-green cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-extrabold text-sm shadow-glow hover:scale-105 transition-all"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
