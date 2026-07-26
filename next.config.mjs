/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Bỏ qua kiểm tra ESLint và Typescript trong lúc build trên cPanel để tiết kiệm RAM
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'media.discordapp.net' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  experimental: {
    // Ép Next.js chạy đơn luồng (1 CPU worker) để chống lỗi OOM Killed trên hosting cPanel
    cpus: 1,
    workerThreads: false,
    memoryBasedWorkersCount: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
