declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    username: string
    profilePicture: string
  }
  interface Account {}
  interface Session {
    user: User & DefaultSession["user"]
  }
}

import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
 
declare module "next-auth/jwt" {
  interface JWT {}
}