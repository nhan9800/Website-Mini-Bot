import React from 'react';
import { Metadata } from 'next';
import { Star, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { loadFeedback, feedbackStats } from '@/lib/feedback-store';
import { ReviewList } from '@/components/feedback/review-list';

export const metadata: Metadata = {
  title: 'Đánh Giá Từ Cộng Đồng | MIMI BOT',
  description: 'Đọc ý kiến từ người dùng về trải nghiệm sử dụng MIMI Bot.',
};

export const dynamic = 'force-dynamic';

export default function ReviewsPage() {
  let reviews: ReturnType<typeof loadFeedback> = [];
  let unavailable = false;
  try { reviews = loadFeedback(); } catch { unavailable = true; }
  const stats = feedbackStats(reviews);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-mimi-green">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Cộng đồng Mimi
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Trải nghiệm cùng <span className="text-mimi-green">Mimi</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-400">
            Ý kiến của cộng đồng giúp Mimi hoàn thiện trải nghiệm nghe nhạc và quản lý máy chủ.
          </p>

          <div className="inline-flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
            {reviews.some(review => review.avatar) && (
              <div className="flex -space-x-3" aria-hidden="true">
                {reviews.filter(review => review.avatar).slice(0, 4).map((review) => (
                  <Image key={review.id} width={40} height={40} src={review.avatar || '/logo.webp'} className="h-10 w-10 rounded-full border-2 border-background object-cover" alt="" />
                ))}
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xl font-bold text-white">{stats.averageStars === null ? 'Chưa có điểm' : `${stats.averageStars}/5.0`}</p>
              <div className="flex items-center gap-1" aria-hidden="true">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-3.5 w-3.5 ${stats.averageStars !== null && i <= Math.round(stats.averageStars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />)}
              </div>
            </div>
            <p className="text-sm text-gray-400">{unavailable ? 'Chưa tải được dữ liệu' : `${stats.totalReviews} đánh giá đã lưu`}</p>
          </div>
        </div>

        <ReviewList reviews={reviews} unavailable={unavailable} />
      </div>
    </div>
  );
}
