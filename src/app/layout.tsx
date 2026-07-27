import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WebPlayer } from "@/components/music/web-player";
import { FeedbackWidget } from "@/components/ui/feedback-widget";
import { env } from "@/lib/env";

// Be Vietnam Pro: bộ font thiết kế riêng cho tiếng Việt — dấu má chuẩn, đẹp ở mọi weight.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-mimi",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  title: {
    default: "MIMI BOT — Bot Nhạc Discord & Quản Trị Cộng Đồng",
    template: "%s · MIMI BOT",
  },
  description:
    "Mời MIMI vào máy chủ Discord để nghe nhạc chất lượng cao từ YouTube, điều khiển bằng nút bấm hoặc dashboard web, kèm hệ thống xác thực 24h, chấm công và giám sát kinh tế.",
  keywords: [
    "Discord bot",
    "music bot",
    "MIMI bot",
    "bot nhạc Discord",
    "bot Discord Việt Nam",
    "dashboard điều khiển nhạc",
  ],
  authors: [{ name: "MIMI Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: "MIMI BOT",
    title: "MIMI — Bot Nhạc Discord & Quản Trị Cộng Đồng",
    description:
      "Nghe nhạc Discord chất lượng cao, điều khiển bằng nút bấm hoặc dashboard web thời gian thực.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIMI — Bot Nhạc Discord",
    description: "Biến voice channel Discord thành không gian âm nhạc sống động.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-background font-sans text-gray-100 antialiased">
        {/* Nền aurora + lưới chấm cố định phía sau toàn trang */}
        <div className="mimi-aurora" aria-hidden />
        <div className="mimi-grid" aria-hidden />
        <Header />
        <main className="relative z-10 pt-24 pb-32">{children}</main>
        <WebPlayer />
        <FeedbackWidget />
        <Footer />
      </body>
    </html>
  );
}
