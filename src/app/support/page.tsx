'use client';

import React from 'react';
import { HelpCircle, MessageSquare, ExternalLink, ShieldCheck, Sparkles, LifeBuoy } from 'lucide-react';
import { env } from '@/lib/env';

const faqs = [
  {
    q: 'Làm thế nào để phát nhạc với Mimi?',
    a: 'Bạn chỉ cần tham gia một kênh thoại (Voice Channel) và gõ lệnh `/play <tên bài hát hoặc link YouTube/Spotify>` hoặc sử dụng thanh tìm kiếm trực tiếp trên Bảng điều khiển Web.',
  },
  {
    q: 'Hệ thống xác thực 24h hoạt động như thế nào?',
    a: 'Mỗi ngày vào đúng 00:00 UTC+7 (múi giờ Việt Nam), Mimi tự động đặt lại trạng thái xác thực của thành viên để duy trì an ninh máy chủ. Thành viên chỉ cần bấm nút xác thực một lần để tiếp tục sử dụng kênh.',
  },
  {
    q: 'Tôi muốn thay đổi prefix của bot thì phải làm sao?',
    a: 'Bạn có thể truy cập Bảng điều khiển Web tại `mimibot.id.vn`, chọn máy chủ của bạn và đổi Prefix trong tab "Cấu Hình Máy Chủ", hoặc dùng lệnh `/config prefix <prefix_mới>`.',
  },
  {
    q: 'Tính năng cảnh báo Economy 5.000.000 xu là gì?',
    a: 'Để chống gian lận kinh tế máy chủ, Mimi theo dõi thu nhập hàng ngày. Nếu bất kỳ tài khoản nào kiếm được hơn 5.000.000 xu/ngày, Bot sẽ tự động gửi tin nhắn báo động tới Owner máy chủ.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mimi-green/10 border border-mimi-green/30 text-mimi-green text-xs font-semibold uppercase tracking-wide">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Trung Tâm Hỗ Trợ 24/7</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Chúng Tôi Luôn <span className="text-gradient-mimi">Sẵn Sàng Giúp Đỡ</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Khám phá các câu hỏi thường gặp (FAQ) hoặc tham gia ngay máy chủ hỗ trợ chính thức trên Discord để được giải đáp nhanh chóng.
          </p>
        </div>

        {/* Support Discord CTA Card */}
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-mimi-green/20 border border-mimi-green/40 flex items-center justify-center text-mimi-green mx-auto shadow-glow">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Máy Chủ Hỗ Trợ Chính Thức (Mimi Support)
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Gặp vấn đề kỹ thuật, cần yêu cầu tính năng mới hoặc muốn giao lưu cùng cộng đồng sử dụng Mimi?
            </p>
          </div>
          <div className="pt-2">
            <a
              href={env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-mimi-green to-mimi-cyan text-[#070711] font-bold text-base shadow-glow hover:scale-105 transition-transform"
            >
              <span>Tham Gia Máy Chủ Hỗ Trợ Ngay</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Câu Hỏi Thường Gặp (FAQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-panel rounded-3xl p-7 space-y-3 hover:border-white/20 transition-all"
              >
                <h3 className="text-lg font-bold text-white flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-mimi-green shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
