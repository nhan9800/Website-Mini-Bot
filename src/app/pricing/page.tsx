'use client';

import React, { useState, useEffect } from 'react';
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
  Crown,
  X
} from 'lucide-react';
import { env } from '@/lib/env';
import { TiltCard } from '@/components/ui/tilt-card';
import { StatusModal } from '@/components/ui/status-modal';

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

  // Status Modal Thông Báo Cyberpunk (Thay Alert Trình Duyệt)
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    description: string | React.ReactNode;
    badge?: string;
    confirmText?: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    description: '',
  });

  const showModal = (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    description: string | React.ReactNode,
    badge?: string,
    confirmText?: string
  ) => {
    setModalState({
      isOpen: true,
      type,
      title,
      description,
      badge,
      confirmText,
    });
  };

  // Tra cứu HWID
  const [checkId, setCheckId] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  // Kích hoạt Key
  const [redeemGuildId, setRedeemGuildId] = useState('');
  const [redeemKey, setRedeemKey] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState<any>(null);

  const handleOpenPayment = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const cleanGuildId = serverGuildId.trim() || 'SERVER_ID';
  const transferContent = `MIMI ${selectedPlan.id.toUpperCase()} ${cleanGuildId}`;
  const vietQrUrl = `https://img.vietqr.io/image/970436-9369144188-compact2.png?amount=${selectedPlan.price}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=DAO%20NGOC%20QUANG`;

  const copyToClipboard = (text: string, keyName: string, label = 'Thông tin') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showModal('success', 'Đã Sao Chép!', `${label} đã được lưu vào khay nhớ tạm: ${text}`, 'ĐÃ COPY');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCheckLicense = async () => {
    if (!checkId.trim()) {
      showModal('warning', 'Thiếu Server ID', 'Vui lòng nhập Server ID (HWID) để tra cứu hạn bản quyền.', 'YÊU CẦU');
      return;
    }
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const res = await fetch(`/api/license/check?guildId=${encodeURIComponent(checkId.trim())}`);
      const data = await res.json();
      setCheckResult(data);
      if (data.ok && data.license?.active) {
        showModal(
          'success',
          'Bản Quyền Đang Hoạt Động!',
          `Máy chủ ${checkId.trim()} đang kích hoạt gói ${data.license.planName}. Còn ${data.license.remainingDays} ngày bảo vệ 24/7.`,
          'ĐANG BẢO VỆ'
        );
      } else if (data.ok && !data.license?.active) {
        showModal(
          'warning',
          'Chưa Kích Hoạt / Hết Hạn',
          `Máy chủ ${checkId.trim()} hiện chưa kích hoạt bản quyền MIMI SHIELD. Vui lòng mua Key hoặc gia hạn tại đây!`,
          'CHƯA KÍCH HOẠT'
        );
      } else {
        showModal('error', 'Không Thể Tra Cứu', data.error || 'Máy chủ bot không phản hồi.', 'LỖI TRA CỨU');
      }
    } catch {
      setCheckResult({ ok: false, error: 'Không thể kết nối đến máy chủ bot.' });
      showModal('error', 'Lỗi Kết Nối', 'Không thể kết nối tới hệ thống tra cứu bản quyền.', 'LỖI KẾT NỐI');
    } finally {
      setCheckLoading(false);
    }
  };

  const handleRedeemKey = async () => {
    if (!redeemGuildId.trim()) {
      showModal('warning', 'Thiếu Server ID', 'Vui lòng nhập Server ID (HWID) cần kích hoạt bản quyền.', 'YÊU CẦU THÔNG TIN');
      return;
    }
    if (!redeemKey.trim()) {
      showModal('warning', 'Thiếu Mã License Key', 'Vui lòng nhập mã License Key dạng MIMI-SHIELD-XXXX-XXXX.', 'YÊU CẦU THÔNG TIN');
      return;
    }

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
      if (data.ok) {
        showModal(
          'success',
          'Kích Hoạt Bản Quyền Thành Công!',
          `Chúc mừng bạn! Máy chủ ${redeemGuildId.trim()} đã được kích hoạt thành công gói ${data.planName || 'MIMI SHIELD'} (+${data.daysAdded || 30} ngày).`,
          'KÍCH HOẠT HỢP LỆ'
        );
      } else {
        showModal(
          'error',
          'Kích Hoạt Thất Bại',
          data.error || 'Mã License Key không tồn tại hoặc đã qua sử dụng.',
          'MÃ KEY KHÔNG HỢP LỆ'
        );
      }
    } catch {
      setRedeemResult({ ok: false, error: 'Lỗi kích hoạt mã key.' });
      showModal('error', 'Lỗi Kết Nối', 'Không thể kết nối tới máy chủ kích hoạt bản quyền.', 'LỖI HỆ THỐNG');
    } finally {
      setRedeemLoading(false);
    }
  };

  // Admin Duyệt Tiền & Cấp Key
  const [adminGuildId, setAdminGuildId] = useState('');
  const [adminPlan, setAdminPlan] = useState('1m');
  const [adminSecret, setAdminSecret] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminResult, setAdminResult] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminAction = async (action: 'activate' | 'generate_key') => {
    if (!adminSecret.trim()) {
      showModal(
        'warning',
        'Yêu Cầu Mã PIN Admin',
        'Vui lòng nhập Mã PIN / Secret bảo mật Admin để xác thực quyền quản trị.',
        'CẦN XÁC THỰC'
      );
      return;
    }
    if (action === 'activate' && !adminGuildId.trim()) {
      showModal(
        'warning',
        'Thiếu Server ID (HWID)',
        'Vui lòng nhập Server ID (Guild ID) cần kích hoạt bản quyền trực tiếp.',
        'THIẾU THÔNG TIN'
      );
      return;
    }

    setAdminLoading(true);
    setAdminResult(null);
    try {
      const res = await fetch('/api/license/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: adminGuildId.trim(),
          plan: adminPlan,
          secret: adminSecret.trim(),
          action,
          note: adminNote.trim(),
        }),
      });
      const data = await res.json();
      setAdminResult(data);

      if (data.ok) {
        if (action === 'generate_key') {
          showModal(
            'success',
            'Tạo Key Mới Thành Công!',
            `Đã tạo thành công mã License Key cho gói ${data.planName || adminPlan}: ${data.key}`,
            'ĐÃ TẠO KEY'
          );
        } else {
          showModal(
            'success',
            'Kích Hoạt Server Thành Công!',
            `Đã duyệt thanh toán và kích hoạt thành công cho Server ID: ${adminGuildId.trim()}!`,
            'HOÀN TẤT DUYỆT'
          );
        }
      } else {
        showModal(
          'error',
          'Thao Tác Thất Bại',
          data.error || 'Mã xác thực Admin không chính xác hoặc có lỗi xảy ra.',
          'LỖI XÁC THỰC'
        );
      }
    } catch {
      setAdminResult({ ok: false, error: 'Lỗi kết nối tới hệ thống Admin.' });
      showModal('error', 'Lỗi Kết Nối', 'Không thể gửi yêu cầu xác nhận tới hệ thống Admin.', 'LỖI HỆ THỐNG');
    } finally {
      setAdminLoading(false);
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

        {/* Quick Invite Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://discord.com/oauth2/authorize?client_id=1539527939723497473&permissions=8&integration_type=0&scope=bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Shield className="h-4 w-4" />
            Mời MIMI SHIELD (Vệ Sĩ Anti-Raid)
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://discord.com/oauth2/authorize?client_id=1516603522584416376&permissions=8&integration_type=0&scope=bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4 text-mimi-green" />
            Mời MIMI BOT (Nghe Nhạc 100% Free)
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 pb-4 mb-20 items-stretch overflow-visible">
        {plans.map((p) => {
          return (
            <TiltCard key={p.id} maxTilt={6} className="h-full rounded-3xl overflow-visible">
              <div
                className={`relative flex h-full flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  p.popular
                    ? 'border-2 border-mimi-green bg-[#0e1322] shadow-[0_0_40px_rgba(46,204,113,0.2)] md:-translate-y-2'
                    : p.vip
                    ? 'border-2 border-yellow-400/80 bg-[#161320] shadow-[0_0_40px_rgba(234,179,8,0.2)]'
                    : 'border border-white/10 bg-[#0a0c16] hover:border-white/20'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 rounded-full bg-gradient-to-r from-mimi-green to-mimi-cyan px-4 py-1 text-xs font-black uppercase text-[#05060f] shadow-lg shadow-mimi-green/30 whitespace-nowrap">
                    🔥 PHỔ BIẾN NHẤT
                  </div>
                )}
                {p.vip && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1 text-xs font-black uppercase text-black shadow-lg shadow-yellow-500/30 whitespace-nowrap">
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
                      ? 'bg-gradient-brand text-[#05060f] shadow-lg shadow-mimi-green/20 hover:scale-[1.02] active:scale-[0.98]'
                      : p.vip
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-white/10 text-white hover:bg-white/15 active:scale-[0.98]'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  Mua Gói {p.name.split(' ')[1]}
                </button>
              </div>
            </TiltCard>
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

      {/* Admin Panel Duyệt Tiền & Cấp Key */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-[#070913] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Dành Cho Quản Trị Viên (Admin MIMI)</h3>
              <p className="text-xs text-gray-400">Xác nhận đã nhận tiền để kích hoạt Server trực tiếp hoặc cấp mã License Key mới</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors"
          >
            {showAdminPanel ? 'Thu Gọn Bảng Admin ▲' : 'Mở Bảng Xác Nhận Admin ▼'}
          </button>
        </div>

        {showAdminPanel && (
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Server ID (Guild ID) cần xử lý:</label>
                <input
                  type="text"
                  value={adminGuildId}
                  onChange={(e) => setAdminGuildId(e.target.value)}
                  placeholder="VD: 1476175503827144808..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Chọn Gói Bản Quyền:</label>
                <select
                  value={adminPlan}
                  onChange={(e) => setAdminPlan(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#121422] px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="1m">🌟 Gói 1 Tháng (50.000đ - 30 ngày)</option>
                  <option value="3m">💎 Gói 3 Tháng (140.000đ - 90 ngày)</option>
                  <option value="12m">👑 Gói 12 Tháng (390.000đ - 365 ngày)</option>
                  <option value="permanent">♾️ Gói Vĩnh Viễn (Lifetime VIP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mã PIN / Secret Bảo Mật Admin:</label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Nhập secret bảo mật của bot..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Ghi Chú Đơn Hàng / Tên Khách:</label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="VD: Khách VCB 50k bill..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleAdminAction('activate')}
                disabled={adminLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {adminLoading ? 'Đang xử lý...' : '✅ Xác Nhận Đã Nhận Tiền & Kích Hoạt Server'}
              </button>

              <button
                onClick={() => handleAdminAction('generate_key')}
                disabled={adminLoading}
                className="w-full py-3 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-400 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {adminLoading ? 'Đang tạo...' : '🔑 Tạo Mã License Key Mới'}
              </button>
            </div>

            {adminResult && (
              <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm">
                {adminResult.ok ? (
                  <div className="space-y-2 text-mimi-green">
                    <div className="font-bold flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-5 w-5 text-mimi-green" />
                      {adminResult.message || 'Thao tác thành công!'}
                    </div>
                    {adminResult.key && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-mimi-green/30 mt-2">
                        <span className="text-xs text-gray-400">Mã Key mới:</span>
                        <code className="font-mono font-bold text-yellow-300 text-base flex-1">{adminResult.key}</code>
                        <button
                          onClick={() => copyToClipboard(adminResult.key, 'adminKey')}
                          className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/30 flex items-center gap-1"
                        >
                          {copiedKey === 'adminKey' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          Copy Key
                        </button>
                      </div>
                    )}
                    {adminResult.license && (
                      <div className="text-xs text-gray-300 space-y-1">
                        <div>Server ID: <b>{adminResult.license.guildId}</b></div>
                        <div>Hạn mới: <b className="text-mimi-cyan">{adminResult.license.isPermanent ? 'Vĩnh Viễn' : new Date(adminResult.license.expiresTimestamp).toLocaleString('vi-VN')}</b> (+{adminResult.license.remainingDays} ngày)</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-400 text-xs flex items-center gap-2">
                    <span>❌ {adminResult.error || 'Thao tác thất bại.'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e111a] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Nút X đóng nổi bật ở góc phải */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300 hover:bg-red-500/80 hover:text-white transition-all shadow-md"
              aria-label="Đóng cửa sổ thanh toán"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pr-8 pl-8">
              <h3 className="text-2xl font-bold text-white">Thanh Toán {selectedPlan.name}</h3>
              <p className="text-sm text-mimi-green font-semibold mt-1">Số tiền: {selectedPlan.priceFormatted}</p>
            </div>

            {/* Nút Mời Bot Anti-Raid Gắn Qua Thanh Toán */}
            <div className="rounded-2xl border border-mimi-cyan/40 bg-gradient-to-r from-mimi-cyan/15 via-blue-500/10 to-mimi-cyan/15 p-4 text-center space-y-2.5 shadow-inner">
              <div className="text-xs font-black text-mimi-cyan flex items-center justify-center gap-1.5 uppercase tracking-wide">
                <Shield className="h-4 w-4" /> BƯỚC 1: MỜI MIMI SHIELD VÀO MÁY CHỦ
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Máy chủ cần có mặt MIMI SHIELD BOT để hệ thống tự động kích hoạt bảo vệ 24/7 ngay khi nhận Key.
              </p>
              <a
                href="https://discord.com/oauth2/authorize?client_id=1539527939723497473&permissions=8&integration_type=0&scope=bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs shadow-lg shadow-cyan-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                <Bot className="h-4 w-4" />
                MỜI MIMI SHIELD BOT VÀO SERVER NGAY
                <ExternalLink className="h-4 w-4" />
              </a>
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
              <img src={vietQrUrl} alt="VietQR Vietcombank" className="mx-auto max-w-[200px] w-full rounded-lg" />
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

            {/* Nút Đóng Cửa Sổ ở dưới đáy */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
            >
              ✕ Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
