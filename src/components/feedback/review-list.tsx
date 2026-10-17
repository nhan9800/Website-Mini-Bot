'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { BadgeCheck, Search, Star, MessageSquarePlus } from 'lucide-react';
import type { FeedbackItem } from '@/lib/feedback-store';

function normalizeSearch(value: string): string {
  return String(value ?? '')
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export function ReviewList({ reviews, unavailable = false }: { reviews: FeedbackItem[]; unavailable?: boolean }) {
  const [query, setQuery] = useState('');
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const filteredReviews = useMemo(() => {
    const terms = normalizeSearch(query.trim()).split(/\s+/).filter(Boolean);
    return reviews.filter((review) => {
      if (selectedStars !== null && review.stars !== selectedStars) return false;
      const searchable = normalizeSearch(`${review.userName} ${review.feature || ''} ${review.comment}`);
      return terms.every(term => searchable.includes(term));
    });
  }, [reviews, query, selectedStars]);

  const resetFilters = () => {
    setQuery('');
    setSelectedStars(null);
  };

  return (
    <section aria-label="Danh sách đánh giá cộng đồng" className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full space-y-2 lg:max-w-sm">
          <label htmlFor="review-search" className="block text-xs font-semibold text-gray-300">Tìm theo tên, tính năng hoặc nội dung</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 focus-within:border-mimi-green/60">
            <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <input id="review-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm đánh giá..." disabled={unavailable} className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-400 disabled:opacity-60" />
          </div>
        </div>
        <div className="space-y-2">
          <p id="review-stars-label" className="text-xs font-semibold text-gray-300">Lọc theo số sao</p>
          <div role="group" aria-labelledby="review-stars-label" className="flex flex-wrap gap-2">
            {[null, 5, 4, 3, 2, 1].map(stars => {
              const selected = selectedStars === stars;
              return (
                <button key={stars ?? 'all'} type="button" aria-pressed={selected} onClick={() => setSelectedStars(stars)} disabled={unavailable} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors disabled:opacity-60 ${selected ? 'border-mimi-green bg-mimi-green text-[#07120e]' : 'border-white/15 bg-transparent text-gray-300 hover:border-mimi-green/50 hover:text-white'}`}>
                  {stars === null ? 'Tất cả' : <>{stars} sao <Star className="h-3 w-3" aria-hidden="true" /></>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-gray-400">{unavailable ? 'Chưa tải được đánh giá' : `Hiển thị ${filteredReviews.length} / ${reviews.length} đánh giá`}</p>
        {(query || selectedStars !== null) && <button type="button" onClick={resetFilters} className="text-sm font-medium text-mimi-green underline-offset-4 hover:underline">Xóa bộ lọc</button>}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
          <p className="text-sm leading-relaxed text-gray-400">{unavailable ? 'Chưa tải được đánh giá. Hãy thử lại sau.' : reviews.length === 0 ? 'Chưa có đánh giá nào. Bạn có thể gửi ý kiến để giúp Mimi hoàn thiện.' : 'Không tìm thấy đánh giá phù hợp. Thử từ khóa khác hoặc xóa bộ lọc.'}</p>
          {!unavailable && reviews.length === 0 && (
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-mimi-feedback'))} className="btn-secondary mt-5 !px-5 !py-3 !text-sm">
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" /> Gửi đánh giá
            </button>
          )}
        </div>
      ) : (
        <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
          {filteredReviews.map(review => (
            <article key={review.id} className="break-inside-avoid rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-mimi-green/40">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1" role="img" aria-label={`${review.stars} trên 5 sao`}>
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} aria-hidden="true" className={`h-4 w-4 ${star <= review.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />)}
                </div>
                {review.createdAt && <p className="text-xs text-gray-400">{review.createdAt}</p>}
              </div>
              <blockquote className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-200">&ldquo;{review.comment}&rdquo;</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                {review.avatar && <Image width={40} height={40} src={review.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />}
                <div className="min-w-0">
                  <h2 className="flex items-center gap-1.5 break-words text-sm font-bold text-white">
                    {review.userName}
                    {review.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-mimi-green" role="img" aria-label="Đã xác minh Discord" />}
                  </h2>
                  {review.feature && <p className="mt-1 text-xs text-gray-400">{review.feature}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
