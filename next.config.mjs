/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Web được build ở máy dev/CI, artifact .next được chuyển lên hosting.
  // Trên cPanel Nhân Hòa KHÔNG chạy `next build` nữa (2GB RAM sẽ bị OOM Killed),
  // cPanel pull artifact, npm ci và migration trước khi restart Passenger.
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
    // Giữ build đơn luồng để giảm RAM ở máy dev/CI; hosting nhận artifact đã build.
    // LƯU Ý: KHÔNG bật memoryBasedWorkersCount — nó đọc RAM của cả máy chủ vật lý
    // (không phải hạn mức LVE 2GB) nên sẽ spawn nhiều worker và gây OOM Killed.
    cpus: 1,
    workerThreads: false,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
