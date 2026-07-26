import React from 'react';
import type { Metadata } from 'next';
import { FileText, CheckCircle2, Ban, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều Khoản Dịch Vụ',
  description: 'Điều khoản sử dụng dịch vụ của Mimi Bot và website dashboard.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-14">
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-mimi-green/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-mimi-green">
            <FileText className="h-3.5 w-3.5" />
            <span>Pháp lý & điều khoản</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: Tháng 7 năm 2026</p>
        </div>

        <div className="glass-panel space-y-8 rounded-3xl p-8 text-sm leading-relaxed text-gray-300 sm:p-10 sm:text-base">
          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <CheckCircle2 className="h-5 w-5 text-mimi-green" />
              <span>1. Chấp Nhận Điều Khoản</span>
            </h2>
            <p>
              Khi mời Mimi vào máy chủ Discord hoặc sử dụng website quản trị này, bạn đồng ý
              tuân thủ toàn bộ điều khoản dịch vụ nêu tại đây, cùng với Điều khoản Sử dụng và
              Nguyên tắc Cộng đồng của Discord.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <Ban className="h-5 w-5 text-mimi-pink" />
              <span>2. Hành Vi Bị Nghiêm Cấm</span>
            </h2>
            <ul className="list-disc space-y-1.5 pl-6 text-gray-400">
              <li>Lợi dụng lỗi hệ thống hoặc spam câu lệnh nhằm gây quá tải bot.</li>
              <li>Tấn công từ chối dịch vụ (DoS) tới hạ tầng của Mimi.</li>
              <li>Gian lận hệ thống Economy xu hoặc dữ liệu chấm công.</li>
              <li>Dùng bot để phát nội dung vi phạm pháp luật hoặc bản quyền có chủ đích thương mại.</li>
            </ul>
            <p className="text-gray-400">
              Vi phạm có thể dẫn tới việc máy chủ hoặc người dùng bị chặn sử dụng dịch vụ vĩnh viễn.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
              <RefreshCw className="h-5 w-5 text-mimi-cyan" />
              <span>3. Thay Đổi Dịch Vụ</span>
            </h2>
            <p>
              Mimi là dịch vụ miễn phí. Chúng tôi có quyền bảo trì, nâng cấp hoặc điều chỉnh
              tính năng mà không cần thông báo trước nhằm đảm bảo sự ổn định chung. Các thay đổi
              quan trọng sẽ được cập nhật trong Nhật Ký Thay Đổi và server hỗ trợ.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
