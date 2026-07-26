import React from 'react';
import type { Metadata } from 'next';
import { Shield, Database, Lock, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật',
  description: 'Chính sách bảo mật và xử lý dữ liệu của Mimi Bot.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-mimi-green/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-mimi-green">
            <Shield className="h-3.5 w-3.5" />
            <span>Pháp lý & bảo mật</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: Tháng 7 năm 2026</p>
        </div>

        <div className="glass-panel space-y-8 rounded-3xl p-8 text-sm leading-relaxed text-gray-300 sm:p-10 sm:text-base">
          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <Database className="h-5 w-5 text-mimi-green" />
              <span>1. Dữ Liệu Chúng Tôi Thu Thập</span>
            </h2>
            <p>
              Mimi chỉ thu thập những dữ liệu tối thiểu cần thiết để vận hành các tính năng
              trong máy chủ Discord của bạn:
            </p>
            <ul className="list-disc space-y-1.5 pl-6 text-gray-400">
              <li>ID máy chủ (Guild ID) và cấu hình bot: prefix, chế độ xác thực, cờ thiết lập module.</li>
              <li>ID người dùng (User ID) phục vụ số dư Economy và dữ liệu chấm công.</li>
              <li>ID kênh thoại/kênh văn bản dùng cho thông báo và phát nhạc.</li>
            </ul>
            <p className="text-gray-400">
              Mimi <strong className="text-white">không</strong> đọc hay lưu nội dung tin nhắn riêng tư,
              không thu thập email, mật khẩu hay bất kỳ thông tin định danh ngoài Discord.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <Lock className="h-5 w-5 text-mimi-cyan" />
              <span>2. Lưu Trữ & Bảo Vệ</span>
            </h2>
            <p>
              Dữ liệu được lưu cục bộ trên máy chủ của Mimi tại Việt Nam. Kênh giao tiếp giữa
              website và bot được xác thực bằng service token riêng. Chúng tôi cam kết không
              bán, trao đổi hay chia sẻ dữ liệu máy chủ và người dùng cho bất kỳ bên thứ ba nào.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <Trash2 className="h-5 w-5 text-mimi-pink" />
              <span>3. Quyền Xóa Dữ Liệu</span>
            </h2>
            <p>
              Bạn có toàn quyền yêu cầu xóa toàn bộ dữ liệu cấu hình máy chủ, thống kê chấm công
              hoặc số dư Economy bằng cách gửi yêu cầu trong máy chủ Discord hỗ trợ chính thức
              của Mimi. Khi bot bị kick khỏi server, dữ liệu cấu hình của server đó không còn
              được sử dụng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
