import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { env } from "@/lib/env";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
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
  title: {
    default: "Mimi — Discord Music & Community Ecosystem",
    template: "%s · Mimi",
  },
  description:
    "Mời Mimi vào máy chủ Discord của bạn để nghe nhạc chất lượng cao, quản lý hệ thống xác thực, chấm công nhân sự và trải nghiệm dashboard trực quan hiện đại.",
  keywords: ["Discord bot", "music bot", "Mimi", "bot nhạc Discord", "bot Việt Nam", "nextjs dashboard"],
  authors: [{ name: "Mimi Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: "Mimi Bot",
    title: "Mimi — Discord Music & Community Ecosystem",
    description: "Trải nghiệm nghe nhạc Discord cực đỉnh cùng hệ sinh thái quản trị cộng đồng thông minh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimi — Discord Music Bot",
    description: "Biến voice channel Discord thành không gian âm nhạc tuyệt đỉnh.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070711",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-[#070711] text-gray-100 font-sans antialiased selection:bg-mimi-green/30 selection:text-mimi-green">
        <div className="mimi-bg-glow" aria-hidden />
        <Header />
        <main className="relative z-10 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
