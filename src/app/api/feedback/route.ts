import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomUUID } from 'node:crypto';
import { authOptions } from '@/lib/auth-options';
import { loadFeedback, saveFeedback, feedbackStats, type FeedbackItem } from '@/lib/feedback-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, ...feedbackStats(loadFeedback()) });
  } catch {
    return NextResponse.json({ ok: false, averageStars: null, totalReviews: 0, recentFeedbacks: [], error: 'Chưa đọc được đánh giá. Hãy thử lại sau.' }, { status: 503 });
  }
}

export async function POST(req: Request) {
  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: 'Body phải là JSON hợp lệ.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'Body phải là một object JSON.' }, { status: 400 });
  }
  const stars = Number(body.stars);
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
  if (!Number.isInteger(stars) || stars < 1 || stars > 5 || !comment || comment.length > 300) {
    return NextResponse.json({ ok: false, error: 'Chọn 1–5 sao và nhập nội dung từ 1–300 ký tự.' }, { status: 400 });
  }
  try {
    // Danh tính đã xác minh phải đến từ phiên Discord ký trên server, không tin cờ client.
    const session = process.env.NEXTAUTH_SECRET?.trim() ? await getServerSession(authOptions) : null;
    const sessionId = (session?.user as { id?: string } | undefined)?.id;
    const newItem: FeedbackItem = {
      id: randomUUID(),
      userName: String(sessionId ? session?.user?.name || 'Thành viên Discord' : body.userName || 'Thành viên ẩn danh').trim().slice(0, 50) || 'Thành viên ẩn danh',
      avatar: sessionId ? session?.user?.image || '' : '',
      isVerified: Boolean(sessionId),
      feature: String(body.feature || 'Giao diện Website').slice(0, 50),
      stars, comment, createdAt: new Date().toISOString(),
    };
    const items = [newItem, ...loadFeedback()].slice(0, 50);
    saveFeedback(items);
    return NextResponse.json({ ok: true, message: 'Cảm ơn bạn đã gửi đánh giá cho MIMI!', ...feedbackStats(items) });
  } catch {
    return NextResponse.json({ ok: false, error: 'Không lưu được đánh giá. Hãy thử lại sau.' }, { status: 503 });
  }
}
