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
    label: 'Giao diện',
    title: 'Một diện mạo mới, từ trang chủ đến nhật ký.',
    detail: 'Bố cục mint gọn hơn, điều hướng rõ ràng trên điện thoại và máy tính, có lựa chọn giao diện sáng hoặc tối. Phiên bản website được dùng thống nhất trên thanh điều hướng, chân trang và thông tin bản dựng.',
  },
  {
    label: 'Cộng đồng',
    title: 'Mimi Bot miễn phí. Mimi Shield là sản phẩm riêng.',
    detail: 'Lệnh nghe nhạc, công cụ cộng đồng và dashboard của Mimi Bot không yêu cầu mua bản quyền. Các gói bảo vệ của Mimi Shield được trình bày riêng để tránh nhầm lẫn.',
  },
  {
    label: 'Dữ liệu',
    title: 'Đánh giá được lưu ngoài thư mục bản dựng.',
    detail: 'Kho đánh giá bền vững có bước chuyển dữ liệu trước khi rebuild. Danh tính xác minh được kiểm tra phía máy chủ; số sao, trạng thái bot và đội ngũ hiển thị theo dữ liệu nhận được, có thông báo khi chưa tải được.',
  },
  {
    label: 'Truy cập',
    title: 'Dashboard giữ khóa truy cập theo máy chủ.',
    detail: 'Các yêu cầu điều khiển nhạc và thay đổi cấu hình được kiểm tra quyền phía máy chủ. Danh sách lệnh có bản chụp dự phòng được ghi rõ nguồn khi API bot chưa sẵn sàng.',
  },
];

const history = [
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
