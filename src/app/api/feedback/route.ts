import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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

const defaultFeedbacks: FeedbackItem[] = [
  {
    id: '1',
    userName: 'Minh Quân',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    isVerified: true,
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

function getStoreFile(): string {
  const primaryPath = path.join(process.cwd(), '.next', 'mimi_feedback_store.json');
  try {
    const dir = path.dirname(primaryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return primaryPath;
  } catch {
    return '/tmp/mimi_feedback_store.json';
  }
}

function loadStore(): FeedbackItem[] {
  try {
    const file = getStoreFile();
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    // lỗi đọc -> dùng default
  }
  return defaultFeedbacks;
}

function saveStore(items: FeedbackItem[]) {
  try {
    const file = getStoreFile();
    fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf8');
  } catch (e) {
    // lỗi ghi
  }
}

export async function GET() {
  const store = loadStore();
  const totalReviews = 134 + store.length;
  const sumStars = 4.9 * 134 + store.reduce((acc, cur) => acc + (cur.stars || 5), 0);
  const averageStars = (sumStars / totalReviews).toFixed(1);

  return NextResponse.json({
    ok: true,
    averageStars: Number(averageStars),
    totalReviews,
    recentFeedbacks: store.slice(0, 15),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feature = 'Giao diện Website', stars = 5, comment = '', userName = 'Thành viên ẩn danh', avatar = '', isVerified = false } = body;

    const validStars = Math.max(1, Math.min(5, Number(stars) || 5));
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      userName: String(userName || 'Thành viên MIMI').trim().slice(0, 50),
      avatar: String(avatar).trim(),
      isVerified: Boolean(isVerified),
      feature: String(feature).slice(0, 50),
      stars: validStars,
      comment: String(comment || 'Tuyệt vời!').trim().slice(0, 300),
      createdAt: 'Vừa xong',
    };

    const currentStore = loadStore();
    const newStore = [newItem, ...currentStore.filter((x) => x.id !== newItem.id)].slice(0, 50);
    saveStore(newStore);

    const totalReviews = 134 + newStore.length;
    const sumStars = 4.9 * 134 + newStore.reduce((acc, cur) => acc + (cur.stars || 5), 0);
    const averageStars = (sumStars / totalReviews).toFixed(1);

    return NextResponse.json({
      ok: true,
      message: 'Cảm ơn bạn đã gửi đánh giá cho MIMI!',
      averageStars: Number(averageStars),
      totalReviews,
      recentFeedbacks: newStore.slice(0, 15),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Lỗi xử lý phản hồi' },
      { status: 400 }
    );
  }
}
