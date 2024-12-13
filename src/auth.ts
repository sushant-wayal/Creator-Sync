import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"
import { db } from "@/lib/db"
import Google from "next-auth/providers/google"
import { sendEmail } from "./helper/mailer"
import { FORGOT_PASSWORD_EMAIL, PASSWORD_NOT_SET, VERIFICATION_EMAIL } from "./constants"
 
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
        gender: {}
      },
      authorize: async ({ usernameOrEmail, password, newUser, name, username, email, dob, gender }) => {
        console.log("credentials")
        console.log("usernameOrEmail", usernameOrEmail);
        console.log("password", password);
        console.log("newUser", newUser);
        console.log("name", name);
        console.log("username", username);
        console.log("email", email);
        console.log("dob", dob);
        console.log("gender", gender);
        if (newUser == "true") {
          console.log("new User", newUser);
          const hashedPassword = await hash(password as string, 10);
          const user = await db.user.create({
            data: {
              name: name as string,
              username: username as string,
              email: email as string,
              dob: new Date(dob as string),
              gender: gender as "MALE" || "FEMALE" || "OTHER",
              password: hashedPassword,
            },
          });
          await sendEmail(user.email, VERIFICATION_EMAIL);
          return user;
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
          if (user && user.email) await sendEmail(user.email, FORGOT_PASSWORD_EMAIL);
          throw new Error(PASSWORD_NOT_SET);
        }
        const passwordMatch = await compare(password as string, user.password as string);
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
          await sendEmail(profile.email, VERIFICATION_EMAIL);
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