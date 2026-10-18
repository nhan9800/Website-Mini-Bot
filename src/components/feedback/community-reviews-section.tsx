'use client';

import React, { useEffect, useState } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { ArrowUpRight, BadgeCheck, Star, MessageSquarePlus, Quote } from 'lucide-react';

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

export function CommunityReviewsSection() {
  const [avgStars, setAvgStars] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'unavailable'>('loading');

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/feedback', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data?.ok) {
          setAvgStars(data.averageStars ?? null);
          setTotalReviews(data.totalReviews ?? 0);
          if (Array.isArray(data.recentFeedbacks)) {
            setReviews(data.recentFeedbacks.slice(0, 3));
          }
          setLoadState('ready');
        } else {
          setLoadState('unavailable');
        }
      } catch { setLoadState('unavailable'); }
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
                <Star key={s} className={`h-5 w-5 ${avgStars !== null && s <= Math.round(avgStars) ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-xl font-black text-white">{avgStars === null ? 'Chưa có điểm' : `${avgStars} / 5.0`}</span>
            <span className="text-sm font-semibold text-gray-400">
              ({loadState === 'unavailable' ? 'Chưa tải được đánh giá' : totalReviews === null ? 'Đang đồng bộ đánh giá' : `${totalReviews} lượt đánh giá đã lưu`})
            </span>
          </div>
          <p className="text-gray-400">
            Hệ thống chấm điểm và ghi nhận ý kiến phản hồi đồng bộ trên toàn bộ tính năng website.
          </p>
        </Reveal>

        {/* Lưới review */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.length === 0 && <p className="text-sm text-gray-400">{loadState === 'unavailable' ? 'Chưa tải được đánh giá. Hãy thử lại sau.' : loadState === 'loading' ? 'Đang tải đánh giá…' : 'Chưa có đánh giá để hiển thị.'}</p>}
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
                  <div className="flex items-center gap-3">
                    {rev.avatar && (
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rev.avatar} alt={rev.userName} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-1.5">
                        {rev.userName}
                        {rev.isVerified && (
                          <div className="group/badge relative flex items-center justify-center">
                            <BadgeCheck
                              className="h-4 w-4 text-[#1d9bf0] drop-shadow-[0_0_3px_rgba(29,155,240,0.5)]"
                              aria-label="Đã xác minh Discord"
                            />
                            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-on-color opacity-0 transition-opacity group-hover/badge:opacity-100">
                              Đã xác minh Discord
                            </span>
                          </div>
                        )}
                      </h3>
                      <p className="text-xs font-semibold text-mimi-green">{rev.feature}</p>
                    </div>
                  </div>
                  <Quote className="h-7 w-7 flex-shrink-0 text-white/10 group-hover:text-yellow-400/40 transition-colors" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Nút Call To Action nổi bật kêu gọi thành viên bấm đánh giá */}
        <Reveal delay={300} className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-mimi-feedback'))}
            className="group relative inline-flex items-center gap-3 rounded-full border border-yellow-400 bg-gradient-to-r from-yellow-500/25 via-amber-500/20 to-yellow-500/25 px-8 py-4 text-base font-extrabold text-yellow-300 shadow-[0_0_35px_rgba(234,179,8,0.35)] transition-all duration-300 hover:scale-105 hover:border-yellow-300 hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]"
          >
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-bounce" />
            <span>Chấm Điểm & Góp Ý</span>
            <ArrowUpRight className="h-5 w-5 text-yellow-200" aria-hidden="true" />
          </button>
          
          <a
            href="/reviews"
            className="group relative inline-flex items-center gap-3 rounded-full border border-mimi-green/50 bg-mimi-green/10 px-8 py-4 text-base font-extrabold text-mimi-green shadow-[0_0_30px_rgba(46,204,113,0.15)] transition-all duration-300 hover:scale-105 hover:bg-mimi-green/20 hover:shadow-[0_0_40px_rgba(46,204,113,0.3)]"
          >
            <MessageSquarePlus className="h-5 w-5" />
            <span>Xem Tất Cả Đánh Giá</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
