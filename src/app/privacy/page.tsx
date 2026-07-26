import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-white/10 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mimi-green/10 text-mimi-green text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Pháp Lý & Bảo Mật</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Chính Sách Bảo Mật (Privacy Policy)
          </h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: Tháng 7 năm 2026</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 sm:p-10 space-y-6 text-gray-300 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Thu Thập Dữ Liệu</h2>
            <p>
              Mimi Bot chỉ thu thập những dữ liệu cần thiết nhất phục vụ hoạt động cơ bản của hệ thống trong máy chủ Discord của bạn, bao gồm:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>ID Máy chủ (Guild ID) và cài đặt cấu hình prefix/247 mode.</li>
              <li>ID Người dùng (User ID) để lưu số dư Economy và giờ chấm công nhân sự.</li>
              <li>ID Kênh thoại (Voice Channel ID) và ID Kênh văn bản (Text Channel ID) cho thông báo.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Bảo Mật Dữ Liệu</h2>
            <p>
              Chúng tôi cam kết không bán, trao đổi hay tiết lộ dữ liệu máy chủ và người dùng cho bất kỳ bên thứ ba nào phi lợi nhuận hay thương mại. Toàn bộ thông tin được lưu trữ cục bộ trong cơ sở dữ liệu an toàn trên hệ thống máy chủ của chúng tôi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Quyền Xóa Dữ Liệu Của Bạn</h2>
            <p>
              Bạn có toàn quyền yêu cầu xóa bỏ toàn bộ dữ liệu cấu hình máy chủ, thống kê giờ chấm công hoặc số dư Economy bằng cách gửi yêu cầu tới đội ngũ hỗ trợ trên máy chủ Discord chính thức của Mimi.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
