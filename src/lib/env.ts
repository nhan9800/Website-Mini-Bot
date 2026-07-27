/**
 * Biến môi trường CÔNG KHAI — an toàn để import từ cả client component.
 * Cấu hình server (host/token của Internal API) nằm ở src/lib/mimi-api.ts,
 * tuyệt đối không đặt ở đây để tránh lộ ra trình duyệt.
 */
export const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://mimibot.id.vn',
  NEXT_PUBLIC_DISCORD_SUPPORT_URL:
    process.env.NEXT_PUBLIC_DISCORD_SUPPORT_URL || 'https://discord.gg/KwHvTG2EmW',
  NEXT_PUBLIC_BOT_INVITE_URL:
    process.env.NEXT_PUBLIC_BOT_INVITE_URL ||
    'https://discord.com/oauth2/authorize?client_id=1327164993883832381&permissions=8&scope=bot%20applications.commands',
  NEXT_PUBLIC_GITHUB_URL:
    process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/nhan9800/Website-Mini-Bot',
};
