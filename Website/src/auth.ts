import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"
import { db } from "@/lib/db"
import Google from "next-auth/providers/google"
import { domain, FORGOT_PASSWORD_EMAIL, PASSWORD_NOT_SET, VERIFICATION_EMAIL } from "./constants"
import axios from "axios"
import { User as PrismaUser } from "@prisma/client"

interface User extends PrismaUser {
  profilePicture: string;
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        usernameOrEmail: {},
        password: {},
        newUser: {},
        name: {},
        username: {},
        email: {},
        dob: {},
        gender: {},
        profilePicture: {},
      },
      authorize: async ({ usernameOrEmail, password, newUser, name, username, email, dob, gender, profilePicture }): Promise<User | null> => {
        ("credentials")
        if (newUser == "true") {
          const hashedPassword = await hash(password as string, 10);
          const user = await db.user.create({
            data: {
              name: name as string,
              username: username as string,
              email: email as string,
              dob: new Date(dob as string),
              gender: gender as "MALE" || "FEMALE" || "OTHER",
              password: hashedPassword,
              profilePicture: profilePicture as string,
            },
          });
          await axios.post(`${domain}/api/send-email`, { email: user.email, emailType: VERIFICATION_EMAIL });
          return { ...user, profilePicture: user.profilePicture || '' };
        }
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: usernameOrEmail as string },
              { username: usernameOrEmail as string },
            ],
          },
        });
        if (!user) throw new Error("No user found");
        if (!user.password) {
          await axios.post(`${domain}/api/send-email`, { email: user.email, emailType: FORGOT_PASSWORD_EMAIL });
          throw new Error(PASSWORD_NOT_SET);
        }
        const passwordMatch = await compare(password as string, user.password as string);
        if (!passwordMatch) throw new Error("Password does not match");
        return { ...user, profilePicture: user.profilePicture || '' };
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
        if (account?.provider === "credentials") return true;
        if (!profile) throw new Error("Profile is undefined");
        const User = await db.user.findFirst({
          where: { email: profile.email as string },
        });
        if (User?.emailVerified == true) return true;
        else if (User?.emailVerified == false) throw new Error("Already Signed Up, with same email.");
        await db.user.create({
          data: {
            email: profile.email as string,
            username: profile.email as string,
            name: profile.name as string,
            emailVerified: profile.email_verified as boolean,
            profilePicture: profile.picture as string,
          },
        });
        if (profile.email) {
          await axios.post(`${domain}/api/send-email`, { email: profile.email, emailType: VERIFICATION_EMAIL });
        } else {
          throw new Error("Email is undefined");
        }
        return true;
      } catch (error: any) {
        throw new Error(`Error Signing In : ${error.message}`);
      }
    },
    async jwt({ token, user }) {
      if (!user) return token;
      token.id = user.id;
      token.email = user.email;
      token.username = user.username || user.email;
      token.profilePicture = user.profilePicture || user.image;
      return token;
    },
    async session({ session, token }) {
      if (!token) return session;
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.profilePicture = token.profilePicture as string;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
})