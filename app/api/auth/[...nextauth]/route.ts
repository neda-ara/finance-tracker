import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ROUTES } from "@/lib/constants/constants";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existing = await db.query("SELECT id FROM users WHERE email = $1", [
        user.email,
      ]);

      let userId: string;

      if (existing.rowCount) {
        userId = existing.rows[0].id;
      } else {
        const result = await db.query(
          "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING id",
          [user.email, user.name || user.email],
        );

        userId = result.rows[0].id;
      }

      await createSession(userId);

      return true;
    },
  },

  pages: {
    signIn: ROUTES.AUTH.LOGIN,
  },
});

export { handler as GET, handler as POST };
