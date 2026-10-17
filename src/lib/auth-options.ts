import 'server-only';
import type { NextAuthOptions, Session } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

type DiscordSessionUser = NonNullable<Session['user']> & { id?: string; isVerified?: boolean };

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as DiscordSessionUser;
        user.id = token.sub;
        user.isVerified = Boolean(token.sub);
      }
      return session;
    },
  },
  // NextAuth không được ký phiên production bằng một khoá mặc định công khai.
  secret: process.env.NEXTAUTH_SECRET,
};
