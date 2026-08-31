'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Sparkles,
  CheckCircle2,
  Zap,
  Bot,
  Lock,
  Copy,
  Check,
  Search,
  KeyRound,
  QrCode,
  ArrowRight,
  ExternalLink,
  Flame,
  Crown
} from 'lucide-react';
import { env } from '@/lib/env';

interface Plan {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  save?: string;
  duration: string;
  badge?: string;
  popular?: boolean;
  vip?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    id: '1m',
    name: 'Gói 1 Tháng (Tiêu Chuẩn)',
    price: 50000,
    priceFormatted: '50.000đ',
    duration: '30 ngày bảo vệ',
    badge: 'TIÊU CHUẨN',
    features: [
      'Full hệ thống Anti-Raid & Anti-Nuke 0.1s',
      'Chống xóa Kênh & Vai Trò hàng loạt',
      'Tự động chặn Bot Lạ & lọc Clone Raid',
      'Mở khóa toàn diện Hệ Thống Nghe Nhạc HQ',
      'Cập nhật bản vá bảo mật 2026'
    ]
  },
  {
    id: '3m',
    name: 'Gói 3 Tháng (Tiết Kiệm)',
    price: 140000,
    priceFormatted: '140.000đ',
    save: 'Tiết kiệm 10.000đ',
    duration: '90 ngày bảo vệ',
    badge: 'PHỔ BIẾN NHẤT',
    popular: true,
    features: [
      'Bao gồm mọi tính năng của Gói 1 Tháng',
      'Ưu tiên thời gian phản ứng Anti-Nuke 0.05s',
      'Bảo vệ liên tục 3 tháng không lo gián đoạn',
      'Hỗ trợ setup & cấu hình riêng cho Server',
      'Kênh hỗ trợ kỹ thuật ưu tiên 24/7'
    ]
  },
  {
    id: '12m',
    name: 'Gói 12 Tháng (VIP Trọn Gói)',
    price: 390000,
    priceFormatted: '390.000đ',
    save: 'Tiết kiệm 210.000đ (Chỉ ~32k/tháng)',
    duration: '365 ngày (1 Năm)',
    badge: 'SIÊU TIẾT KIỆM',
    vip: true,
    features: [
      'Toàn bộ quyền lợi cao cấp nhất của MIMI',
      'Huy hiệu Server VIP & Partner độc quyền',
      'Tùy chỉnh thông báo bản quyền thương hiệu riêng',
      'Backup & khôi phục cài đặt khi gặp sự cố',
      'Hỗ trợ trực tiếp từ Lead Developer 24/7'
    ]
  }
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>((plans[1] || plans[0])!);
  const [serverGuildId, setServerGuildId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Tra cứu HWID
  const [checkId, setCheckId] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  // Kích hoạt Key
  const [redeemGuildId, setRedeemGuildId] = useState('');
  const [redeemKey, setRedeemKey] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState<any>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenPayment = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const cleanGuildId = serverGuildId.trim() || 'SERVER_ID';
  const transferContent = `MIMI ${selectedPlan.id.toUpperCase()} ${cleanGuildId}`;
  const vietQrUrl = `https://img.vietqr.io/image/970436-9369144188-compact2.png?amount=${selectedPlan.price}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=DAO%20NGOC%20QUANG`;

  const handleCheckLicense = async () => {
    if (!checkId.trim()) return;
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const res = await fetch(`/api/license/check?guildId=${encodeURIComponent(checkId.trim())}`);
      const data = await res.json();
      setCheckResult(data);
    } catch {
      setCheckResult({ ok: false, error: 'Không thể kết nối đến máy chủ bot.' });
    } finally {
      setCheckLoading(false);
    }
  };

  const handleRedeemKey = async () => {
    if (!redeemGuildId.trim() || !redeemKey.trim()) return;
    setRedeemLoading(true);
    setRedeemResult(null);
    try {
      const res = await fetch('/api/license/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: redeemGuildId.trim(), key: redeemKey.trim() })
      });
      const data = await res.json();
      setRedeemResult(data);
    } catch {
      setRedeemResult({ ok: false, error: 'Lỗi kích hoạt mã key.' });
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-mimi-purple/40 bg-mimi-purple/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-mimi-purple backdrop-blur-md">
          <Shield className="h-4 w-4 text-mimi-purple" />
          BẢN QUYỀN MIMI ANTI-RAID SHIELD 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Bảng Giá Dịch Vụ <span className="text-gradient-brand">Bảo Vệ Server</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-400">
          Kích hoạt dễ dàng theo Server ID (HWID), tự động gia hạn cộng dồn thời gian và bảo vệ toàn diện 24/7.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
        {plans.map((p) => {
          return (
            <div
              key={p.id}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                p.popular
                  ? 'border-2 border-mimi-green bg-[#0e1322] shadow-[0_0_40px_rgba(46,204,113,0.2)] md:-translate-y-2'
                  : p.vip
                  ? 'border-2 border-yellow-400/80 bg-[#161320] shadow-[0_0_40px_rgba(234,179,8,0.2)]'
                  : 'border border-white/10 bg-[#0a0c16] hover:border-white/20'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-mimi-green to-mimi-cyan px-4 py-1 text-xs font-black uppercase text-[#05060f] shadow-md">
                  🔥 PHỔ BIẾN NHẤT
                </div>
              )}
              {p.vip && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1 text-xs font-black uppercase text-black shadow-md">
                  👑 VIP TIẾT KIỆM 210K
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{p.badge}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">{p.priceFormatted}</span>
                </div>
                {p.save && <div className="text-xs font-bold text-mimi-green mb-3">{p.save}</div>}
                <div className="text-sm text-gray-400 pb-6 border-b border-white/10">{p.duration}</div>

                <ul className="space-y-3.5 my-6">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-mimi-green shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleOpenPayment(p)}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  p.popular
                    ? 'bg-gradient-brand text-[#05060f] shadow-lg shadow-mimi-green/20 hover:scale-[1.02]'
                    : p.vip
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20 hover:scale-[1.02]'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                <Zap className="h-4 w-4" />
                Mua Gói {p.name.split(' ')[1]}
              </button>
            </div>
          );
        })}
      </div>

      {/* HWID Checker & Redeem Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Check HWID */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0c16] p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-mimi-cyan/10 border border-mimi-cyan/30 text-mimi-cyan">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Tra Cứu Hạn Dùng (HWID)</h3>
              <p className="text-xs text-gray-400">Kiểm tra trạng thái bản quyền theo Server ID</p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={checkId}
              onChange={(e) => setCheckId(e.target.value)}
              placeholder="Nhập Server ID (VD: 1539527939723497473)..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-mimi-cyan focus:outline-none"
            />
            <button
              onClick={handleCheckLicense}
              disabled={checkLoading}
              className="w-full py-3 rounded-xl bg-mimi-cyan/20 border border-mimi-cyan/40 text-mimi-cyan font-bold text-sm hover:bg-mimi-cyan/30 transition-colors"
            >
              {checkLoading ? 'Đang tra cứu...' : '🔍 Tra Cứu Ngay'}
            </button>

            {checkResult && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                {checkResult.ok && checkResult.license ? (
                  checkResult.license.active ? (
                    <div className="space-y-1.5 text-mimi-green">
                      <div className="font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Bản Quyền Đang Hoạt Động
                      </div>
                      <div className="text-xs text-gray-300">Gói: {checkResult.license.planName}</div>
                      <div className="text-xs text-gray-300">
                        Còn lại: {checkResult.license.remainingDays} ngày (Hết hạn:{' '}
                        {new Date(checkResult.license.expiresTimestamp).toLocaleDateString('vi-VN')})
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-400 space-y-1">
                      <div className="font-bold">⚠️ Máy chủ chưa kích hoạt hoặc đã hết hạn!</div>
                      <div className="text-xs text-gray-400">Vui lòng mua gói hoặc kích hoạt mã key bên dưới.</div>
                    </div>
                  )
                ) : (
                  <div className="text-red-400 text-xs">{checkResult.error || 'Không tìm thấy dữ liệu.'}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Redeem Key */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0c16] p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-mimi-purple/10 border border-mimi-purple/30 text-mimi-purple">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Kích Hoạt License Key</h3>
              <p className="text-xs text-gray-400">Nhập mã Key dạng MIMI-ANTI-XXXX-XXXX-XXXX</p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={redeemGuildId}
              onChange={(e) => setRedeemGuildId(e.target.value)}
              placeholder="Nhập Server ID của máy chủ..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-mimi-purple focus:outline-none"
            />
            <input
              type="text"
              value={redeemKey}
              onChange={(e) => setRedeemKey(e.target.value)}
              placeholder="Mã Key (VD: MIMI-ANTI-XXXX-XXXX-XXXX)..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-mimi-purple focus:outline-none font-mono"
            />
            <button
              onClick={handleRedeemKey}
              disabled={redeemLoading}
              className="w-full py-3 rounded-xl bg-mimi-purple/20 border border-mimi-purple/40 text-mimi-purple font-bold text-sm hover:bg-mimi-purple/30 transition-colors"
            >
              {redeemLoading ? 'Đang kích hoạt...' : '🔑 Kích Hoạt Bản Quyền'}
            </button>

            {redeemResult && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                {redeemResult.ok ? (
                  <div className="space-y-1.5 text-mimi-green">
                    <div className="font-bold">🎉 Kích Hoạt Thành Công!</div>
                    <div className="text-xs text-gray-300">Đã cộng: +{redeemResult.daysAdded} ngày bảo vệ.</div>
                  </div>
                ) : (
                  <div className="text-red-400 text-xs">❌ {redeemResult.error || 'Kích hoạt thất bại.'}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e111a] p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">Thanh Toán {selectedPlan.name}</h3>
              <p className="text-sm text-mimi-green font-semibold mt-1">Số tiền: {selectedPlan.priceFormatted}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Nhập Server ID (Guild ID) của bạn:
              </label>
              <input
                type="text"
                value={serverGuildId}
                onChange={(e) => setServerGuildId(e.target.value)}
                placeholder="VD: 1539527939723497473..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-mimi-green focus:outline-none"
              />
            </div>

            {/* QR Image */}
            <div className="rounded-2xl bg-white p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vietQrUrl} alt="VietQR Vietcombank" className="mx-auto max-w-[220px] w-full rounded-lg" />
              <div className="text-[11px] text-gray-600 font-bold mt-2">Quét mã bằng App Ngân hàng hoặc MoMo</div>
            </div>

            {/* Bank Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Ngân Hàng:</span>
                <b className="text-white">Vietcombank (VCB)</b>
              </div>
              <div className="flex justify-between items-center">
                <span>Số Tài Khoản:</span>
                <button
                  onClick={() => copyToClipboard('9369144188', 'stk')}
                  className="flex items-center gap-1 font-bold text-mimi-cyan hover:underline"
                >
                  9369144188 {copiedKey === 'stk' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <div className="flex justify-between">
                <span>Chủ Tài Khoản:</span>
                <b className="text-white">DAO NGOC QUANG</b>
              </div>
              <div className="flex justify-between items-center">
                <span>Nội Dung Chuyển Khoản:</span>
                <button
                  onClick={() => copyToClipboard(transferContent, 'content')}
                  className="flex items-center gap-1 font-mono font-bold text-yellow-300 hover:underline"
                >
                  {transferContent}{' '}
                  {copiedKey === 'content' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 bg-mimi-purple/10 border border-mimi-purple/20 p-3 rounded-xl">
              ℹ️ <b>Sau khi chuyển khoản:</b> Vui lòng gửi bill cho Admin qua Discord để nhận Key kích hoạt hoặc hệ
              thống sẽ duyệt kích hoạt trực tiếp trong 1-3 phút.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
