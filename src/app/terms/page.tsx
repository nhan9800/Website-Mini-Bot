import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-white/10 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mimi-green/10 text-mimi-green text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Pháp Lý & Điều Khoản</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Điều Khoản Dịch Vụ (Terms of Service)
          </h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: Tháng 7 năm 2026</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 sm:p-10 space-y-6 text-gray-300 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Chấp Nhận Điều Khoản</h2>
            <p>
              Khi mời Mimi Bot vào máy chủ Discord hoặc sử dụng trang web quản trị này, bạn đồng ý tuân thủ toàn bộ các điều khoản dịch vụ được nêu tại đây cùng với Điều khoản Sử dụng (ToS) của Discord.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Quy Định Sử Dụng Lành Mạnh</h2>
            <p>
              Nghiêm cấm các hành vi lợi dụng lỗi hệ thống, gửi spam câu lệnh âm nhạc, tấn công từ chối dịch vụ (DoS) tới hệ thống Lavalink hoặc lạm dụng hệ thống Economy xu của Bot.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Thay Đổi Dịch Vụ</h2>
            <p>
              Chúng tôi có quyền bảo trì, nâng cấp hoặc điều chỉnh các tính năng âm nhạc và hệ thống mà không cần thông báo trước nhằm đảm bảo sự ổn định chung cho cộng đồng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
