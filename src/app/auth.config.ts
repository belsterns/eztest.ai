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
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user.id as string;
        token.role = (user as any).role as string;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }: any) {
      console.log("session ---------->>", session);
      console.log("token ---------->>", token);

      return { ...session, user: token };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
