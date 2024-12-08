"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface NavBarProps {
  className?: string;
}

export const NavBar : React.FC<NavBarProps> = ({ className }) => {
  const session = useSession();
  return (
    <nav
      className={`fixed z-10 top-0 left-0 w-full flex justify-between items-center p-2 bg-[#333333] text-white ${className}`}
    >
      <h1
        className="text-2xl"
      >Creator Sync</h1>
      <ul
        className="flex gap-10"
      >
        <li>
          <Link href="/">Home</Link>
        </li>
        {session.status == "authenticated" ? (
          <>
            <li>
              <button onClick={() => signOut()}>Sign Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/signin">Sign In</Link>
            </li>
            <li>
              <Link href="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};