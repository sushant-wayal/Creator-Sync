import Link from "next/link"
import { Logo } from "./Logo"
import { websiteName } from "@/constants"

interface NavbarProps {
  links: { name: string, url: string }[]
}

export const Navbar : React.FC<NavbarProps> = ({ links }) => {
  return (
    <nav className="w-full h-16 flex px-3 py-2 justify-between items-center bg-white text0black">
      <Link href="/" className="flex justify-center items-center gap-2">
        <Logo size={24} />
        <h1 className="font-bold text-2xl">{websiteName}</h1>
      </Link>
      <div className="flex gap-8 justify-center items-center">
        {links.map(({ name, url }) => (
          <Link key={name} href={url} className="font-semibold hover:underline">
            {name}
          </Link>
        ))}
      </div>
    </nav>
  )
}