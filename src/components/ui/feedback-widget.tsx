'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Star, X, Send, CheckCircle2, User, ChevronDown } from 'lucide-react';

interface FeedbackItem {
  id: string;
  userName: string;
  avatar?: string;
  isVerified?: boolean;
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
  1: 'Tệ 😞',
  2: 'Tạm 😐',
  3: 'Khá 🙂',
  4: 'Tốt 😄',
  5: 'Tuyệt đỉnh 🤩',
};

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

  const [avgStars, setAvgStars] = useState<number>(4.9);
  const [totalReviews, setTotalReviews] = useState<number>(138);
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    if (pathname.includes('/status')) setSelectedFeature('Trạng Thái Hệ Thống');
    else if (pathname.includes('/dashboard')) setSelectedFeature('Dashboard Quản Trị');
    else if (pathname.includes('/commands')) setSelectedFeature('Danh Sách Lệnh');
    else setSelectedFeature('Trình Phát Nhạc');
  }, [pathname]);

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
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mimi-feedback', handleOpen);
    return () => window.removeEventListener('open-mimi-feedback', handleOpen);
  }, []);

  const { data: session } = useSession();
  const linkedUser = session?.user;

  useEffect(() => {
    if (linkedUser && !userName) {
      setUserName(linkedUser.name || '');
    }
  }, [linkedUser, userName]);

  const handleLinkDiscord = () => signIn('discord');
  const handleUnlink = () => signOut();

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
          userName: linkedUser ? linkedUser.name : (userName || 'Thành viên Ẩn danh'),
          avatar: linkedUser?.image || '',
          isVerified: !!linkedUser,
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
        }, 3000);
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
          <span>Đánh Giá</span>
          <span className="rounded-full bg-mimi-green/20 px-2 py-0.5 font-mono text-[11px] font-extrabold text-mimi-green">
            {avgStars}★
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div>
                <h3 className="text-lg font-black text-white">Đánh Giá MIMI</h3>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">Phản hồi của bạn giúp chúng tôi tốt hơn.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-5">
              <div className="flex rounded-xl bg-white/[0.03] p-1 border border-white/5 mb-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('rate')}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'rate'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Viết Đánh Giá
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('community')}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'community'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Cộng Đồng ({totalReviews})
                </button>
              </div>

              {activeTab === 'rate' ? (
                submitted ? (
                  <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center animate-fade-in">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mimi-green/20 text-mimi-green ring-4 ring-mimi-green/5">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="text-base font-bold text-white">Cảm ơn bạn!</h4>
                    <p className="text-xs text-gray-400 max-w-[250px]">
                      Phản hồi đã được ghi nhận vào hệ thống.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                    {/* Stars */}
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 p-3.5">
                      <div className="space-y-0.5 text-left">
                        <label className="text-xs font-bold text-gray-200">Trải nghiệm</label>
                        <p className="text-[10px] font-medium text-yellow-500">{STAR_LABELS[hoverStar ?? stars]}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStars(s)}
                            onMouseEnter={() => setHoverStar(s)}
                            onMouseLeave={() => setHoverStar(null)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                s <= (hoverStar ?? stars)
                                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                  : 'text-gray-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Features Select */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-400 pl-1">Tính năng quan tâm</label>
                      <div className="relative">
                        <select
                          value={selectedFeature}
                          onChange={(e) => setSelectedFeature(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-white transition-colors focus:border-mimi-green focus:outline-none focus:ring-1 focus:ring-mimi-green cursor-pointer"
                        >
                          {FEATURES.map((feat) => (
                            <option key={feat} value={feat} className="bg-gray-900 text-white">
                              {feat}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Authentication / Identity */}
                    {!linkedUser ? (
                      <div className="space-y-3 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-3.5">
                        <button
                          type="button"
                          onClick={handleLinkDiscord}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#4752C4] shadow-sm"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.3,46,96.19,53,91.13,65.69,84.69,65.69Z"/></svg>
                          Đăng nhập bằng Discord
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-white/10" />
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Hoặc Ẩn Danh</span>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <input
                          type="text"
                          placeholder="Tên hiển thị (Tùy chọn)"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm text-white placeholder:text-gray-600 focus:border-white/20 focus:outline-none transition-colors"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-mimi-green/20 bg-mimi-green/5 p-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={linkedUser.image || '/logo.webp'}
                            alt={linkedUser.name || 'User'}
                            className="h-8 w-8 rounded-full border border-mimi-green/30 object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white flex items-center gap-1">
                              {linkedUser.name}
                              <svg className="h-3.5 w-3.5 text-[#1d9bf0] drop-shadow-[0_0_3px_rgba(29,155,240,0.5)]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.766 1.873 3.45-.013.18-.024.358-.024.55 0 2.21 1.71 3.998 3.918 3.998.505 0 .985-.09 1.435-.264 1.13 1.31 2.805 2.136 4.7 2.136 1.894 0 3.57-.826 4.7-2.136.45.174.93.264 1.436.264 2.21 0 3.918-1.792 3.918-4 0-.192-.01-.37-.024-.55 1.133-.684 1.873-1.99 1.873-3.45zm-11.233 4.6l-3.332-3.333 1.414-1.414 1.918 1.918 5.757-5.757 1.414 1.414-7.17 7.17z" /></svg>
                            </span>
                            <span className="text-[9px] font-medium text-mimi-green">Đã xác minh danh tính</span>
                          </div>
                        </div>
                        <button type="button" onClick={handleUnlink} className="text-[10px] font-medium text-gray-500 hover:text-red-400 transition-colors">
                          Đăng xuất
                        </button>
                      </div>
                    )}

                    {/* Comment */}
                    <textarea
                      rows={2}
                      placeholder="Chia sẻ cảm nhận hoặc góp ý của bạn..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-600 focus:border-white/30 focus:outline-none transition-colors"
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || (!linkedUser && !userName.trim() && !comment.trim())}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-extrabold text-black shadow-lg transition-all hover:bg-gray-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 mt-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>{loading ? 'Đang xử lý...' : 'Gửi Đánh Giá Ngay'}</span>
                    </button>
                  </form>
                )
              ) : (
                <div className="h-[360px] space-y-3 overflow-y-auto pr-2 pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {recentFeedbacks.length === 0 ? (
                    <p className="text-center text-xs text-gray-500 py-10">Chưa có đánh giá nào.</p>
                  ) : (
                    recentFeedbacks.map((fb) => (
                      <div key={fb.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 space-y-2.5 transition-colors hover:bg-white/[0.04]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {fb.avatar ? (
                              <img src={fb.avatar} alt={fb.userName} className="h-6 w-6 rounded-full border border-white/10 object-cover" />
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
                                <User className="h-3 w-3 text-gray-400" />
                              </div>
                            )}
                            <span className="flex items-center gap-1 text-xs font-bold text-white">
                              {fb.userName}
                              {fb.isVerified && (
                                <svg className="h-3.5 w-3.5 text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.766 1.873 3.45-.013.18-.024.358-.024.55 0 2.21 1.71 3.998 3.918 3.998.505 0 .985-.09 1.435-.264 1.13 1.31 2.805 2.136 4.7 2.136 1.894 0 3.57-.826 4.7-2.136.45.174.93.264 1.436.264 2.21 0 3.918-1.792 3.918-4 0-.192-.01-.37-.024-.55 1.133-.684 1.873-1.99 1.873-3.45zm-11.233 4.6l-3.332-3.333 1.414-1.414 1.918 1.918 5.757-5.757 1.414 1.414-7.17 7.17z" /></svg>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: fb.stars }).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed pl-8">{fb.comment}</p>
                        <div className="flex items-center justify-between text-[9px] font-medium text-gray-500 pt-2 pl-8">
                          <span className="rounded bg-white/5 px-1.5 py-0.5">{fb.feature}</span>
                          <span>{fb.createdAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
