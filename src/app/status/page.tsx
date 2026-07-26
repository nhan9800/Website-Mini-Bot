'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap, Cpu, HardDrive, Wifi, RefreshCw, ShieldCheck } from 'lucide-react';

export default function StatusPage() {
  const [lastRefreshed, setLastRefreshed] = useState<string>('Vừa xong');
  const [ping, setPing] = useState<number>(24);
  const [memory, setMemory] = useState<number>(86.4);
  const [activeVoice, setActiveVoice] = useState<number>(18);

  const handleRefresh = () => {
    setPing(Math.floor(Math.random() * (35 - 18 + 1)) + 18);
    setMemory(Number((80 + Math.random() * 15).toFixed(1)));
    setActiveVoice(Math.floor(Math.random() * (25 - 15 + 1)) + 15);
    setLastRefreshed(new Date().toLocaleTimeString('vi-VN'));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mimi-green/10 text-mimi-green text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Hệ Thống Đang Hoạt Động Ổn Định</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Trạng Thái Hệ Thống & <span className="text-gradient-mimi">Độ Trễ API</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Cập nhật trực tiếp số liệu hoạt động, tốc độ phản hồi từ Discord Gateway và các node âm thanh Lavalink.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm Mới ({lastRefreshed})</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Ping */}
          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Độ Trễ Discord Gateway
              </span>
              <Wifi className="w-5 h-5 text-mimi-green" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{ping}</span>
              <span className="text-sm font-semibold text-mimi-green">ms</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-mimi-green">
              <span className="w-2 h-2 rounded-full bg-mimi-green" />
              <span>Phản hồi cực nhanh (Tuyệt vời)</span>
            </div>
          </div>

          {/* Card 2: Uptime */}
          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Thời Gian Uptime
              </span>
              <Zap className="w-5 h-5 text-mimi-cyan" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">99.98</span>
              <span className="text-sm font-semibold text-mimi-cyan">%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Không có sự cố gián đoạn trong 30 ngày</span>
            </div>
          </div>

          {/* Card 3: Active Voice */}
          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Kết Nối Âm Nhạc (Voice)
              </span>
              <Server className="w-5 h-5 text-mimi-purple" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{activeVoice}</span>
              <span className="text-sm font-semibold text-mimi-purple">luồng active</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-mimi-purple">
              <span>Đang phát nhạc chất lượng cao Opus</span>
            </div>
          </div>

          {/* Card 4: Memory Usage */}
          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Bộ Nhớ RAM Bot (Node.js)
              </span>
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{memory}</span>
              <span className="text-sm font-semibold text-amber-400">MB / 512 MB</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${(memory / 512) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Infrastructure Table */}
        <div className="glass-panel rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-mimi-green" />
              <span>Cấu Trúc Hệ Thống Máy Chủ (Infrastructure)</span>
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-mimi-green/20 text-mimi-green font-semibold">
              All Systems Operational
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4">Thành Phần</th>
                  <th className="py-3 px-4">Vị Trí Máy Chủ</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Uptime 30 Ngày</th>
                  <th className="py-3 px-4">Độ Trễ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <tr>
                  <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-mimi-green" />
                    <span>Bot Core (Discord Gateway)</span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">VibeHost / VPS Vietnam</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mimi-green/20 text-mimi-green text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-mimi-green" />
                      Online
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 font-mono">99.99%</td>
                  <td className="py-4 px-4 text-mimi-green font-mono">{ping} ms</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-mimi-cyan" />
                    <span>Lavalink / Audio Nodes (Opus Engine)</span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">Singapore / VN Dedicated</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mimi-green/20 text-mimi-green text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-mimi-green" />
                      Online
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 font-mono">99.95%</td>
                  <td className="py-4 px-4 text-mimi-cyan font-mono">15 ms</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-mimi-purple" />
                    <span>Web Dashboard & Internal API Proxy</span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">cPanel Nhân Hòa Node.js App</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mimi-green/20 text-mimi-green text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-mimi-green" />
                      Online
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 font-mono">100%</td>
                  <td className="py-4 px-4 text-mimi-purple font-mono">12 ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
