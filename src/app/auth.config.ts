import type { NextAuthConfig } from "next-auth";

export default {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_info = user.user_info;
        token.auth_info = user.auth_info;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        data: {
          user_info: token.user_info,
          auth_info: token.auth_info,
        },
      };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
