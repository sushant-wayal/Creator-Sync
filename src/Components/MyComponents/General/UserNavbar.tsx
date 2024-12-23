import Link from "next/link"
import { Logo } from "./Logo"
import { websiteName } from "@/constants"
import { auth } from "@/auth"
import { ProfilePicture } from "./ProfilePicture"
import { LogoutButton } from "../Client/LogoutButton"
import { db } from "@/lib/db"
import { UserNavBarNavigation } from "../Client/UserNavBarNavigation"
import { totalUnreadNotifications } from "@/actions/notification"
import { totalUnreadRequests } from "@/actions/requestEditor"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Button } from "@/Components/ui/button"
import { UserCircle } from "lucide-react"

export const UserNavbar = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not logged in");
  }
  const { name, profilePicture, id } = session.user;
  const user = await db.user.findUnique({
    where: {
      id
    },
    select: {
      readyToEdit: true
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const { readyToEdit } = user;
  const unreadNotifications = await totalUnreadNotifications();
  const unreadRequests = await totalUnreadRequests();
  return (
    <nav className="w-full h-16 flex px-3 py-2 justify-between items-center bg-white text-black border-b-[1px] border-gray-200">
      <Link href="/" className="flex justify-center items-center gap-2">
        <Logo size={24} />
        <h1 className="font-bold text-2xl">{websiteName}</h1>
      </Link>
      <UserNavBarNavigation readyToEdit={readyToEdit} unreadNotifications={unreadNotifications} unreadRequests={unreadRequests}/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex justify-center items-center gap-2 font-semibold w-fit aspect-square rounded-full hover:bg-none">
            <ProfilePicture url={profilePicture} name={name ?? undefined} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 mx-5">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/profile/${session.user.username}`} className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}