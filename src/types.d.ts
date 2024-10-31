declare module "next-auth" {
  interface User {
    id: string
    email: string
    username: string
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