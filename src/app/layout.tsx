import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WebPlayer } from "@/components/music/web-player";
import { FeedbackWidget } from "@/components/ui/feedback-widget";
import { env } from "@/lib/env";
import { AuthProvider } from "@/components/layout/auth-provider";
import { NotificationProvider } from "@/components/ui/notification-provider";
import { RouteTransition } from "@/components/layout/route-transition";
import { CreativeDirector } from "@/components/creative/creative-director";

// Bricolage Grotesque: display sans có cá tính, hỗ trợ tiếng Việt và vẫn rõ ở cỡ nhỏ.
const brico = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mimi",
  display: "swap",
});

// IBM Plex Mono: số liệu và lệnh có nhịp chữ rõ, hỗ trợ dấu tiếng Việt.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
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
    default: "MIMI BOT · Bot Nhạc Discord & Quản Trị Cộng Đồng",
    template: "%s · MIMI BOT",
  },
  description:
    "Mimi nhạc và cộng đồng miễn phí cho máy chủ Discord: nghe nhạc, hàng chờ, xác thực theo cấu hình, cấp độ và dashboard dùng khóa truy cập. Mimi Shield là bot anti-raid riêng.",
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
    title: "MIMI · Bot Nhạc Discord & Quản Trị Cộng Đồng",
    description:
      "Bot nhạc và cộng đồng tiếng Việt miễn phí. Nghe nhạc, quản lý hàng chờ và dùng dashboard theo quyền máy chủ.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIMI · Bot Nhạc Discord",
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
    <html lang="vi" className={`${brico.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-gray-100 antialiased">
        <AuthProvider>
          <NotificationProvider>
            <CreativeDirector />
            {/* Nền aurora + lưới chấm cố định phía sau toàn trang */}
            <div className="mimi-aurora" aria-hidden />
            <div className="mimi-grid" aria-hidden />
            <a href="#main-content" className="skip-link">Bỏ qua điều hướng</a>
            <Header />
            <main id="main-content" className="page-shell relative z-10 pt-24 pb-32">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <WebPlayer />
            <FeedbackWidget />
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
