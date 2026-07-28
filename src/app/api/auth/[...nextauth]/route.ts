import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.isVerified = true;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'mimi-bot-super-secret-key-12345',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
