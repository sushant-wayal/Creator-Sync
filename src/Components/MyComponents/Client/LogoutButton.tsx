"use client";

import { Button } from "@/Components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  return (
    <Button variant="outline" className="flex justify-center items-center gap-2 font-semibold hover:underline"
      onClick={async () => {
        await signOut({
          redirectTo: "/signin"
        });
        router.push("/");
      }}
    >
      <LogOut size={24} />
      <p>Logout</p>
    </Button>
  )
}