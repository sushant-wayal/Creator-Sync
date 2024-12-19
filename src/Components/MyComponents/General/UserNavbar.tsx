import Link from "next/link"
import { Logo } from "./Logo"
import { websiteName } from "@/constants"
import { LayoutDashboard, SquarePlus } from "lucide-react"
import { auth } from "@/auth"
import { ProfilePicture } from "./ProfilePicture"
import { LogoutButton } from "../Client/LogoutButton"

export const UserNavbar = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not logged in");
  }
  const { name, profilePicture, username } = session.user;
  return (
    <nav className="w-full h-16 flex px-3 py-2 justify-between items-center bg-white text-black border-b-[1px] border-gray-200">
      <Link href="/" className="flex justify-center items-center gap-2">
        <Logo size={24} />
        <h1 className="font-bold text-2xl">{websiteName}</h1>
      </Link>
      <div className="flex gap-8 justify-center items-center">
        <Link href="/dashboard" className="flex justify-center items-center gap-2 font-semibold hover:underline">
          <LayoutDashboard size={24} />
          <p>Dashboard</p>
        </Link>
        <Link href="/new-project" className="flex justify-center items-center gap-2 font-semibold hover:underline">
          <SquarePlus size={24} />
          <p>New Project</p>
        </Link>
        <Link href={`/profile/${username}`} className="flex justify-center items-center gap-2 font-semibold hover:underline">
          <ProfilePicture url={profilePicture} name={name ?? undefined} />
          <p>Profile</p>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  )
}