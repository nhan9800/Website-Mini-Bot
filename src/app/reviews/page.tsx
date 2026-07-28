import React from 'react';
import { Metadata } from 'next';
import { Star, Sparkles, Quote, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Đánh Giá Từ Cộng Đồng | MIMI BOT',
  description: 'Đọc hàng ngàn đánh giá thực tế từ người dùng về trải nghiệm sử dụng MIMI Bot.',
};

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

// Giả lập data dài cho trang reviews (Thực tế sẽ gọi từ DB/API)
const EXTENDED_REVIEWS: FeedbackItem[] = [
  {
    id: '1',
    userName: 'Minh Tuấn',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    isVerified: true,
    feature: 'Bảng Xếp Hạng LIVE',
    stars: 5,
    comment:
      'BXH nhạc Việt cập nhật real-time quá xịn! Từ ngày có Mimi bot, voice channel trong server lúc nào cũng nhộn nhịp thành viên vào nghe nhạc chung.',
    createdAt: 'Hôm nay',
  },
  {
    id: '2',
    userName: 'Thảo My',
    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
    isVerified: true,
    feature: 'Trình Phát Nhạc',
    stars: 5,
    comment:
      'Chất âm 320kbps cực trong và không bị rè hay đứt đoạn như mấy bot cũ. Tính năng tự tìm lời bài hát chuẩn xác 100%!',
    createdAt: 'Hôm qua',
  },
  {
    id: '3',
    userName: 'Hải Đăng',
    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    isVerified: false,
    feature: 'Dashboard Quản Trị',
    stars: 4,
    comment:
      'Giao diện web mới cực kỳ sang trọng, vừa nghe nhạc vừa mở Dashboard trên web bấm Pause/Skip không cần gõ lệnh Discord tiện thật sự! Chờ bản update thêm chỉnh âm lượng nữa là 5 sao.',
    createdAt: 'Hôm qua',
  },
  {
    id: '4',
    userName: 'Lan Anh Nguyễn',
    avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
    isVerified: true,
    feature: 'Hệ thống Cày Cấp',
    stars: 5,
    comment:
      'Từ lúc xài hệ thống tính điểm tương tác của Mimi, member chat nhiều hẳn, không còn dead server nữa. Giao diện xem level card trên web cũng rất đẹp.',
    createdAt: '2 ngày trước',
  },
  {
    id: '5',
    userName: 'Quốc Bảo (Dev)',
    avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
    isVerified: true,
    feature: 'Tính năng 24/7',
    stars: 5,
    comment:
      'Bot bám voice siêu trâu, mở nhạc lofi 24/7 không rớt lần nào. Gần như vô địch trong tầm giá so với mấy bot nước ngoài.',
    createdAt: '3 ngày trước',
  },
  {
    id: '6',
    userName: 'Hoàng Phương',
    avatar: 'https://cdn.discordapp.com/embed/avatars/5.png',
    isVerified: false,
    feature: 'Giao diện Website',
    stars: 5,
    comment:
      'Web chạy mượt, giao diện Dark mode chuẩn gu gamer. Tôi có thể quản lý bot trực tiếp từ điện thoại siêu tiện lợi.',
    createdAt: 'Tuần trước',
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-mimi-green/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
            <Sparkles className="h-4 w-4" />
            Cộng Đồng MIMI
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm">
            Khách Hàng Nói Gì Về <span className="text-mimi-green">MIMI?</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Hàng ngàn máy chủ Discord đã tin tưởng và sử dụng MIMI Bot để nâng tầm không gian âm nhạc.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="glass-panel px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://cdn.discordapp.com/embed/avatars/${i}.png`}
                    className="w-10 h-10 rounded-full border-2 border-[#05060f] object-cover"
                    alt="user"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white">4.9/5.0</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters/Search (UI Only) */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="glass-panel flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 w-full md:w-96 focus-within:border-mimi-green/50 transition-colors">
            <Search className="h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Tìm kiếm đánh giá..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['Tất cả', 'Trình Phát Nhạc', 'Dashboard', 'Hệ thống Cày Cấp', 'Giao diện'].map((filter, i) => (
              <button 
                key={filter}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-mimi-green text-gray-900 shadow-[0_0_15px_rgba(46,204,113,0.3)]' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {EXTENDED_REVIEWS.map((rev, idx) => (
            <div 
              key={rev.id || idx} 
              className="glass-panel card-lift group break-inside-avoid flex flex-col justify-between rounded-3xl border border-white/10 p-7 transition-all duration-500 hover:border-mimi-green/50 hover:shadow-[0_0_30px_rgba(46,204,113,0.15)]"
            >
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
                    {rev.createdAt}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-200">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  {rev.avatar && (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm">
                      <img src={rev.avatar} alt={rev.userName} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-1.5">
                      {rev.userName}
                      {rev.isVerified && (
                        <div className="group/badge relative flex items-center justify-center">
                          <svg
                            className="h-4 w-4 text-[#1d9bf0] drop-shadow-[0_0_3px_rgba(29,155,240,0.5)]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.766 1.873 3.45-.013.18-.024.358-.024.55 0 2.21 1.71 3.998 3.918 3.998.505 0 .985-.09 1.435-.264 1.13 1.31 2.805 2.136 4.7 2.136 1.894 0 3.57-.826 4.7-2.136.45.174.93.264 1.436.264 2.21 0 3.918-1.792 3.918-4 0-.192-.01-.37-.024-.55 1.133-.684 1.873-1.99 1.873-3.45zm-11.233 4.6l-3.332-3.333 1.414-1.414 1.918 1.918 5.757-5.757 1.414 1.414-7.17 7.17z" />
                          </svg>
                          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover/badge:opacity-100">
                            Đã xác minh Discord
                          </span>
                        </div>
                      )}
                    </h3>
                    <p className="text-xs font-semibold text-mimi-green/80">{rev.feature}</p>
                  </div>
                </div>
                <Quote className="h-6 w-6 flex-shrink-0 text-white/5 group-hover:text-mimi-green/20 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
