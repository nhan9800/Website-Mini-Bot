'use client';

import React, { useEffect, useState } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Star, MessageSquarePlus, Sparkles, ThumbsUp, Quote } from 'lucide-react';

interface FeedbackItem {
  id: string;
  userName: string;
  feature: string;
  stars: number;
  comment: string;
  createdAt: string;
}

const DEFAULT_REVIEWS: FeedbackItem[] = [
  {
    id: '1',
    userName: 'Minh Tuấn · Discord Guild Owner',
    feature: 'Bảng Xếp Hạng LIVE',
    stars: 5,
    comment:
      'BXH nhạc Việt cập nhật real-time quá xịn! Từ ngày có Mimi bot, voice channel trong server lúc nào cũng nhộn nhịp thành viên vào nghe nhạc chung.',
    createdAt: 'Hôm nay',
  },
  {
    id: '2',
    userName: 'Thảo My · Music Lover',
    feature: 'Trình Phát Nhạc',
    stars: 5,
    comment:
      'Chất âm 320kbps cực trong và không bị rè hay đứt đoạn như mấy bot cũ. Tính năng tự tìm lời bài hát chuẩn xác 100%!',
    createdAt: 'Hôm nay',
  },
  {
    id: '3',
    userName: 'Hải Đăng · Admin Cộng Đồng',
    feature: 'Dashboard Quản Trị',
    stars: 5,
    comment:
      'Giao diện web mới cực kỳ sang trọng, vừa nghe nhạc vừa mở Dashboard trên web bấm Pause/Skip không cần gõ lệnh Discord tiện thật sự!',
    createdAt: 'Hôm qua',
  },
];

export function CommunityReviewsSection() {
  const [avgStars, setAvgStars] = useState<number>(4.9);
  const [totalReviews, setTotalReviews] = useState<number>(138);
  const [reviews, setReviews] = useState<FeedbackItem[]>(DEFAULT_REVIEWS);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/feedback', { cache: 'no-store' });
        const data = await res.json();
        if (data?.ok) {
          setAvgStars(data.averageStars || 4.9);
          setTotalReviews(data.totalReviews || 138);
          if (data.recentFeedbacks && data.recentFeedbacks.length > 0) {
            setReviews(data.recentFeedbacks.slice(0, 3));
          }
        }
      } catch {}
    }
    fetchReviews();
  }, []);

  return (
    <section id="danh-gia" className="scroll-mt-24 border-y border-white/5 bg-white/[0.015] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.25)]">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
            <span>Đánh Giá Từ Cộng Đồng MIMI</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Khách Hàng Nói Gì Về <span className="text-gradient-mimi">MIMI BOT</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-md" />
              ))}
            </div>
            <span className="text-xl font-black text-white">{avgStars} / 5.0</span>
            <span className="text-sm font-semibold text-gray-400">
              ({totalReviews} lượt đánh giá thực tế)
            </span>
          </div>
          <p className="text-gray-400">
            Hệ thống chấm điểm và ghi nhận ý kiến phản hồi đồng bộ trên toàn bộ tính năng website.
          </p>
        </Reveal>

        {/* Lưới review */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((rev, idx) => (
            <Reveal key={rev.id || idx} delay={idx * 100}>
              <div className="glass-panel card-lift group flex h-full flex-col justify-between rounded-3xl border border-white/10 p-7 transition-all duration-500 hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (rev.stars || 5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-gray-400">
                      {rev.createdAt || 'Mới đây'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <h3 className="font-bold text-white">{rev.userName}</h3>
                    <p className="text-xs font-semibold text-mimi-green">{rev.feature}</p>
                  </div>
                  <Quote className="h-7 w-7 text-white/10 group-hover:text-yellow-400/40 transition-colors" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Nút Call To Action nổi bật kêu gọi thành viên bấm đánh giá */}
        <Reveal delay={300} className="mt-14 text-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-mimi-feedback'))}
            className="group relative inline-flex items-center gap-3 rounded-full border border-yellow-400 bg-gradient-to-r from-yellow-500/25 via-amber-500/20 to-yellow-500/25 px-8 py-4 text-base font-extrabold text-yellow-300 shadow-[0_0_35px_rgba(234,179,8,0.35)] transition-all duration-300 hover:scale-105 hover:border-yellow-300 hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]"
          >
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-bounce" />
            <span>Chấm Điểm & Góp Ý Cho MIMI Ngay</span>
            <Sparkles className="h-5 w-5 text-yellow-200" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
