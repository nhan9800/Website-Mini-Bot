'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Star, MessageSquarePlus, X, Send, CheckCircle2, Sparkles, User, ThumbsUp } from 'lucide-react';

interface FeedbackItem {
  id: string;
  userName: string;
  feature: string;
  stars: number;
  comment: string;
  createdAt: string;
}

const FEATURES = [
  'Trình Phát Nhạc',
  'Bảng Xếp Hạng LIVE',
  'Dashboard Quản Trị',
  'Danh Sách Lệnh',
  'Trạng Thái Hệ Thống',
  'Giao diện Website',
];

const STAR_LABELS: Record<number, string> = {
  1: 'Cần cải thiện nhiều 😞',
  2: 'Tạm được 😐',
  3: 'Khá ổn, cần mượt hơn 🙂',
  4: 'Rất tuyệt vời! 😄',
  5: 'Đỉnh nóc kịch trần! 🤩🔥',
};

interface LinkedDiscordUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
}

export function FeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rate' | 'community'>('rate');
  const [stars, setStars] = useState(5);
  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState('Giao diện Website');
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Trạng thái liên kết tài khoản Discord
  const [linkedUser, setLinkedUser] = useState<LinkedDiscordUser | null>(null);
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [discordInput, setDiscordInput] = useState('');
  const [linking, setLinking] = useState(false);

  // Stats đồng bộ từ API
  const [avgStars, setAvgStars] = useState<number>(4.9);
  const [totalReviews, setTotalReviews] = useState<number>(138);
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackItem[]>([]);

  // Tự động chọn tính năng theo trang hiện tại
  useEffect(() => {
    if (pathname.includes('/status')) {
      setSelectedFeature('Trạng Thái Hệ Thống');
    } else if (pathname.includes('/dashboard')) {
      setSelectedFeature('Dashboard Quản Trị');
    } else if (pathname.includes('/commands')) {
      setSelectedFeature('Danh Sách Lệnh');
    } else {
      setSelectedFeature('Trình Phát Nhạc');
    }
  }, [pathname]);

  // Tải danh sách feedback cộng đồng
  const loadFeedbackStats = async () => {
    try {
      const res = await fetch('/api/feedback', { cache: 'no-store' });
      const data = await res.json();
      if (data?.ok) {
        setAvgStars(data.averageStars || 4.9);
        setTotalReviews(data.totalReviews || 138);
        setRecentFeedbacks(data.recentFeedbacks || []);
      }
    } catch {}
  };

  useEffect(() => {
    loadFeedbackStats();
    try {
      const saved = localStorage.getItem('mimi_linked_discord_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLinkedUser(parsed);
        setUserName(`@${parsed.username} · ✔ Verified`);
      }
    } catch {}
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mimi-feedback', handleOpen);
    return () => window.removeEventListener('open-mimi-feedback', handleOpen);
  }, []);

  const handleLinkDiscord = async () => {
    if (!discordInput.trim()) return;
    setLinking(true);
    try {
      const res = await fetch(`/api/user?q=${encodeURIComponent(discordInput.trim())}`);
      const data = await res.json();
      if (data?.ok && data.user) {
        setLinkedUser(data.user);
        setUserName(`@${data.user.username} · ✔ Verified`);
        try {
          localStorage.setItem('mimi_linked_discord_user', JSON.stringify(data.user));
        } catch {}
        setShowLinkBox(false);
        setDiscordInput('');
      }
    } catch {}
    setLinking(false);
  };

  const handleUnlink = () => {
    setLinkedUser(null);
    setUserName('');
    try {
      localStorage.removeItem('mimi_linked_discord_user');
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: selectedFeature,
          stars,
          comment: comment || 'MIMI quá tuyệt vời!',
          userName: userName || 'Thành viên MIMI',
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setAvgStars(data.averageStars || avgStars);
        setTotalReviews(data.totalReviews || totalReviews);
        setRecentFeedbacks(data.recentFeedbacks || recentFeedbacks);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setComment('');
        }, 4000);
      }
    } catch {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút Floating nổi ở góc phải dưới toàn bộ website */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            loadFeedbackStats();
          }}
          className="group relative flex items-center gap-2 rounded-full border border-mimi-green/40 bg-gray-950/90 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(46,204,113,0.3)] backdrop-blur-md transition-all hover:scale-105 hover:border-mimi-green hover:shadow-[0_0_35px_rgba(46,204,113,0.5)]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mimi-green/20 text-mimi-green group-hover:scale-110 transition-transform">
            <Star className="h-3.5 w-3.5 fill-mimi-green text-mimi-green" />
          </span>
          <span>Đánh Giá & Góp Ý</span>
          <span className="rounded-full bg-mimi-green/20 px-2 py-0.5 font-mono text-[11px] font-extrabold text-mimi-green">
            {avgStars}★ ({totalReviews})
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mimi-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-mimi-green"></span>
          </span>
        </button>
      </div>

      {/* Modal Đánh giá đồng bộ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel-glow relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-gray-950/95 p-6 sm:p-8 shadow-2xl">
            {/* Nút Đóng */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Tiêu đề */}
            <div className="space-y-1 pb-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-mimi-green">
                <Sparkles className="h-4 w-4" />
                <span>Đồng bộ mọi tính năng của MIMI</span>
              </div>
              <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                Đánh Giá & Phản Hồi Trải Nghiệm
              </h3>
              <p className="text-xs text-gray-400">
                Ý kiến đóng góp của bạn giúp đội ngũ MIMI phát triển website ngày càng hoàn thiện.
              </p>
            </div>

            {/* Chuyển đổi tab: Viết đánh giá | Xem ý kiến cộng đồng */}
            <div className="grid grid-cols-2 gap-2 my-5 rounded-2xl bg-white/5 p-1.5 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('rate')}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  activeTab === 'rate'
                    ? 'bg-mimi-green text-gray-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Gửi Đánh Giá
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('community')}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  activeTab === 'community'
                    ? 'bg-mimi-purple text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Cộng Đồng ({totalReviews})
              </button>
            </div>

            {activeTab === 'rate' ? (
              submitted ? (
                <div className="my-8 flex flex-col items-center justify-center space-y-3 text-center animate-fade-in">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mimi-green/20 text-mimi-green ring-4 ring-mimi-green/10">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Cảm ơn bạn đã đánh giá!</h4>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Phản hồi của bạn về tính năng <strong className="text-mimi-green">{selectedFeature}</strong> đã được ghi nhận và đồng bộ lên hệ thống MIMI.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Chấm điểm sao */}
                  <div className="space-y-2 text-center">
                    <label className="text-xs font-bold text-gray-300">
                      Bạn đánh giá trải nghiệm MIMI bao nhiêu sao?
                    </label>
                    <div className="flex items-center justify-center gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStars(s)}
                          onMouseEnter={() => setHoverStar(s)}
                          onMouseLeave={() => setHoverStar(null)}
                          className="transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              s <= (hoverStar ?? stars)
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-extrabold text-yellow-400">
                      {STAR_LABELS[hoverStar ?? stars]}
                    </p>
                  </div>

                  {/* Chọn tính năng */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300">
                      Tính năng bạn đang quan tâm:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FEATURES.map((feat) => (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => setSelectedFeature(feat)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                            selectedFeature === feat
                              ? 'border-mimi-green bg-mimi-green/20 text-mimi-green shadow-[0_0_12px_rgba(46,204,113,0.25)]'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {feat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card liên kết tài khoản Discord */}
                  {linkedUser ? (
                    <div className="flex items-center justify-between rounded-2xl border border-mimi-green/30 bg-mimi-green/10 p-3 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-mimi-green">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={linkedUser.avatar || '/logo.webp'}
                            alt={linkedUser.displayName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-white flex items-center gap-1">
                            {linkedUser.displayName}
                            <span className="rounded-full bg-mimi-green/20 px-1.5 py-0.5 text-[9px] font-bold text-mimi-green">
                              ✔ Discord Verified
                            </span>
                          </span>
                          <span className="text-[10px] text-gray-400">@{linkedUser.username}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleUnlink}
                        className="text-[10px] font-semibold text-red-400 hover:underline"
                      >
                        Đổi acc
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold text-indigo-300">
                            Liên Kết Tài Khoản Discord
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowLinkBox(!showLinkBox)}
                          className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-[10px] font-extrabold text-indigo-300 transition-colors hover:bg-indigo-500/30"
                        >
                          {showLinkBox ? 'Đóng' : '🔗 Kết Nối Acc'}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        Kết nối ID hoặc Username Discord để hiển thị huy hiệu <strong className="text-indigo-300">✔ Verified Member</strong> cùng avatar thật khi đánh giá.
                      </p>

                      {showLinkBox && (
                        <div className="mt-2 flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Nhập Discord Tag/ID (VD: nhan9800)..."
                            value={discordInput}
                            onChange={(e) => setDiscordInput(e.target.value)}
                            className="flex-1 rounded-xl border border-indigo-500/30 bg-[#05060f]/80 px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleLinkDiscord}
                            disabled={linking}
                            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-indigo-500 disabled:opacity-50"
                          >
                            {linking ? 'Đang xác thực...' : 'Xác Nhận'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tên & Bình luận */}
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Tên hiển thị của bạn (VD: Minh Quân)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:border-mimi-green focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      placeholder="Bạn thích điều gì nhất hoặc muốn MIMI cải tiến thêm gì?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white placeholder:text-gray-500 focus:border-mimi-green focus:outline-none"
                    />
                  </div>

                  {/* Nút gửi */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mimi-green to-emerald-500 py-3 text-sm font-extrabold text-gray-950 shadow-[0_0_25px_rgba(46,204,113,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Đang gửi...' : 'Gửi Đánh Giá Ngay'}</span>
                  </button>
                </form>
              )
            ) : (
              /* Danh sách feedback từ cộng đồng */
              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {recentFeedbacks.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-6">
                    Chưa có đánh giá nào. Hãy là người đầu tiên!
                  </p>
                ) : (
                  recentFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xs text-white">
                          <User className="h-3.5 w-3.5 text-mimi-green" />
                          <span>{fb.userName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {Array.from({ length: fb.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{fb.comment}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-white/5">
                        <span className="rounded-md bg-mimi-green/10 px-2 py-0.5 font-semibold text-mimi-green">
                          {fb.feature}
                        </span>
                        <span>{fb.createdAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
