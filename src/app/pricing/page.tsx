'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Music,
  Sparkles,
  CheckCircle2,
  Zap,
  Bot,
  Copy,
  Check,
  Search,
  KeyRound,
  QrCode,
  ExternalLink,
  Crown,
  X
} from 'lucide-react';
import { env } from '@/lib/env';
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
    name: '1 tháng',
    price: 50000,
    priceFormatted: '50.000đ',
    duration: '30 ngày bảo vệ',
    badge: 'TIÊU CHUẨN',
    features: [
      'Hệ thống Anti-Raid và Anti-Nuke của Mimi Shield',
      'Chống xóa Kênh & Vai Trò hàng loạt',
      'Tự động chặn Bot Lạ & lọc Clone Raid',
      'Cấu hình bảo vệ theo nhu cầu máy chủ',
      'Cập nhật trong thời gian bản quyền'
    ]
  },
  {
    id: '3m',
    name: '3 tháng',
    price: 140000,
    priceFormatted: '140.000đ',
    save: 'Tiết kiệm 10.000đ',
    duration: '90 ngày bảo vệ',
    badge: 'PHỔ BIẾN NHẤT',
    popular: true,
    features: [
      'Bao gồm mọi tính năng của Gói 1 Tháng',
      'Thời hạn bản quyền 90 ngày',
      'Gia hạn cộng dồn theo máy chủ',
      'Hướng dẫn setup và cấu hình bảo vệ',
      'Hỗ trợ qua cộng đồng Discord'
    ]
  },
  {
    id: '12m',
    name: '12 tháng',
    price: 390000,
    priceFormatted: '390.000đ',
    save: 'Tiết kiệm 210.000đ so với 12 gói tháng',
    duration: '365 ngày (1 Năm)',
    badge: 'DÀI HẠN',
    vip: true,
    features: [
      'Bao gồm mọi tính năng của Gói 1 Tháng',
      'Thời hạn bản quyền 365 ngày',
      'Gia hạn cộng dồn theo máy chủ',
      'Hướng dẫn setup và cấu hình bảo vệ',
      'Hỗ trợ qua cộng đồng Discord'
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

  const copyToClipboard = async (text: string, keyName: string, label = 'Thông tin') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      showModal('success', 'Đã Sao Chép!', `${label} đã được lưu vào khay nhớ tạm: ${text}`, 'ĐÃ COPY');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showModal('warning', 'Chưa Sao Chép Được', 'Trình duyệt chưa cho phép truy cập khay nhớ tạm. Bạn có thể chọn và sao chép nội dung hiển thị.', 'KIỂM TRA TRÌNH DUYỆT');
    }
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
          `Máy chủ ${checkId.trim()} đang kích hoạt gói ${data.license.planName}. Còn ${data.license.remainingDays} ngày bản quyền Mimi Shield.`,
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
      showModal('warning', 'Thiếu Mã License Key', 'Vui lòng nhập mã License Key được đội ngũ Mimi Shield cấp.', 'YÊU CẦU THÔNG TIN');
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
    <div className="min-h-screen pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-mimi-green">
          <Shield className="h-4 w-4" />
          Mimi Shield · Bot anti-raid riêng
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Bản quyền <span className="text-mimi-green">Mimi Shield</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-400">
          Chọn thời hạn cho bot bảo vệ máy chủ. Các gói dưới đây dành riêng cho Mimi Shield, không áp dụng cho Mimi nhạc và cộng đồng.
        </p>

        {/* Quick Invite Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={env.NEXT_PUBLIC_SHIELD_BOT_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-5 !py-3 !text-sm"
          >
            <Shield className="h-4 w-4" />
            Mời Mimi Shield
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={env.NEXT_PUBLIC_MIMI_BOT_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !px-5 !py-3 !text-sm"
          >
            <Sparkles className="h-4 w-4 text-mimi-green" />
            Mời Mimi miễn phí
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mb-10 rounded-2xl border border-mimi-green/25 bg-mimi-green/[0.035] px-6 py-5">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-white"><Music className="h-5 w-5 shrink-0 text-mimi-green" /> Mimi nhạc & cộng đồng luôn miễn phí</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-300">Nghe nhạc, phát 24/7, autoplay, cấp độ và minigame xu không cần key trả phí. Mimi Shield cung cấp công cụ anti-raid riêng; hiệu quả xử lý phụ thuộc cấu hình, quyền Discord và tình trạng kết nối.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 pb-4 mb-20 items-stretch overflow-visible">
        {plans.map((p) => {
          return (
            <div key={p.id} className="h-full rounded-2xl overflow-visible">
              <div
                className={`relative flex h-full flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  p.popular
                    ? 'border-2 border-mimi-green/70 bg-mimi-green/[0.035]'
                    : 'border border-white/10 bg-white/[0.025] hover:border-white/20'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-mimi-green px-4 py-1 text-xs font-bold text-[#05060f] whitespace-nowrap">
                    Phổ biến nhất
                  </div>
                )}
                {p.vip && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-surface px-4 py-1 text-xs font-bold text-gray-200 whitespace-nowrap">
                    Tiết kiệm 210.000đ
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
                      ? 'bg-mimi-green text-[#05060f] hover:bg-mimi-green/90 active:scale-[0.98]'
                      : 'bg-white/10 text-white hover:bg-white/15 active:scale-[0.98]'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  Chọn gói {p.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* HWID Checker & Redeem Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Check HWID */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0c16] p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-mimi-green/10 border border-mimi-green/30 text-mimi-green">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Tra Cứu Hạn Dùng (HWID)</h3>
              <p className="text-xs text-gray-400">Kiểm tra trạng thái bản quyền theo Server ID</p>
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="shield-check-guild" className="block text-xs font-semibold text-gray-300">ID máy chủ cần tra cứu</label>
            <input
              id="shield-check-guild"
              type="text"
              value={checkId}
              onChange={(e) => setCheckId(e.target.value)}
              placeholder="Nhập Server ID..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-mimi-green focus:outline-none"
            />
            <button
              onClick={handleCheckLicense}
              disabled={checkLoading}
              className="w-full py-3 rounded-xl bg-mimi-green/20 border border-mimi-green/40 text-mimi-green font-bold text-sm hover:bg-mimi-green/30 transition-colors"
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
            <div className="p-3 rounded-2xl bg-mimi-green/10 border border-mimi-green/30 text-mimi-green">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Kích Hoạt License Key</h3>
              <p className="text-xs text-gray-400">Nhập mã key Mimi Shield được đội ngũ cấp</p>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="shield-redeem-guild" className="block text-xs font-semibold text-gray-300">ID máy chủ cần kích hoạt</label>
            <input
              id="shield-redeem-guild"
              type="text"
              value={redeemGuildId}
              onChange={(e) => setRedeemGuildId(e.target.value)}
              placeholder="Nhập Server ID của máy chủ..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-mimi-green focus:outline-none"
            />
            <label htmlFor="shield-redeem-key" className="block text-xs font-semibold text-gray-300">Mã key Mimi Shield</label>
            <input
              id="shield-redeem-key"
              type="text"
              value={redeemKey}
              onChange={(e) => setRedeemKey(e.target.value)}
              placeholder="Nhập mã key Mimi Shield..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-mimi-green focus:outline-none font-mono"
            />
            <button
              onClick={handleRedeemKey}
              disabled={redeemLoading}
              className="w-full py-3 rounded-xl bg-mimi-green/20 border border-mimi-green/40 text-mimi-green font-bold text-sm hover:bg-mimi-green/30 transition-colors"
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
                        <div>Hạn mới: <b className="text-mimi-green">{adminResult.license.isPermanent ? 'Vĩnh Viễn' : new Date(adminResult.license.expiresTimestamp).toLocaleString('vi-VN')}</b> (+{adminResult.license.remainingDays} ngày)</div>
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
              <h3 className="text-2xl font-bold text-white">Mimi Shield · Gói {selectedPlan.name}</h3>
              <p className="text-sm text-mimi-green font-semibold mt-1">Số tiền: {selectedPlan.priceFormatted}</p>
            </div>

            {/* Nút Mời Bot Anti-Raid Gắn Qua Thanh Toán */}
            <div className="rounded-2xl border border-mimi-green/40 bg-gradient-to-r from-mimi-green/15 via-blue-500/10 to-mimi-green/15 p-4 text-center space-y-2.5 shadow-inner">
              <div className="text-xs font-black text-mimi-green flex items-center justify-center gap-1.5 uppercase tracking-wide">
                <Shield className="h-4 w-4" /> BƯỚC 1: MỜI MIMI SHIELD VÀO MÁY CHỦ
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Mời Mimi Shield vào máy chủ, thiết lập quyền và cấu hình bảo vệ trước khi kích hoạt bản quyền.
              </p>
              <a
                href={env.NEXT_PUBLIC_SHIELD_BOT_INVITE_URL}
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
                placeholder="Nhập Server ID..."
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
                  className="flex items-center gap-1 font-bold text-mimi-green hover:underline"
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

            <div className="text-[11px] text-gray-400 bg-mimi-green/10 border border-mimi-green/20 p-3 rounded-xl">
              ℹ️ <b>Sau khi chuyển khoản:</b> Vui lòng gửi bill cho Admin qua Discord để nhận Key kích hoạt hoặc hệ
              thống duyệt kích hoạt trực tiếp sau khi xác nhận thanh toán.
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
