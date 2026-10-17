import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

export interface FeedbackItem {
  id: string;
  userName: string;
  avatar?: string;
  isVerified?: boolean;
  feature: string;
  stars: number;
  comment: string;
  createdAt: string;
}

function storeFile(): string {
  // Thư mục build .next có thể bị xoá khi cập nhật, không dùng để giữ dữ liệu cộng đồng.
  return process.env.MIMI_FEEDBACK_STORE || path.join(process.cwd(), 'data', 'mimi_feedback_store.json');
}

export function loadFeedback(): FeedbackItem[] {
  const file = storeFile();
  if (!fs.existsSync(file)) return [];
  const items: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(items)) throw new Error('Kho đánh giá không hợp lệ.');
  return items.filter((item): item is FeedbackItem => Boolean(item && typeof item === 'object' &&
    typeof item.id === 'string' && typeof item.userName === 'string' && typeof item.comment === 'string' &&
    Number.isInteger(item.stars) && item.stars >= 1 && item.stars <= 5)).slice(0, 50);
}

export function saveFeedback(items: FeedbackItem[]): void {
  const file = storeFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file + '.tmp', JSON.stringify(items.slice(0, 50), null, 2), 'utf8');
  fs.renameSync(file + '.tmp', file);
}

export function feedbackStats(items: FeedbackItem[]) {
  return {
    averageStars: items.length ? Number((items.reduce((sum, item) => sum + item.stars, 0) / items.length).toFixed(1)) : null,
    totalReviews: items.length,
    recentFeedbacks: items.slice(0, 15),
  };
}
