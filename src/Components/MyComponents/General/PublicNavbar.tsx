import Link from "next/link"
import { Logo } from "./Logo"
import { websiteName } from "@/constants"
import { Home, LogIn, User } from "lucide-react"
import { LogoutButton } from "../Client/LogoutButton"

export const PublicNavbar = async () => {
  return (
    <nav className="w-full h-16 flex px-3 py-2 justify-between items-center bg-white text-black border-b-[1px] border-gray-200">
      <Link href="/" className="flex justify-center items-center gap-2">
        <Logo size={24} />
        <h1 className="font-bold text-2xl">{websiteName}</h1>
      </Link>
      <div className="flex gap-8 justify-center items-center">
        <Link href="/" className="flex justify-center items-center gap-2 font-semibold hover:underline">
          <Home size={24} />
          <p>Home</p>
        </Link>
        <Link href="/signin" className="flex justify-center items-center gap-2 font-semibold hover:underline">
          <LogIn size={24} />
          <p>Sign In</p>
        </Link>
        <Link href="/signup" className="flex justify-center items-center gap-2 font-semibold hover:underline">
          <User size={24}/>
          <p>Sign up</p>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  )
}