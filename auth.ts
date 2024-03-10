import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      // console.log('SIGNIN', user, account)
      if (account?.provider !== "credentials") return true;

      if (user.email) {
        return true;
      }

      return false;
    },
    async session({ token, session }) {
      // console.log('SESSION', token, session)
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? '';
      }

      return session;
    },
    async jwt({ token }) {
      // console.log('JWT', token)
      if (!token.sub) return token;

      return token;
    }
  },
  ...authConfig,
});
