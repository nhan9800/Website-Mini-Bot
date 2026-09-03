/**
 * Biến môi trường CÔNG KHAI — an toàn để import từ cả client component.
 * Cấu hình server (host/token của Internal API) nằm ở src/lib/mimi-api.ts,
 * tuyệt đối không đặt ở đây để tránh lộ ra trình duyệt.
 */
export const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://mimibot.id.vn',
  NEXT_PUBLIC_DISCORD_SUPPORT_URL:
    process.env.NEXT_PUBLIC_DISCORD_SUPPORT_URL || 'https://discord.gg/gBUHY3qph2',
  NEXT_PUBLIC_MIMI_BOT_INVITE_URL:
    process.env.NEXT_PUBLIC_MIMI_BOT_INVITE_URL ||
    'https://discord.com/oauth2/authorize?client_id=1516603522584416376&permissions=8&integration_type=0&scope=bot',
  NEXT_PUBLIC_SHIELD_BOT_INVITE_URL:
    process.env.NEXT_PUBLIC_SHIELD_BOT_INVITE_URL ||
    'https://discord.com/oauth2/authorize?client_id=1539527939723497473&permissions=8&integration_type=0&scope=bot',
  NEXT_PUBLIC_BOT_INVITE_URL:
    process.env.NEXT_PUBLIC_BOT_INVITE_URL ||
    'https://discord.com/oauth2/authorize?client_id=1516603522584416376&permissions=8&integration_type=0&scope=bot',
  NEXT_PUBLIC_GITHUB_URL:
    process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/nhan9800/Website-Mini-Bot',
};
