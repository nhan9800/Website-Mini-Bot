import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Check, History, MessageCircle, Monitor, ShieldCheck } from 'lucide-react';
import { websiteReleaseDate, websiteReleaseDateLabel, websiteReleaseTitle, websiteVersion } from '@/lib/release-info';

export const metadata: Metadata = {
  title: 'Nhật ký cập nhật',
  description: 'Những thay đổi của website Mimi, cùng trạng thái cập nhật riêng của bot và máy chủ cộng đồng.',
};

const latestChanges = [
  {
    label: 'Chữ & dấu',
    title: 'Đổi hệ chữ cho tiếng Việt rõ và có cá tính.',
    detail: 'Bricolage Grotesque hỗ trợ tiếng Việt được dùng xuyên suốt giao diện; IBM Plex Mono dành cho mã lệnh, số liệu và trạng thái. Các dấu tiếng Việt giữ đúng hình dạng ở mọi màn hình.',
  },
  {
    label: 'Chuyển động',
    title: 'Thông báo và reveal có nhịp chuyển cảnh thống nhất.',
    detail: 'Các khối nội dung xuất hiện theo viewport bằng Framer Motion, thông báo có backdrop và exit animation, còn lớp nền aurora chuyển động rất nhẹ. Animation tự dọn khi rời route để không nhân bản timeline.',
  },
  {
    label: 'Không gian 3D',
    title: 'Mimi tự chuyển động ngay khi mở trang.',
    detail: 'Robot, đĩa nhạc và tai nghe tự tải trên desktop lẫn mobile; không còn nút bắt đầu hoặc bật/tắt chuyển động. Cảnh vẫn dừng render khi khuất màn hình hoặc tab ẩn để tiết kiệm GPU.',
  },
  {
    label: 'UX/UI',
    title: 'Các route dùng chung một nhịp thị giác.',
    detail: 'Header, card, focus ring, CTA và khoảng cách được cân lại theo cùng hệ token mint. Theme sáng/tối, dashboard, trang lệnh, cộng đồng và hỗ trợ cùng giữ nguyên luồng dữ liệu thật.',
  },
];

const history = [
  {
    version: '2.6.0',
    date: '17/10/2026',
    title: 'Cảnh 3D Mimi và dữ liệu cộng đồng',
    items: [
      'Thêm RobotExpressive, đĩa nhạc và tai nghe với tương tác kéo xoay.',
      'Bảo toàn 19 đánh giá cộng đồng và bộ dữ liệu runtime khi nhận bản dựng trên cPanel.',
    ],
  },
  {
    version: '2.5.0',
    date: '02/10/2026',
    title: 'Làm mới website và bảo toàn dữ liệu cộng đồng',
    items: [
      'Giao diện mint, điều hướng sáng/tối và danh mục lệnh từ dữ liệu bot.',
      'Tách Mimi Bot miễn phí với Mimi Shield; kho đánh giá được chuyển ra ngoài thư mục bản dựng.',
      'Bản này được triển khai lên cPanel ngày 17/10/2026, kèm cơ chế nhận bản dựng tự động.',
    ],
  },
  {
    version: '2.4.0',
    date: '27/07/2026',
    title: 'Đội ngũ và cộng đồng có không gian riêng',
    items: [
      'Tách nhóm phát triển và nhóm quản trị trong phần giới thiệu đội ngũ.',
      'Thêm trang cộng đồng sử dụng bot và điều chỉnh thanh điều hướng.',
    ],
  },
  {
    version: '2.3.0',
    date: '27/07/2026',
    title: 'Bảng nhạc Việt và đánh giá cộng đồng',
    items: [
      'Kết nối bảng xếp hạng bài hát từ Apple Music Việt Nam.',
      'Bổ sung giao diện đánh giá, nhận diện tài khoản Discord và nhóm đội ngũ.',
      'Ở bản hiện tại, website chỉ hiển thị đội ngũ được bot trả về và giữ tối đa 50 đánh giá gần nhất; không tự thêm thành viên hoặc điểm sao minh họa.',
    ],
  },
  {
    version: '2.2.0',
    date: '26/07/2026',
    title: 'Cảnh nhạc 3D và khóa dashboard',
    items: [
      'Thêm cảnh vinyl WebGL, hỗ trợ giảm chuyển động và giao diện dự phòng khi thiết bị không hỗ trợ.',
      'Dashboard bổ sung khóa truy cập riêng theo máy chủ Discord.',
    ],
  },
  {
    version: '2.1.0',
    date: '26/07/2026',
    title: 'Website kết nối bot',
    items: [
      'Kết nối dashboard nhạc, trạng thái hệ thống và danh sách lệnh với API bot.',
      'Chuyển việc build sang máy phát triển hoặc CI để giảm tải hosting.',
    ],
  },
  {
    version: '2.0.0',
    date: '26/07/2026',
    title: 'Tách website và bot',
    items: [
      'Tách kho mã nguồn website Next.js và bot Discord; bổ sung API nội bộ cho hai dịch vụ.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen pb-8 pt-10 sm:pt-16">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="border-b border-white/10 pb-10 sm:pb-14">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-mimi-green"><History size={15} /> Nhật ký Mimi</p>
          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.14] tracking-tight text-white sm:text-6xl">Từng thay đổi.<br /><span className="text-mimi-green">Một Mimi tốt hơn.</span></h1>
            <p className="max-w-sm text-sm leading-7 text-gray-400 sm:text-base">Theo dõi những gì thay đổi trên website và cộng đồng. Phiên bản bot được ghi riêng theo trạng thái thực tế.</p>
          </div>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          <aside className="space-y-7 lg:sticky lg:top-28 lg:self-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Website hiện tại</p>
              <p className="mt-3 font-mono text-3xl font-semibold text-white">v{websiteVersion}</p>
              <p className="mt-2 text-sm text-gray-400">Cập nhật <time dateTime={websiteReleaseDate}>{websiteReleaseDateLabel}</time></p>
              <a href="#ban-moi-nhat" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mimi-green">Xem bản mới nhất <ArrowRight size={16} /></a>
            </div>
            <div className="border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500"><Monitor size={14} /> Mỗi dịch vụ, một bản dựng</p>
              <p className="mt-3 text-xs leading-6 text-gray-400">Số phiên bản trên trang này là của website. Mở trang trạng thái để xem dữ liệu bot đang chạy.</p>
              <Link href="/status" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-mimi-green">Trạng thái bot <ArrowUpRight size={15} /></Link>
            </div>
            <div className="border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500"><MessageCircle size={14} /> Cộng đồng · 02/10</p>
              <p className="mt-3 text-xs leading-6 text-gray-400">Máy chủ hỗ trợ đã có bố cục, phân quyền và bộ emoji mới. Cấu hình máy chủ được cập nhật riêng; mã bot 1.4.0 chưa được triển khai trong đợt này.</p>
              <a href="https://discord.com/channels/1517068246493429852/1555605739949531137" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-mimi-green">Hướng dẫn trên Discord <ArrowUpRight size={15} /></a>
            </div>
          </aside>

          <div className="min-w-0">
            <article id="ban-moi-nhat" className="scroll-mt-28 overflow-hidden rounded-2xl border border-mimi-green/25 bg-surface">
              <div className="border-b border-white/10 p-6 sm:p-9">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-mimi-green/10 px-2.5 py-1 font-semibold text-mimi-green"><Check size={13} /> Mới nhất</span>
                  <span className="font-mono text-gray-500">WEBSITE v{websiteVersion}</span>
                  <time dateTime={websiteReleaseDate} className="text-gray-500">{websiteReleaseDateLabel}</time>
                </div>
                <h2 className="mt-5 max-w-2xl text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">{websiteReleaseTitle}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">Làm mới trải nghiệm duyệt web và hoàn thiện những phần kết nối dữ liệu, truy cập và đánh giá cộng đồng.</p>
              </div>
              <div className="divide-y divide-white/[0.07] px-6 sm:px-9">
                {latestChanges.map((change) => (
                  <div key={change.label} className="grid gap-3 py-6 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6">
                    <span className="pt-1 font-mono text-[11px] uppercase tracking-wider text-mimi-green">{change.label}</span>
                    <div>
                      <h3 className="text-base font-semibold leading-6 text-white">{change.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-gray-400">{change.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-5 sm:px-9">
                <p className="flex items-center gap-2 text-xs text-gray-500"><ShieldCheck size={15} /> Mimi Bot miễn phí cho cộng đồng</p>
                <Link href="/commands" className="inline-flex items-center gap-2 text-sm font-semibold text-mimi-green">Khám phá lệnh Mimi <ArrowRight size={16} /></Link>
              </div>
            </article>

            <div className="mb-3 mt-14 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <h2 className="text-lg font-semibold text-white">Những phiên bản trước</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">Lịch sử website</span>
            </div>
            {history.map((release) => (
              <article key={release.version} className="grid gap-4 border-b border-white/10 py-7 sm:grid-cols-[115px_minmax(0,1fr)] sm:gap-8">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-200">v{release.version}</p>
                  <p className="mt-2 text-xs text-gray-500">{release.date}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{release.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-gray-400">
                    {release.items.map((item) => <li key={item} className="flex gap-3"><span aria-hidden className="mt-3 h-1 w-1 shrink-0 rounded-full bg-gray-500" /><span>{item}</span></li>)}
                  </ul>
                </div>
              </article>
            ))}
            <p className="mt-6 text-xs leading-6 text-gray-500">Các mục lịch sử mô tả thay đổi tại thời điểm phát hành. Tính năng và điều kiện truy cập hiện tại được ghi trong hướng dẫn sử dụng.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
