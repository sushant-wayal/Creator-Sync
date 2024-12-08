import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        usernameOrEmail: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.usernameOrEmail as string },
              { username: credentials.usernameOrEmail as string },
            ],
          },
        });
        if (!user) throw new Error("No user found");
        const passwordMatch = await compare(credentials.password as string, user.password as string);
        if (!passwordMatch) throw new Error("Password does not match");
        return user;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      try {
        if (account?.provider === "credentials") {
          return `/signup`;
        }
        if (!profile) throw new Error("Profile is undefined");
        const User = await db.user.findFirst({
          where: { email: profile.email as string },
        });
        if (User) return true;
        await db.user.create({
          data: {
            email: profile.email as string,
            username: profile.email as string,
            name: profile.name as string,
            emailVerified: profile.email_verified as boolean
          },
        });
        return true;
      } catch (error: any) {
        throw new Error(`Error Signing In : ${error.message}`);
        // return false;
      }
    },
    async jwt({ token, user }) {
      if (!user) return token;
      token.id = user.id;
      token.email = user.email;
      token.username = user.username;
      return token;
    },
    async session({ session, token }) {
      if (!token) return session;
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
})