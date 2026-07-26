export const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://mimibot.id.vn',
  NEXT_PUBLIC_DISCORD_SUPPORT_URL: process.env.NEXT_PUBLIC_DISCORD_SUPPORT_URL || 'https://discord.gg/q8CfajzPuc',
  NEXT_PUBLIC_BOT_INVITE_URL: process.env.NEXT_PUBLIC_BOT_INVITE_URL || 'https://discord.com/oauth2/authorize?client_id=1327164993883832381&permissions=8&scope=bot%20applications.commands',
  MIMI_API_HOST: process.env.MIMI_API_HOST || 'http://127.0.0.1',
  MIMI_API_PORT: process.env.MIMI_API_PORT || '4869',
  MIMI_API_TOKEN: process.env.MIMI_API_TOKEN || 'mimi-secret-api-token',
};
