import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface FeedbackItem {
  id: string;
  userName: string;
  feature: string;
  stars: number;
  comment: string;
  createdAt: string;
}

// Lưu trữ in-memory danh sách phản hồi cộng đồng (có dữ liệu mẫu khởi tạo sống động)
let feedbackStore: FeedbackItem[] = [
  {
    id: '1',
    userName: 'Minh Quân (Discord Admin)',
    feature: 'Trình Phát Nhạc',
    stars: 5,
    comment: 'Tốc độ phát nhạc cực nhanh, không còn bị delay khi chuyển hiệu ứng hay đổi bài!',
    createdAt: 'Vừa xong',
  },
  {
    id: '2',
    userName: 'Thu Thảo',
    feature: 'Bảng Xếp Hạng LIVE',
    stars: 5,
    comment: 'Bảng xếp hạng cập nhật realtime rất chuẩn, copy lệnh /play tiện lợi.',
    createdAt: '15 phút trước',
  },
  {
    id: '3',
    userName: 'Hoàng Long (Mod)',
    feature: 'Dashboard Quản Trị',
    stars: 5,
    comment: 'Giao diện web mượt mà, icon 2D mới có viền phát sáng nhìn rất sang trọng!',
    createdAt: '1 giờ trước',
  },
  {
    id: '4',
    userName: 'Tuấn Anh',
    feature: 'Trạng Thái Hệ Thống',
    stars: 5,
    comment: 'Độ trễ gateway 12ms, server Việt Nam cực kỳ ổn định 24/7.',
    createdAt: '3 giờ trước',
  },
];

let totalReviewsCount = 138;
let sumStars = 4.9 * 138;

export async function GET() {
  const averageStars = (sumStars / totalReviewsCount).toFixed(1);
  return NextResponse.json({
    ok: true,
    averageStars: Number(averageStars),
    totalReviews: totalReviewsCount,
    recentFeedbacks: feedbackStore.slice(0, 10),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feature = 'Giao diện Website', stars = 5, comment = '', userName = 'Thành viên ẩn danh' } = body;

    const validStars = Math.max(1, Math.min(5, Number(stars) || 5));
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      userName: String(userName || 'Thành viên MIMI').trim().slice(0, 50),
      feature: String(feature).slice(0, 50),
      stars: validStars,
      comment: String(comment || 'Tuyệt vời!').trim().slice(0, 300),
      createdAt: 'Vừa xong',
    };

    feedbackStore = [newItem, ...feedbackStore];
    totalReviewsCount += 1;
    sumStars += validStars;

    const averageStars = (sumStars / totalReviewsCount).toFixed(1);

    return NextResponse.json({
      ok: true,
      message: 'Cảm ơn bạn đã gửi đánh giá cho MIMI!',
      averageStars: Number(averageStars),
      totalReviews: totalReviewsCount,
      recentFeedbacks: feedbackStore.slice(0, 10),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Lỗi xử lý phản hồi' },
      { status: 400 }
    );
  }
}
