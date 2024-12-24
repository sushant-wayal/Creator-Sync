import type { Metadata } from "next";
import "../globals.css";
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar";

export const metadata: Metadata = {
  title: "Creator Sync | Main"
};

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <UserNavbar/>
      {children}
    </>
  );
}
