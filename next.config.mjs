/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Web được BUILD SẴN ở máy dev/CI rồi commit thư mục .next lên Git.
  // Trên cPanel Nhân Hòa KHÔNG chạy `next build` nữa (2GB RAM sẽ bị OOM Killed),
  // chỉ cần `git pull` + restart Passenger.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Hosting shared không nên gánh image optimizer (tốn CPU/RAM) — ảnh ngoài
    // (avatar Discord, thumbnail YouTube) trả về nguyên gốc.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'media.discordapp.net' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  experimental: {
    // Giữ build đơn luồng để vẫn build khẩn cấp được ngay trên host nếu bất khả kháng.
    // LƯU Ý: KHÔNG bật memoryBasedWorkersCount — nó đọc RAM của cả máy chủ vật lý
    // (không phải hạn mức LVE 2GB) nên sẽ spawn nhiều worker và gây OOM Killed.
    cpus: 1,
    workerThreads: false,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
